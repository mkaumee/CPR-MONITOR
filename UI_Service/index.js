import React, { useState } from "react";
import StyledButton from "@integratedComponents/StyledButton";
import "./style.css";

const ServiceUI = ({ serviceClient }) => {
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const runUnaryMethod = async (methodName) => {
        setLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);

            // Mock responses based on method
            switch(methodName) {
                case "initializeSession":
                    const sid = `cpr_${Date.now()}`;
                    setSessionId(sid);
                    setOutput({
                        success: true,
                        message: "Session initialized successfully",
                        sessionId: sid,
                        timestamp: new Date().toISOString()
                    });
                    break;

                case "processFrame":
                    if (!selectedFile) {
                        setError("Please select an image file first");
                        return;
                    }
                    setOutput({
                        success: true,
                        message: "Frame processed successfully",
                        detectedPose: {
                            keypoints: 17,
                            confidence: 0.87
                        },
                        compressions: 3,
                        timestamp: new Date().toISOString()
                    });
                    break;

                case "getMetrics":
                    setOutput({
                        compressions_per_minute: 112,
                        total_compressions: 45,
                        session_duration_ms: 24000,
                        is_rhythm_optimal: true,
                        compressions_above_threshold: 42,
                        compressions_below_threshold: 3
                    });
                    break;

                case "getCoachingFeedback":
                    setOutput({
                        type: "PERFECT",
                        message: "Perfect rhythm! Keep going at 112 compressions per minute.",
                        current_cpm: 112,
                        timestamp: Date.now()
                    });
                    break;

                case "startDetection":
                    setOutput({
                        success: true,
                        message: "Detection started",
                        start_time_ms: Date.now()
                    });
                    break;

                case "stopDetection":
                    setOutput({
                        success: true,
                        message: "Detection stopped",
                        final_metrics: {
                            total_compressions: 45,
                            average_cpm: 110,
                            session_duration: "24 seconds"
                        }
                    });
                    break;

                default:
                    setOutput({ success: true, message: `${methodName} executed` });
            }
        }, 800);
    };

    return (
        <div className="service-container">
            {/* Session Card */}
            <div className="card">
                <div className="card-header">
                    <h3>Session</h3>
                </div>
                <div className="card-body">
                    {sessionId ? (
                        <div className="session-active">
                            <span className="badge">Active</span>
                            <code className="session-id">{sessionId}</code>
                        </div>
                    ) : (
                        <p className="muted">No active session</p>
                    )}
                </div>
            </div>

            {/* Upload Card */}
            <div className="card">
                <div className="card-header">
                    <h3>Upload Frame</h3>
                </div>
                <div className="card-body">
                    <div className="upload-zone">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="file-upload"
                            hidden
                        />
                        <label htmlFor="file-upload" className="upload-label">
                            <span className="upload-icon">📤</span>
                            <span>{selectedFile ? selectedFile.name : 'Choose an image'}</span>
                        </label>
                    </div>
                    
                    {filePreview && (
                        <div className="preview">
                            <img src={filePreview} alt="Preview" />
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="card">
                <div className="card-header">
                    <h3>Controls</h3>
                </div>
                <div className="card-body">
                    <div className="controls">
                        <StyledButton
                            btnText="Initialize Session"
                            variant="contained"
                            onClick={() => runUnaryMethod("initializeSession")}
                            disabled={loading}
                        />

                        <StyledButton
                            btnText="Process Frame"
                            variant="contained"
                            onClick={() => runUnaryMethod("processFrame")}
                            disabled={loading || !selectedFile}
                        />

                        <StyledButton
                            btnText="Start Detection"
                            variant="contained"
                            onClick={() => runUnaryMethod("startDetection")}
                            disabled={loading}
                        />

                        <StyledButton
                            btnText="Stop Detection"
                            variant="contained"
                            onClick={() => runUnaryMethod("stopDetection")}
                            disabled={loading}
                        />

                        <StyledButton
                            btnText="Get Metrics"
                            variant="contained"
                            onClick={() => runUnaryMethod("getMetrics")}
                            disabled={loading}
                        />

                        <StyledButton
                            btnText="Get Coaching"
                            variant="contained"
                            onClick={() => runUnaryMethod("getCoachingFeedback")}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Output */}
            <div className="card">
                <div className="card-header">
                    <h3>Output</h3>
                </div>
                <div className="card-body">
                    {loading && <div className="loader">Processing...</div>}
                    
                    {error && <div className="error">{error}</div>}
                    
                    {!loading && !error && !output && (
                        <p className="muted">No output yet</p>
                    )}
                    
                    {output && !loading && (
                        <pre className="output">{JSON.stringify(output, null, 2)}</pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceUI;
