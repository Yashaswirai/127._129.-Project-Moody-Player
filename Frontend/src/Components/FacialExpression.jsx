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
    <div className="w-2/5 h-fit p-5 border">
      <h2 className="w-2/5 text-center text-2xl font-bold text-white">
        Moody Player
      </h2>
      <div className="w-full rounded-lg mt-2 p-4">
        <video ref={videoRef} className="w-full h-full rounded-4xl" autoPlay muted />
        <div className="text-center text-lg mt-2 text-white">
          Expression:{" "}
          <span className="font-bold">
            {expression ? expression : "Unknown"}
          </span>
        </div>
      </div>
        {capture && (
          <div className="w-fit mx-auto p-2 bg-green-500 text-white rounded text-center">
            Expression Captured: {capture}
          </div>
        )}
      <div className="btns flex gap-4 items-center mt-4">
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded active:scale-95"
          onClick={() => {
            if (isWebcamStarted) {
              stopWebcam();
            } else {
              startWebcam();
            }
          }}
        >
          {isWebcamStarted ? "Stop Webcam" : "Start Webcam"}
        </button>
        <button
          className="mt-4 p-2 bg-green-500 text-white rounded active:scale-95"
          onClick={() => setCapture(expression)}
        >
          Capture Expression
        </button>
      </div>
    </div>
  );
};

export default FacialExpression;
