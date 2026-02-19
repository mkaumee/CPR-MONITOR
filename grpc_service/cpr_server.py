
import time
import grpc
import random
import logging
from concurrent import futures

import cpr_monitor_pb2
import cpr_monitor_pb2_grpc


# ==============================
# Simple in-memory session store
# ==============================
sessions = {}


def current_time_ms():
    return int(time.time() * 1000)


# ==============================
# CPR Monitor Servicer
# ==============================
class CPRMonitorServicer(cpr_monitor_pb2_grpc.CPRMonitorServicer):

    # ---------- Initialize ----------
    def Initialize(self, request, context):
        session_id = request.config.session_id

        sessions[session_id] = {
            "start_time": current_time_ms(),
            "compressions": 0,
            "cpm": 0,
            "last_compression_time": current_time_ms(),
        }

        print(f"Session initialized: {session_id}")

        return cpr_monitor_pb2.InitializeResponse(
            success=True,
            message="Session initialized",
            session_id=session_id,
        )

    # ---------- Start Detection ----------
    def StartDetection(self, request, context):
        session_id = request.session_id

        if session_id not in sessions:
            context.abort(grpc.StatusCode.NOT_FOUND, "Session not found")

        sessions[session_id]["start_time"] = current_time_ms()

        return cpr_monitor_pb2.StartDetectionResponse(
            success=True,
            message="Detection started",
            start_time_ms=current_time_ms(),
        )

    # ---------- Stop Detection ----------
    def StopDetection(self, request, context):
        session_id = request.session_id

        if session_id not in sessions:
            context.abort(grpc.StatusCode.NOT_FOUND, "Session not found")

        s = sessions[session_id]
        duration = current_time_ms() - s["start_time"]

        metrics = self._build_metrics(session_id, duration)

        return cpr_monitor_pb2.StopDetectionResponse(
            success=True,
            final_metrics=metrics,
        )

    # ---------- Process Camera Frame ----------
    def ProcessFrame(self, request, context):
        session_id = request.session_id

        if session_id not in sessions:
            context.abort(grpc.StatusCode.NOT_FOUND, "Session not found")

        s = sessions[session_id]

        # Simulated compression detection
        if random.random() > 0.6:
            s["compressions"] += 1
            s["last_compression_time"] = current_time_ms()

        # Simulated CPM calculation
        s["cpm"] = random.randint(90, 130)

        metrics = self._build_metrics(session_id)

        return cpr_monitor_pb2.ProcessFrameResponse(
            current_metrics=metrics
        )

    # ---------- Stream Metrics ----------
    def StreamMetrics(self, request, context):
        session_id = request.session_id
        interval = request.update_interval_ms / 1000

        if session_id not in sessions:
            context.abort(grpc.StatusCode.NOT_FOUND, "Session not found")

        print(f"Streaming metrics for {session_id}")

        while True:
            metrics = self._build_metrics(session_id)
            yield metrics
            time.sleep(interval)

    # ---------- Coaching Feedback ----------
    def GetCoachingFeedback(self, request, context):
        session_id = request.session_id

        if session_id not in sessions:
            context.abort(grpc.StatusCode.NOT_FOUND, "Session not found")

        cpm = sessions[session_id]["cpm"]

        if cpm < 100:
            feedback_type = cpr_monitor_pb2.CoachingFeedback.TOO_SLOW
            msg = "Push faster!"
        elif cpm > 120:
            feedback_type = cpr_monitor_pb2.CoachingFeedback.TOO_FAST
            msg = "Slow down!"
        else:
            feedback_type = cpr_monitor_pb2.CoachingFeedback.PERFECT
            msg = "Good rhythm!"

        return cpr_monitor_pb2.CoachingFeedback(
            type=feedback_type,
            message=msg,
            current_cpm=cpm,
            timestamp_ms=current_time_ms(),
        )

    # ---------- Helper ----------
    def _build_metrics(self, session_id, duration=None):
        s = sessions[session_id]

        if duration is None:
            duration = current_time_ms() - s["start_time"]

        return cpr_monitor_pb2.CPRMetrics(
            compressions_per_minute=s["cpm"],
            total_compressions=s["compressions"],
            session_duration_ms=duration,
            average_compression_interval_ms=600.0,
            is_rhythm_optimal=100 <= s["cpm"] <= 120,
            compressions_above_threshold=0,
            compressions_below_threshold=0,
            start_time_ms=s["start_time"],
            last_update_ms=current_time_ms(),
        )


# ==============================
# Start Server
# ==============================
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    cpr_monitor_pb2_grpc.add_CPRMonitorServicer_to_server(
        CPRMonitorServicer(), server
    )

    server.add_insecure_port("[::]:50051")
    print("CPR Monitor gRPC server running on port 50051")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
