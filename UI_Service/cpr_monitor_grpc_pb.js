// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var cpr_monitor_pb = require('./cpr_monitor_pb.js');

function serialize_cpr_monitor_v1_CPRMetrics(arg) {
  if (!(arg instanceof cpr_monitor_pb.CPRMetrics)) {
    throw new Error('Expected argument of type cpr_monitor.v1.CPRMetrics');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_CPRMetrics(buffer_arg) {
  return cpr_monitor_pb.CPRMetrics.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_CoachingFeedback(arg) {
  if (!(arg instanceof cpr_monitor_pb.CoachingFeedback)) {
    throw new Error('Expected argument of type cpr_monitor.v1.CoachingFeedback');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_CoachingFeedback(buffer_arg) {
  return cpr_monitor_pb.CoachingFeedback.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_DetectPosesRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.DetectPosesRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.DetectPosesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_DetectPosesRequest(buffer_arg) {
  return cpr_monitor_pb.DetectPosesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_DetectPosesResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.DetectPosesResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.DetectPosesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_DetectPosesResponse(buffer_arg) {
  return cpr_monitor_pb.DetectPosesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_GetCoachingFeedbackRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.GetCoachingFeedbackRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.GetCoachingFeedbackRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_GetCoachingFeedbackRequest(buffer_arg) {
  return cpr_monitor_pb.GetCoachingFeedbackRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_GetMetricsRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.GetMetricsRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.GetMetricsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_GetMetricsRequest(buffer_arg) {
  return cpr_monitor_pb.GetMetricsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_InitializeRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.InitializeRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.InitializeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_InitializeRequest(buffer_arg) {
  return cpr_monitor_pb.InitializeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_InitializeResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.InitializeResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.InitializeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_InitializeResponse(buffer_arg) {
  return cpr_monitor_pb.InitializeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_LoadModelRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.LoadModelRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.LoadModelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_LoadModelRequest(buffer_arg) {
  return cpr_monitor_pb.LoadModelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_LoadModelResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.LoadModelResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.LoadModelResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_LoadModelResponse(buffer_arg) {
  return cpr_monitor_pb.LoadModelResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_ProcessFrameRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.ProcessFrameRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.ProcessFrameRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_ProcessFrameRequest(buffer_arg) {
  return cpr_monitor_pb.ProcessFrameRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_ProcessFrameResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.ProcessFrameResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.ProcessFrameResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_ProcessFrameResponse(buffer_arg) {
  return cpr_monitor_pb.ProcessFrameResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StartCameraRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.StartCameraRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StartCameraRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StartCameraRequest(buffer_arg) {
  return cpr_monitor_pb.StartCameraRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StartCameraResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.StartCameraResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StartCameraResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StartCameraResponse(buffer_arg) {
  return cpr_monitor_pb.StartCameraResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StartDetectionRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.StartDetectionRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StartDetectionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StartDetectionRequest(buffer_arg) {
  return cpr_monitor_pb.StartDetectionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StartDetectionResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.StartDetectionResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StartDetectionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StartDetectionResponse(buffer_arg) {
  return cpr_monitor_pb.StartDetectionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StartMetronomeRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.StartMetronomeRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StartMetronomeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StartMetronomeRequest(buffer_arg) {
  return cpr_monitor_pb.StartMetronomeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StartMetronomeResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.StartMetronomeResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StartMetronomeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StartMetronomeResponse(buffer_arg) {
  return cpr_monitor_pb.StartMetronomeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StopCameraRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.StopCameraRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StopCameraRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StopCameraRequest(buffer_arg) {
  return cpr_monitor_pb.StopCameraRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StopCameraResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.StopCameraResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StopCameraResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StopCameraResponse(buffer_arg) {
  return cpr_monitor_pb.StopCameraResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StopDetectionRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.StopDetectionRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StopDetectionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StopDetectionRequest(buffer_arg) {
  return cpr_monitor_pb.StopDetectionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StopDetectionResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.StopDetectionResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StopDetectionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StopDetectionResponse(buffer_arg) {
  return cpr_monitor_pb.StopDetectionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StopMetronomeRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.StopMetronomeRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StopMetronomeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StopMetronomeRequest(buffer_arg) {
  return cpr_monitor_pb.StopMetronomeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StopMetronomeResponse(arg) {
  if (!(arg instanceof cpr_monitor_pb.StopMetronomeResponse)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StopMetronomeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StopMetronomeResponse(buffer_arg) {
  return cpr_monitor_pb.StopMetronomeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cpr_monitor_v1_StreamMetricsRequest(arg) {
  if (!(arg instanceof cpr_monitor_pb.StreamMetricsRequest)) {
    throw new Error('Expected argument of type cpr_monitor.v1.StreamMetricsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cpr_monitor_v1_StreamMetricsRequest(buffer_arg) {
  return cpr_monitor_pb.StreamMetricsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// ==================== gRPC Service ====================
//
var CPRMonitorServiceService = exports.CPRMonitorServiceService = {
  initializeSession: {
    path: '/cpr_monitor.v1.CPRMonitorService/InitializeSession',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.InitializeRequest,
    responseType: cpr_monitor_pb.InitializeResponse,
    requestSerialize: serialize_cpr_monitor_v1_InitializeRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_InitializeRequest,
    responseSerialize: serialize_cpr_monitor_v1_InitializeResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_InitializeResponse,
  },
  startDetection: {
    path: '/cpr_monitor.v1.CPRMonitorService/StartDetection',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.StartDetectionRequest,
    responseType: cpr_monitor_pb.StartDetectionResponse,
    requestSerialize: serialize_cpr_monitor_v1_StartDetectionRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_StartDetectionRequest,
    responseSerialize: serialize_cpr_monitor_v1_StartDetectionResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_StartDetectionResponse,
  },
  stopDetection: {
    path: '/cpr_monitor.v1.CPRMonitorService/StopDetection',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.StopDetectionRequest,
    responseType: cpr_monitor_pb.StopDetectionResponse,
    requestSerialize: serialize_cpr_monitor_v1_StopDetectionRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_StopDetectionRequest,
    responseSerialize: serialize_cpr_monitor_v1_StopDetectionResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_StopDetectionResponse,
  },
  processFrame: {
    path: '/cpr_monitor.v1.CPRMonitorService/ProcessFrame',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.ProcessFrameRequest,
    responseType: cpr_monitor_pb.ProcessFrameResponse,
    requestSerialize: serialize_cpr_monitor_v1_ProcessFrameRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_ProcessFrameRequest,
    responseSerialize: serialize_cpr_monitor_v1_ProcessFrameResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_ProcessFrameResponse,
  },
  getMetrics: {
    path: '/cpr_monitor.v1.CPRMonitorService/GetMetrics',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.GetMetricsRequest,
    responseType: cpr_monitor_pb.CPRMetrics,
    requestSerialize: serialize_cpr_monitor_v1_GetMetricsRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_GetMetricsRequest,
    responseSerialize: serialize_cpr_monitor_v1_CPRMetrics,
    responseDeserialize: deserialize_cpr_monitor_v1_CPRMetrics,
  },
  streamMetrics: {
    path: '/cpr_monitor.v1.CPRMonitorService/StreamMetrics',
    requestStream: false,
    responseStream: true,
    requestType: cpr_monitor_pb.StreamMetricsRequest,
    responseType: cpr_monitor_pb.CPRMetrics,
    requestSerialize: serialize_cpr_monitor_v1_StreamMetricsRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_StreamMetricsRequest,
    responseSerialize: serialize_cpr_monitor_v1_CPRMetrics,
    responseDeserialize: deserialize_cpr_monitor_v1_CPRMetrics,
  },
  getCoachingFeedback: {
    path: '/cpr_monitor.v1.CPRMonitorService/GetCoachingFeedback',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.GetCoachingFeedbackRequest,
    responseType: cpr_monitor_pb.CoachingFeedback,
    requestSerialize: serialize_cpr_monitor_v1_GetCoachingFeedbackRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_GetCoachingFeedbackRequest,
    responseSerialize: serialize_cpr_monitor_v1_CoachingFeedback,
    responseDeserialize: deserialize_cpr_monitor_v1_CoachingFeedback,
  },
  loadModel: {
    path: '/cpr_monitor.v1.CPRMonitorService/LoadModel',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.LoadModelRequest,
    responseType: cpr_monitor_pb.LoadModelResponse,
    requestSerialize: serialize_cpr_monitor_v1_LoadModelRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_LoadModelRequest,
    responseSerialize: serialize_cpr_monitor_v1_LoadModelResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_LoadModelResponse,
  },
  detectPoses: {
    path: '/cpr_monitor.v1.CPRMonitorService/DetectPoses',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.DetectPosesRequest,
    responseType: cpr_monitor_pb.DetectPosesResponse,
    requestSerialize: serialize_cpr_monitor_v1_DetectPosesRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_DetectPosesRequest,
    responseSerialize: serialize_cpr_monitor_v1_DetectPosesResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_DetectPosesResponse,
  },
  startMetronome: {
    path: '/cpr_monitor.v1.CPRMonitorService/StartMetronome',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.StartMetronomeRequest,
    responseType: cpr_monitor_pb.StartMetronomeResponse,
    requestSerialize: serialize_cpr_monitor_v1_StartMetronomeRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_StartMetronomeRequest,
    responseSerialize: serialize_cpr_monitor_v1_StartMetronomeResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_StartMetronomeResponse,
  },
  stopMetronome: {
    path: '/cpr_monitor.v1.CPRMonitorService/StopMetronome',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.StopMetronomeRequest,
    responseType: cpr_monitor_pb.StopMetronomeResponse,
    requestSerialize: serialize_cpr_monitor_v1_StopMetronomeRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_StopMetronomeRequest,
    responseSerialize: serialize_cpr_monitor_v1_StopMetronomeResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_StopMetronomeResponse,
  },
  startCamera: {
    path: '/cpr_monitor.v1.CPRMonitorService/StartCamera',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.StartCameraRequest,
    responseType: cpr_monitor_pb.StartCameraResponse,
    requestSerialize: serialize_cpr_monitor_v1_StartCameraRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_StartCameraRequest,
    responseSerialize: serialize_cpr_monitor_v1_StartCameraResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_StartCameraResponse,
  },
  stopCamera: {
    path: '/cpr_monitor.v1.CPRMonitorService/StopCamera',
    requestStream: false,
    responseStream: false,
    requestType: cpr_monitor_pb.StopCameraRequest,
    responseType: cpr_monitor_pb.StopCameraResponse,
    requestSerialize: serialize_cpr_monitor_v1_StopCameraRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_StopCameraRequest,
    responseSerialize: serialize_cpr_monitor_v1_StopCameraResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_StopCameraResponse,
  },
  streamFrames: {
    path: '/cpr_monitor.v1.CPRMonitorService/StreamFrames',
    requestStream: true,
    responseStream: true,
    requestType: cpr_monitor_pb.ProcessFrameRequest,
    responseType: cpr_monitor_pb.ProcessFrameResponse,
    requestSerialize: serialize_cpr_monitor_v1_ProcessFrameRequest,
    requestDeserialize: deserialize_cpr_monitor_v1_ProcessFrameRequest,
    responseSerialize: serialize_cpr_monitor_v1_ProcessFrameResponse,
    responseDeserialize: deserialize_cpr_monitor_v1_ProcessFrameResponse,
  },
};

exports.CPRMonitorServiceClient = grpc.makeGenericClientConstructor(CPRMonitorServiceService, 'CPRMonitorService');
