import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import orb from "../assets/orb.jpg";
import logo from "../assets/logo.png";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Home({ user, onLogout }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const navigate = useNavigate();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      audioChunksRef.current = [];
      await sendAudioToBackend(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Toggle Recording
  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  // Send Audio to Backend
  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    try {
      const response = await fetch("http://localhost:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setTranscription(data.transcription);
      }
    } catch (err) {
      console.error(err);
      setTranscription("Transcription failed.");
    }
  };

  // Save Current Transcript
  const saveCurrentTranscript = async () => {
    if (!user) {
      alert("You must be logged in to save transcriptions!");
      navigate("/login");
      return;
    }

    if (!transcription || transcription.trim() === "") {
      alert("Nothing to save!");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "transcriptions"), {
        title: "Untitled",
        text: transcription,
        notes: "",
        summary: "",
        createdAt: serverTimestamp(),
      });
      alert("Transcription saved!");
      setTranscription("");
    } catch (err) {
      console.error(err);
      alert("Failed to save transcription.");
    }
  };

  return (
    <div className="bg-[#171515] min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-12 py-2 z-50 relative">
        <img src={logo} alt="LykinsAI Logo" className="h-[80px] md:h-[110px] w-auto object-contain cursor-pointer" />
        <div className="flex items-center space-x-6 md:space-x-10 text-lg">
          <button onClick={() => navigate("/saved")} className="hover:underline">
            Saved
          </button>
          {user ? (
            <button onClick={onLogout} className="hover:underline">
              Logout
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="hover:underline">
              Login
            </button>
          )}
        </div>
      </header>

      {/* Orb Section */}
      <main className="flex-grow flex flex-col items-center justify-center relative">
        <div
          onClick={toggleRecording}
          className="relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
          style={{
            transform: isRecording ? "translateY(-45vh) scale(0.5)" : "translateY(0) scale(1)",
          }}
        >
          {/* Glow */}
          <div
            className={`absolute rounded-full w-[450px] h-[450px] blur-[120px] transition-all ${
              isRecording ? "opacity-70" : "opacity-40"
            }`}
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          {/* Orb */}
          <img
            src={orb}
            alt="Orb"
            className={`w-[450px] h-[450px] rounded-full object-cover relative z-10 select-none ${
              isRecording ? "animate-pulse-slow" : ""
            }`}
          />

          {/* Idle Text */}
          {!isRecording && (
            <h2 className="absolute text-4xl font-light text-center select-none z-20">
              Let’s Get Started
            </h2>
          )}

          {/* Listening Text */}
          {isRecording && (
            <p className="mt-6 text-2xl font-light text-gray-200 z-20">
              Listening...
            </p>
          )}
        </div>

        {/* Transcription */}
        {transcription && !isRecording && (
          <div className="mt-10 text-center text-2xl font-light max-w-3xl tracking-wide leading-relaxed">
            <p>{transcription}</p>
          </div>
        )}

        {/* Minimal Save Current Transcript Button */}
        <button
          onClick={saveCurrentTranscript}
          className="fixed bottom-6 right-6 text-gray-400 text-sm hover:underline"
        >
          Save Current Transcript
        </button>
      </main>
    </div>
  );
}
