import React from "react";
import orb from "../assets/orb.jpg";

function Orb({ isRecording }) {
  return (
    <div className="relative flex items-center justify-center w-80 h-80 rounded-full">
      {/* Glowing aura behind orb */}
      <div
        className={`absolute inset-0 rounded-full blur-[120px] transition-all duration-700 ${
          isRecording ? "opacity-70" : "opacity-40"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Orb image */}
      <img
        src={orb}
        alt="Recording Orb"
        className={`absolute inset-0 w-full h-full object-cover rounded-full ${
          isRecording ? "animate-pulse-slow" : "animate-orbFlow"
        }`}
      />
    </div>
  );
}

export default Orb;
