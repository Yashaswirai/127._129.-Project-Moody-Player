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
    <div className="h-full p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Moody Player
        </h1>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg">
          Let AI detect your mood and play the perfect music
        </p>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="glass rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 mb-3 sm:mb-4 md:mb-6 animate-slideIn flex-shrink-0">
          <div className="relative group">
            <video
              ref={videoRef}
              className="w-full h-32 xs:h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 object-cover rounded-lg sm:rounded-xl border-2 border-white/20 shadow-2xl transition-all duration-300 group-hover:border-purple-400/50"
              autoPlay
              muted
            />
            {!isWebcamStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg sm:rounded-xl">
                <div className="text-center p-2">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white text-xs sm:text-sm">Click "Start Webcam" to begin</p>
                </div>
              </div>
            )}
          </div>

          {/* Expression Display */}
          <div className="mt-3 sm:mt-4 text-center">
            <div className="inline-flex items-center space-x-1 sm:space-x-2 glass-dark rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 text-xs sm:text-sm">Current Expression:</span>
              <span className="font-bold text-white text-sm sm:text-base md:text-lg mood-indicator">
                {expression ? expression.charAt(0).toUpperCase() + expression.slice(1) : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Captured Expression Alert */}
        {capture && (
          <div className="mb-3 sm:mb-4 md:mb-6 animate-fadeIn flex-shrink-0">
            <div className="glass bg-green-500/20 border-green-400/30 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
              <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-300 font-medium text-xs sm:text-sm md:text-base">
                  Expression Captured: {capture.charAt(0).toUpperCase() + capture.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-shrink-0">
          <button
            className={`btn-hover px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 flex-1 xs:flex-none ${
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
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              {isWebcamStarted ? (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                  </svg>
                  <span className="hidden xs:inline">Stop Webcam</span>
                  <span className="xs:hidden">Stop</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden xs:inline">Start Webcam</span>
                  <span className="xs:hidden">Start</span>
                </>
              )}
            </div>
          </button>

          <button
            className="btn-hover px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex-1 xs:flex-none"
            onClick={() => setCapture(expression)}
            disabled={!expression || !isWebcamStarted}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden xs:inline">Capture Expression</span>
              <span className="xs:hidden">Capture</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacialExpression;
