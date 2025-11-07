import React, { useState } from "react";
import { auth, googleProvider } from "../services/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="bg-[#1c1c1c] p-10 rounded-2xl shadow-lg w-[400px] text-center border border-gray-700">
        <h2 className="text-2xl font-semibold mb-6">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-white"
        />

        <button
          onClick={handleEmailAuth}
          className="w-full py-2 bg-white text-black rounded-lg font-semibold mb-3 hover:bg-gray-200 transition"
        >
          {isRegistering ? "Register" : "Login"}
        </button>

        <button
          onClick={handleGoogleAuth}
          className="w-full py-2 bg-[#4285F4] text-white rounded-lg font-semibold hover:bg-[#357ae8] transition"
        >
          Continue with Google
        </button>

        <p
          className="mt-4 text-sm text-gray-400 cursor-pointer hover:underline"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don’t have an account? Register"}
        </p>

        <p
          onClick={() => navigate("/")}
          className="mt-6 text-gray-400 cursor-pointer hover:underline"
        >
          ← Back to Home
        </p>
      </div>
    </div>
  );
}
