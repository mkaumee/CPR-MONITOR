import React, { useState, useEffect } from "react";
import StyledButton from "@integratedComponents/StyledButton";
import "./style.css";

const ServiceUI = ({ serviceClient }) => {
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        if (serviceClient && serviceClient.client) {
            console.log("🔍 serviceClient.client:", serviceClient.client);
            console.log("🔍 Keys:", Object.keys(serviceClient.client));
        }
    }, [serviceClient]);

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
            
            console.log("📁 File selected:", file.name);
        }
    };

    const fileToBytes = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const bytes = new Uint8Array(arrayBuffer);
                resolve(bytes);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const runUnaryMethod = async (methodName) => {
        setLoading(true);
        setError(null);

        try {
            const service = serviceClient?.client?.CPRMonitorServiceService;
            
            if (!service) {
                console.error("❌ CPRMonitorServiceService not found");
                console.log("Available:", Object.keys(serviceClient?.client || {}));
                setError("Service not initialized");
                setLoading(false);
                return;
            }

            const methodDescriptor = service[methodName];

            if (!methodDescriptor) {
                const errorMsg = `Method "${methodName}" not found`;
                console.error("❌", errorMsg);
                console.log("Available methods:", Object.keys(service));
                setError(errorMsg);
                setOutput({ error: errorMsg, availableMethods: Object.keys(service) });
                setLoading(false);
                return;
            }

            console.log("✅ Found method:", methodName);

            const request = new methodDescriptor.requestType();

            // Handle different methods
            switch(methodName) {
                case "initializeSession":
                    const sid = sessionId || `cpr_${Date.now()}`;
                    setSessionId(sid);
                    console.log("📋 Session ID:", sid);
                    break;

                case "processFrame":
                    if (!selectedFile) {
                        setError("Please select an image file first");
                        setLoading(false);
                        return;
                    }
                    const frameBytes = await fileToBytes(selectedFile);
                    console.log("🖼️ Frame bytes:", frameBytes.length);
                    if (request.setSessionId && sessionId) {
                        request.setSessionId(sessionId);
                    }
                    break;

                case "getMetrics":
                case "getCoachingFeedback":
                case "startDetection":
                case "stopDetection":
                    if (request.setSessionId && sessionId) {
                        request.setSessionId(sessionId);
                    }
                    break;
            }

            const props = {
                request,
                preventCloseServiceOnEnd: false,
                onEnd: (response) => {
                    setLoading(false);
                    console.log("📨 Response:", response);

                    const { message, status, statusMessage } = response;

                    if (status !== 0) {
                        console.error("❌ Error:", statusMessage);
                        setError(statusMessage);
                        setOutput({ error: statusMessage });
                        return;
                    }

                    const outputData = message?.toObject 
                        ? message.toObject() 
                        : message;

                    console.log("✅ Success:", outputData);
                    setOutput(outputData);
                },
            };

            serviceClient.unary(methodDescriptor, props);

        } catch (err) {
            console.error("💥 Error:", err);
            setError(err.message);
            setOutput({ error: err.message });
            setLoading(false);
        }
    };

    return (
        <div className="service-container">
            {/* Session Info Card */}
            <div className="content-box session-card">
                <div className="card-header">
                    <h3>🔐 Session Information</h3>
                </div>
                <div className="session-info">
                    {sessionId ? (
                        <div className="session-active">
                            <span className="session-badge">Active Session</span>
                            <p className="session-id">{sessionId}</p>
                        </div>
                    ) : (
                        <p className="session-placeholder">No active session • Click "Initialize Session" to start</p>
                    )}
                </div>
            </div>

            {/* File Upload Card */}
            <div className="content-box upload-card">
                <div className="card-header">
                    <h3>📤 Upload Image/Frame</h3>
                </div>
                
                <div className="upload-area">
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="file-input"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="upload-text">
                            {selectedFile ? 'Change File' : 'Choose File'}
                        </span>
                    </label>

                    {selectedFile && (
                        <div className="file-info-card">
                            <div className="file-details">
                                <svg className="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="file-meta">
                                    <p className="file-name">{selectedFile.name}</p>
                                    <p className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>

                            {filePreview && (
                                <div className="file-preview">
                                    <img src={filePreview} alt="Preview" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Control Panel */}
            <div className="content-box control-panel">
                <div className="card-header">
                    <h3>🎮 Control Panel</h3>
                </div>

                <div className="button-grid">
                    <div className="button-wrapper">
                        <StyledButton
                            btnText="Initialize Session"
                            variant="contained"
                            onClick={() => runUnaryMethod("initializeSession")}
                            disabled={loading}
                        />
                        <span className="button-hint">Step 1: Create session</span>
                    </div>

                    <div className="button-wrapper">
                        <StyledButton
                            btnText="Process Frame"
                            variant="contained"
                            onClick={() => runUnaryMethod("processFrame")}
                            disabled={loading || !selectedFile}
                        />
                        <span className="button-hint">Step 2: Analyze image</span>
                    </div>

                    <div className="button-wrapper">
                        <StyledButton
                            btnText="Start Detection"
                            variant="contained"
                            onClick={() => runUnaryMethod("startDetection")}
                            disabled={loading}
                        />
                        <span className="button-hint">Begin monitoring</span>
                    </div>

                    <div className="button-wrapper">
                        <StyledButton
                            btnText="Stop Detection"
                            variant="contained"
                            onClick={() => runUnaryMethod("stopDetection")}
                            disabled={loading}
                        />
                        <span className="button-hint">End monitoring</span>
                    </div>

                    <div className="button-wrapper">
                        <StyledButton
                            btnText="Get Metrics"
                            variant="contained"
                            onClick={() => runUnaryMethod("getMetrics")}
                            disabled={loading}
                        />
                        <span className="button-hint">View statistics</span>
                    </div>

                    <div className="button-wrapper">
                        <StyledButton
                            btnText="Get Coaching"
                            variant="contained"
                            onClick={() => runUnaryMethod("getCoachingFeedback")}
                            disabled={loading}
                        />
                        <span className="button-hint">View feedback</span>
                    </div>
                </div>
            </div>

            {/* Output Display */}
            <div className="content-box output-card">
                <div className="card-header">
                    <h3>📊 Service Output</h3>
                    {loading && <div className="loading-spinner"></div>}
                </div>

                {loading && (
                    <div className="loading-state">
                        <div className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <p>Processing request...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="error-state">
                        <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="error-message">{error}</p>
                    </div>
                )}

                {!loading && !error && !output && (
                    <div className="empty-state">
                        <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h4>No output yet</h4>
                        <p>Start by initializing a session and processing a frame</p>
                    </div>
                )}

                {!loading && output && (
                    <div className="output-display">
                        <div className="output-header">
                            <span className="output-label">JSON Response</span>
                            <button 
                                className="copy-button"
                                onClick={() => navigator.clipboard.writeText(JSON.stringify(output, null, 2))}
                            >
                                Copy
                            </button>
                        </div>
                        <pre className="output-json">
                            {JSON.stringify(output, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceUI;