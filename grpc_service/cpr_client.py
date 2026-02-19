import grpc
import time
import threading

import cpr_monitor_pb2
import cpr_monitor_pb2_grpc

# ==============================
# Config
# ==============================
SESSION_ID = "session_001"
SERVER_ADDRESS = "localhost:50051"


# ==============================
# Stream Metrics Function
# ==============================
def stream_metrics(stub):
    print("Starting metrics stream...")

    request = cpr_monitor_pb2.StreamMetricsRequest(
        session_id=SESSION_ID,
        update_interval_ms=1000,
    )

    try:
        for metrics in stub.StreamMetrics(request):
            print(
                f"[METRICS] CPM={metrics.compressions_per_minute} | "
                f"Total={metrics.total_compressions} | "
                f"Duration={metrics.session_duration_ms}ms"
            )
    except grpc.RpcError as e:
        print(f"Metrics stream ended: {e}")


# ==============================
# Main Client Runner
# ==============================
def run():
    print("Connecting to CPR Monitor server...")

    channel = grpc.insecure_channel(SERVER_ADDRESS)
    stub = cpr_monitor_pb2_grpc.CPRMonitorServiceStub(channel)

    try:
        # ---------- Initialize session ----------
        print("Initializing session...")

        session_config = cpr_monitor_pb2.SessionConfig(session_id=SESSION_ID)
        init_request = cpr_monitor_pb2.InitializeRequest(config=session_config)

        # Updated RPC call
        init_response = stub.InitializeSession(init_request)
        print(f"[INIT] {init_response.status.message}")

        # ---------- Start detection ----------
        print("Starting detection...")

        start_request = cpr_monitor_pb2.StartDetectionRequest(session_id=SESSION_ID)
        start_response = stub.StartDetection(start_request)
        print(f"[START] {start_response.status.message}")

        # ---------- Start metrics stream in background ----------
        metrics_thread = threading.Thread(
            target=stream_metrics,
            args=(stub,),
            daemon=True,
        )
        metrics_thread.start()

        # ---------- Simulate sending camera frames ----------
        print("Sending frames...\n")

        for i in range(20):
            frame = cpr_monitor_pb2.CameraFrame(
                width=640,
                height=480,
                frame_rate=30,
                timestamp_ms=int(time.time() * 1000),
                is_valid=True,
            )

            stub.ProcessFrame(
                cpr_monitor_pb2.ProcessFrameRequest(
                    session_id=SESSION_ID,
                    frame=frame,
                )
            )

            # Get coaching feedback
            feedback = stub.GetCoachingFeedback(
                cpr_monitor_pb2.GetCoachingFeedbackRequest(session_id=SESSION_ID)
            )
            print(f"[FEEDBACK] {feedback.message}")

            time.sleep(1)

        # ---------- Stop detection ----------
        print("\nStopping detection...")

        stop_request = cpr_monitor_pb2.StopDetectionRequest(session_id=SESSION_ID)
        stop_response = stub.StopDetection(stop_request)

        print("[STOP] Detection finished")
        print(
            f"Final CPM: {stop_response.final_metrics.compressions_per_minute}"
        )
        print(
            f"Total Compressions: {stop_response.final_metrics.total_compressions}"
        )

    except grpc.RpcError as e:
        print(f"RPC failed: {e}")


# ==============================
# Entry
# ==============================
if __name__ == "__main__":
    run()
