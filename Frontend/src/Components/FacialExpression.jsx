import  { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "../utils/API";

const FacialExpression = ({ setSong }) => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState(null);
  const [capture, setCapture] = useState("");
  const [isWebcamStarted, setIsWebcamStarted] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const getSongsByMood = async (mood) => {
    try {
      const response = await axios.get(`/song?mood=${mood}`);
      setSong(response.data.data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };
  useEffect(() => {
    if (capture) {
      getSongsByMood(capture);
    }
  }, [capture]);
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsWebcamStarted(true);
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsWebcamStarted(false);
    }
  };

  const detectExpressions = async () => {
    if (videoRef.current) {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      // Get dominant expression
      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        const dominantExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );
        setExpression(dominantExpression);
      }
    }
  };
  detectExpressions();
  useEffect(() => {
    setInterval(detectExpressions, 1000);
  }, [detectExpressions]);
  return (
    <div className="h-full p-4 lg:p-8 flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="mb-4 lg:mb-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Moody Player
        </h1>
        <p className="text-gray-300 text-xs lg:text-sm">
          Let AI detect your mood and play the perfect music
        </p>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex flex-col">
        <div className="glass rounded-2xl p-3 lg:p-6 mb-4 lg:mb-6 animate-slideIn">
          <div className="relative group">
            <video
              ref={videoRef}
              className="w-full h-48 lg:h-64 object-cover rounded-xl border-2 border-white/20 shadow-2xl transition-all duration-300 group-hover:border-purple-400/50"
              autoPlay
              muted
            />
            {!isWebcamStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white text-sm">Click "Start Webcam" to begin</p>
                </div>
              </div>
            )}
          </div>

          {/* Expression Display */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 glass-dark rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-sm">Current Expression:</span>
              <span className="font-bold text-white text-lg mood-indicator">
                {expression ? expression.charAt(0).toUpperCase() + expression.slice(1) : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Captured Expression Alert */}
        {capture && (
          <div className="mb-6 animate-fadeIn">
            <div className="glass bg-green-500/20 border-green-400/30 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-300 font-medium">
                  Expression Captured: {capture.charAt(0).toUpperCase() + capture.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
          <button
            className={`btn-hover px-4 lg:px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isWebcamStarted
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
            }`}
            onClick={() => {
              if (isWebcamStarted) {
                stopWebcam();
              } else {
                startWebcam();
              }
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              {isWebcamStarted ? (
                <>
                  <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                  </svg>
                  <span className="text-sm lg:text-base">Stop Webcam</span>
                </>
              ) : (
                <>
                  <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm lg:text-base">Start Webcam</span>
                </>
              )}
            </div>
          </button>

          <button
            className="btn-hover px-4 lg:px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCapture(expression)}
            disabled={!expression || !isWebcamStarted}
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 lg:w-5 h-4 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm lg:text-base">Capture Expression</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacialExpression;
