import React, { useState, useEffect } from "react";
import StyledButton from "@integratedComponents/StyledButton";
import "./style.css";

const ServiceUI = ({ serviceClient }) => {
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (serviceClient && serviceClient.client) {
            console.log("Available service methods:", serviceClient.client);
        }
    }, [serviceClient]);

    const runUnaryMethod = async (methodName, requestData = {}) => {
        setLoading(true);
        setError(null);

        try {
            const methodDescriptor = serviceClient?.client?.[methodName];

            if (!methodDescriptor) {
                const errorMsg = `Method "${methodName}" not found`;
                console.error(errorMsg);
                setError(errorMsg);
                setOutput({ error: errorMsg });
                setLoading(false);
                return;
            }

            const request = new methodDescriptor.requestType();

            // Apply any request data
            Object.keys(requestData).forEach(key => {
                const setter = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
                if (typeof request[setter] === 'function') {
                    request[setter](requestData[key]);
                }
            });

            const props = {
                request,
                preventCloseServiceOnEnd: false,
                onEnd: (response) => {
                    setLoading(false);

                    const { message, status, statusMessage } = response;

                    if (status !== 0) {
                        console.error("Service error:", statusMessage);
                        setError(statusMessage);
                        setOutput({ error: statusMessage });
                        return;
                    }

                    const outputData = message?.toObject 
                        ? message.toObject() 
                        : message;

                    console.log("Service response:", outputData);
                    setOutput(outputData);
                },
            };

            serviceClient.unary(methodDescriptor, props);
        } catch (err) {
            console.error("Error calling method:", err);
            setError(err.message);
            setOutput({ error: err.message });
            setLoading(false);
        }
    };

    return (
        <div className="service-container">
            {/* Control Panel */}
            <div className="content-box">
                <h3>CPR Monitor Control Panel</h3>

                <div className="button-grid">
                    <StyledButton
                        btnText="Initialize Session"
                        variant="contained"
                        onClick={() => runUnaryMethod("initializeSession")}
                        disabled={loading}
                    />

                    <StyledButton
                        btnText="Start Camera"
                        variant="contained"
                        onClick={() => runUnaryMethod("startCamera")}
                        disabled={loading}
                    />

                    <StyledButton
                        btnText="Stop Camera"
                        variant="contained"
                        onClick={() => runUnaryMethod("stopCamera")}
                        disabled={loading}
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
                </div>
            </div>

            {/* Output Display */}
            <div className="content-box">
                <h4>Service Output</h4>

                {loading && (
                    <div className="loading-indicator">
                        <p>⏳ Loading...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <p>❌ Error: {error}</p>
                    </div>
                )}

                {!loading && !output && (
                    <p className="no-output">No output yet. Click a button to interact with the service.</p>
                )}

                {!loading && output && (
                    <div className="output-container">
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