"""
CPR Monitor — Core Backend Application
Contains the CPR analysis engine, coaching logic, compression detection
configuration, and serves the frontend interface.
"""

import os
import time
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# ---------------------------------------------------------------------------
# App Setup
# ---------------------------------------------------------------------------
app = Flask(__name__, static_folder=None)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)


# ---------------------------------------------------------------------------
# CPR Detection Configuration
# Mirrors the constants used in the frontend JS detection engine
# ---------------------------------------------------------------------------
CPR_CONFIG = {
    "min_peak_gap_ms": 250,         # Minimum time between compression peaks
    "chest_drop_threshold": 8,       # Pixel movement threshold for compression
    "cpm_window_ms": 20000,          # Sliding window for CPM calculation (20s)
    "frame_skip": 1,                 # Number of frames to skip for performance
    "target_cpm": 110,               # Ideal compressions per minute (AHA guideline)
    "feedback_cooldown_ms": 3000,    # Minimum gap between coaching messages

    # AHA-recommended CPM ranges
    "cpm_range_optimal_min": 100,
    "cpm_range_optimal_max": 120,
    "cpm_range_acceptable_min": 90,
    "cpm_range_acceptable_max": 140,

    # Metronome
    "metronome_bpm": 110,
    "beep_frequency_hz": 800,
    "beep_duration_ms": 100,
    "beep_volume": 0.3,

    # Camera
    "camera_width": 320,
    "camera_height": 240,
    "camera_fps": 20,

    # Model
    "model_type": "MoveNet",
    "model_variant": "SinglePose Lightning",
    "confidence_threshold": 0.3,
}


# ---------------------------------------------------------------------------
# CPR Analysis Engine
# Core compression rate analysis and coaching feedback logic
# ---------------------------------------------------------------------------
class CPRAnalyzer:
    """
    Analyzes CPR compression data and generates coaching feedback.
    This is the Python equivalent of the detection logic in cpr-monitor.js.
    """

    def __init__(self):
        self.config = CPR_CONFIG

    def compute_cpm(self, timestamps_ms):
        """
        Calculate compressions per minute from a list of compression timestamps.
        Uses a sliding window to compute the average interval.

        Args:
            timestamps_ms: List of compression timestamps in milliseconds

        Returns:
            int: Current compressions per minute (0 if insufficient data)
        """
        if len(timestamps_ms) < 2:
            return 0

        now = timestamps_ms[-1]
        window = self.config["cpm_window_ms"]

        # Filter to timestamps within the sliding window
        recent = [t for t in timestamps_ms if now - t <= window]

        if len(recent) < 2:
            return 0

        # Calculate average interval between compressions
        intervals = []
        for i in range(1, len(recent)):
            intervals.append(recent[i] - recent[i - 1])

        avg_interval = sum(intervals) / len(intervals)

        if avg_interval <= 0:
            return 0

        return round(60000 / avg_interval)

    def is_compression(self, current_y, previous_y, time_since_last_peak_ms):
        """
        Determine if a wrist movement constitutes a compression.

        Args:
            current_y: Current wrist Y position (pixels)
            previous_y: Previous wrist Y position (pixels)
            time_since_last_peak_ms: Time since last detected compression

        Returns:
            bool: True if this is a valid compression
        """
        dy = current_y - previous_y
        min_gap = self.config["min_peak_gap_ms"]
        threshold = self.config["chest_drop_threshold"]

        return dy > threshold and time_since_last_peak_ms > min_gap

    def classify_rate(self, cpm):
        """
        Classify the compression rate into a feedback category.

        Args:
            cpm: Current compressions per minute

        Returns:
            dict: Classification with type, color, and whether it's in range
        """
        if cpm == 0:
            return {
                "type": "no_data",
                "label": "Waiting",
                "color": "#666666",
                "in_range": False,
            }

        opt_min = self.config["cpm_range_optimal_min"]
        opt_max = self.config["cpm_range_optimal_max"]
        acc_min = self.config["cpm_range_acceptable_min"]
        acc_max = self.config["cpm_range_acceptable_max"]

        if opt_min <= cpm <= opt_max:
            return {
                "type": "perfect",
                "label": "Perfect",
                "color": "#28a745",
                "in_range": True,
            }
        elif acc_min <= cpm < opt_min:
            return {
                "type": "speed_up",
                "label": "Speed Up",
                "color": "#ffc107",
                "in_range": False,
            }
        elif opt_max < cpm <= acc_max:
            return {
                "type": "slow_down",
                "label": "Slow Down",
                "color": "#ffc107",
                "in_range": False,
            }
        elif cpm < acc_min:
            return {
                "type": "too_slow",
                "label": "Too Slow",
                "color": "#dc3545",
                "in_range": False,
            }
        else:
            return {
                "type": "too_fast",
                "label": "Too Fast",
                "color": "#dc3545",
                "in_range": False,
            }

    def generate_coaching(self, cpm):
        """
        Generate coaching feedback message based on current CPM.
        Mirrors the provideCPRCoaching() function in cpr-monitor.js.

        Args:
            cpm: Current compressions per minute

        Returns:
            dict: Coaching feedback with voice message and display message
        """
        classification = self.classify_rate(cpm)

        coaching_map = {
            "no_data": {
                "voice": "Begin chest compressions now. Follow the beep rhythm.",
                "display": "Start Compressions",
            },
            "too_slow": {
                "voice": f"Too slow. Increase your speed. Current rate {cpm} per minute.",
                "display": f"Too Slow: {cpm} CPM",
            },
            "speed_up": {
                "voice": f"Speed up slightly. You're at {cpm} compressions per minute.",
                "display": f"Speed Up: {cpm} CPM",
            },
            "perfect": {
                "voice": f"Perfect rhythm! Keep going at {cpm} compressions per minute.",
                "display": f"Perfect: {cpm} CPM",
            },
            "slow_down": {
                "voice": f"Slow down a bit. You're going {cpm} per minute.",
                "display": f"Slow Down: {cpm} CPM",
            },
            "too_fast": {
                "voice": "Too fast. Reduce your pace. Follow the beep rhythm.",
                "display": f"Too Fast: {cpm} CPM",
            },
        }

        feedback = coaching_map.get(classification["type"], coaching_map["no_data"])

        return {
            "classification": classification,
            "voice_message": feedback["voice"],
            "display_message": feedback["display"],
            "cpm": cpm,
            "target_cpm": self.config["target_cpm"],
            "deviation": cpm - self.config["target_cpm"] if cpm > 0 else 0,
        }

    def evaluate_session(self, total_compressions, cpm_readings, duration_seconds):
        """
        Evaluate a complete CPR session and generate a performance summary.

        Args:
            total_compressions: Total number of compressions
            cpm_readings: List of CPM values recorded during the session
            duration_seconds: Session duration in seconds

        Returns:
            dict: Complete session evaluation
        """
        if not cpm_readings or total_compressions == 0:
            return {
                "quality_score": 0,
                "average_cpm": 0,
                "peak_cpm": 0,
                "min_cpm": 0,
                "in_range_count": 0,
                "out_range_count": 0,
                "in_range_percent": 0,
                "grade": "N/A",
                "feedback": "No compressions detected.",
            }

        opt_min = self.config["cpm_range_optimal_min"]
        opt_max = self.config["cpm_range_optimal_max"]

        avg_cpm = round(sum(cpm_readings) / len(cpm_readings), 1)
        peak_cpm = max(cpm_readings)
        min_cpm = min(cpm_readings)
        in_range = sum(1 for c in cpm_readings if opt_min <= c <= opt_max)
        out_range = len(cpm_readings) - in_range
        quality_score = round((in_range / len(cpm_readings)) * 100, 1)

        # Assign a letter grade
        if quality_score >= 90:
            grade = "A"
        elif quality_score >= 75:
            grade = "B"
        elif quality_score >= 60:
            grade = "C"
        elif quality_score >= 40:
            grade = "D"
        else:
            grade = "F"

        # Build feedback
        feedback_parts = []

        # Duration
        if duration_seconds >= 120:
            minutes = duration_seconds // 60
            feedback_parts.append(f"Great endurance! Session lasted {minutes} minutes.")
        elif duration_seconds >= 30:
            feedback_parts.append(f"Session lasted {duration_seconds} seconds.")
        else:
            feedback_parts.append("Very short session — try to practice longer.")

        # Rate
        if opt_min <= avg_cpm <= opt_max:
            feedback_parts.append(
                f"Excellent average rate of {avg_cpm} CPM — right in the AHA recommended range."
            )
        elif avg_cpm < opt_min:
            feedback_parts.append(
                f"Average rate was {avg_cpm} CPM — try to increase to {opt_min}-{opt_max} CPM."
            )
        else:
            feedback_parts.append(
                f"Average rate was {avg_cpm} CPM — try to slow down to {opt_min}-{opt_max} CPM."
            )

        # Quality
        if quality_score >= 90:
            feedback_parts.append("Outstanding rhythm consistency!")
        elif quality_score >= 70:
            feedback_parts.append("Good consistency — keep practicing.")
        elif quality_score >= 50:
            feedback_parts.append("Moderate consistency — focus on following the metronome.")
        else:
            feedback_parts.append("Needs work — practice matching the metronome beat.")

        return {
            "quality_score": quality_score,
            "average_cpm": avg_cpm,
            "peak_cpm": peak_cpm,
            "min_cpm": min_cpm,
            "in_range_count": in_range,
            "out_range_count": out_range,
            "in_range_percent": quality_score,
            "grade": grade,
            "feedback": " ".join(feedback_parts),
        }


# Initialize the global analyzer
analyzer = CPRAnalyzer()


# ---------------------------------------------------------------------------
# API — Serve Frontend
# ---------------------------------------------------------------------------
@app.route("/")
def serve_index():
    """Serve the main CPR Monitor interface."""
    return send_from_directory(PROJECT_ROOT, "index.html")


@app.route("/<path:filename>")
def serve_static(filename):
    """Serve frontend static files (JS, CSS, assets)."""
    if filename.startswith("backend"):
        return jsonify({"error": "Not found"}), 404
    return send_from_directory(PROJECT_ROOT, filename)


# ---------------------------------------------------------------------------
# API — CPR Analysis Endpoints
# ---------------------------------------------------------------------------
@app.route("/api/analyze", methods=["POST"])
def analyze_compressions():
    """
    Analyze a set of compression timestamps and return CPM + coaching feedback.
    This is the core analysis endpoint that the frontend can call.

    Expected JSON body:
    {
        "timestamps_ms": [1000, 1550, 2100, 2650, 3200, ...]
    }

    Returns:
        CPM calculation, rate classification, and coaching feedback.
    """
    data = request.get_json()
    if not data or "timestamps_ms" not in data:
        return jsonify({"error": "timestamps_ms array is required"}), 400

    timestamps = data["timestamps_ms"]
    cpm = analyzer.compute_cpm(timestamps)
    coaching = analyzer.generate_coaching(cpm)

    return jsonify({
        "cpm": cpm,
        "total_compressions": len(timestamps),
        "coaching": coaching,
    })


@app.route("/api/evaluate", methods=["POST"])
def evaluate_session():
    """
    Evaluate a completed CPR session and return a performance report.

    Expected JSON body:
    {
        "total_compressions": 150,
        "cpm_readings": [105, 110, 108, 115, 112, ...],
        "duration_seconds": 120
    }

    Returns:
        Quality score, grade, and detailed feedback.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    result = analyzer.evaluate_session(
        total_compressions=data.get("total_compressions", 0),
        cpm_readings=data.get("cpm_readings", []),
        duration_seconds=data.get("duration_seconds", 0),
    )

    return jsonify({"evaluation": result})


@app.route("/api/check-compression", methods=["POST"])
def check_compression():
    """
    Check if a wrist movement constitutes a valid compression.

    Expected JSON body:
    {
        "current_y": 245.5,
        "previous_y": 230.0,
        "time_since_last_peak_ms": 400
    }

    Returns:
        Whether the movement is a valid compression.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    is_valid = analyzer.is_compression(
        current_y=data.get("current_y", 0),
        previous_y=data.get("previous_y", 0),
        time_since_last_peak_ms=data.get("time_since_last_peak_ms", 0),
    )

    return jsonify({"is_compression": is_valid})


@app.route("/api/coaching", methods=["POST"])
def get_coaching():
    """
    Get coaching feedback for a given CPM value.

    Expected JSON body:
    {
        "cpm": 115
    }

    Returns:
        Voice message, display message, classification, and deviation from target.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    cpm = data.get("cpm", 0)
    coaching = analyzer.generate_coaching(cpm)

    return jsonify({"coaching": coaching})


# ---------------------------------------------------------------------------
# API — Configuration
# ---------------------------------------------------------------------------
@app.route("/api/config", methods=["GET"])
def get_config():
    """Get the current CPR detection configuration."""
    return jsonify({"config": CPR_CONFIG})


@app.route("/api/config", methods=["PUT"])
def update_config():
    """
    Update CPR detection configuration values.
    Only provided fields are updated; others remain unchanged.

    Example JSON body:
    {
        "target_cpm": 110,
        "chest_drop_threshold": 10
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    updated = []
    for key, value in data.items():
        if key in CPR_CONFIG:
            CPR_CONFIG[key] = value
            updated.append(key)

    # Sync analyzer config
    analyzer.config = CPR_CONFIG

    return jsonify({
        "message": f"Updated {len(updated)} config values",
        "updated_keys": updated,
        "config": CPR_CONFIG,
    })


# ---------------------------------------------------------------------------
# API — Health Check
# ---------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "CPR Monitor Backend",
        "version": "1.0.0",
        "model": CPR_CONFIG["model_type"],
        "target_cpm": CPR_CONFIG["target_cpm"],
        "timestamp": datetime.utcnow().isoformat() + "Z",
    })


# ---------------------------------------------------------------------------
# Run Server
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("=" * 60)
    print("  CPR Monitor — Core Backend")
    print("=" * 60)
    print(f"  Frontend    : {PROJECT_ROOT}")
    print(f"  Server      : http://localhost:5000")
    print(f"  Target CPM  : {CPR_CONFIG['target_cpm']}")
    print(f"  Model       : {CPR_CONFIG['model_type']} ({CPR_CONFIG['model_variant']})")
    print("=" * 60)
    print()
    print("  Endpoints:")
    print("    GET  /                  → CPR Monitor UI")
    print("    POST /api/analyze       → Analyze compression timestamps")
    print("    POST /api/evaluate      → Evaluate a completed session")
    print("    POST /api/check-compression → Check if movement is a compression")
    print("    POST /api/coaching      → Get coaching feedback for a CPM value")
    print("    GET  /api/config        → Get detection configuration")
    print("    PUT  /api/config        → Update detection configuration")
    print("    GET  /api/health        → Health check")
    print("=" * 60)

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
    )
