import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import jsPDF from "jspdf";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SavedPage({ user }) {
  const [transcriptions, setTranscriptions] = useState([]);
  const [activeTranscription, setActiveTranscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "transcriptions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const savedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTranscriptions(savedData);
    });

    return () => unsubscribe();
  }, [user]);

  const renameTranscription = async (id, newTitle) => {
    if (!newTitle) return;
    const docRef = doc(db, "users", user.uid, "transcriptions", id);
    await updateDoc(docRef, { title: newTitle });
  };

  const deleteTranscription = async (id) => {
    const docRef = doc(db, "users", user.uid, "transcriptions", id);
    await deleteDoc(docRef);
  };

  const downloadPDF = (title, text) => {
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save(`${title || "transcription"}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-start text-center flex-grow pt-20 px-4">
      {/* Back button moved higher */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-gray-400 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-light mb-6 mt-8">Saved Transcriptions</h1>
      <p className="text-gray-400 text-lg mb-10">
        Welcome, {user.displayName || "User"}!
      </p>

      <div className="w-full max-w-4xl flex flex-col gap-6 relative">
        {transcriptions.length === 0 && (
          <p className="text-gray-300">No saved transcriptions yet.</p>
        )}

        {transcriptions.map((t) => (
          <div
            key={t.id}
            className="group relative bg-[#222] rounded-2xl shadow-lg p-6 flex flex-col gap-3"
          >
            {/* Trash icon outside and centered */}
            <div
              className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => deleteTranscription(t.id)}
            >
              <FiTrash2 size={24} color="#f56565" />
            </div>

            {/* Editable title */}
            <input
              type="text"
              value={t.title || "Untitled"}
              className="bg-[#333] text-white rounded-md px-3 py-1 font-semibold w-full"
              onChange={(e) => renameTranscription(t.id, e.target.value)}
            />

            {/* Transcription text */}
            <p className="text-gray-300 whitespace-pre-wrap">{t.text}</p>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={() => downloadPDF(t.title, t.text)}
                className="text-blue-500 hover:underline"
              >
                Download PDF
              </button>

              <button
                onClick={() => setActiveTranscription(t)}
                className="text-gray-300 hover:underline"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing/editing transcription */}
      {activeTranscription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1c1c1c] p-6 rounded-2xl w-full max-w-3xl text-white relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
              onClick={() => setActiveTranscription(null)}
            >
              ×
            </button>

            {/* Title */}
            <input
              type="text"
              className="w-full mb-4 px-3 py-2 bg-[#222] rounded-md text-white font-semibold text-lg"
              value={activeTranscription.title || "Untitled"}
              onChange={(e) =>
                setActiveTranscription({
                  ...activeTranscription,
                  title: e.target.value,
                })
              }
            />

            {/* Summary */}
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <textarea
              className="w-full h-32 p-3 mb-4 bg-[#222] rounded-md text-white resize-none"
              value={activeTranscription.summary || ""}
              onChange={(e) =>
                setActiveTranscription({
                  ...activeTranscription,
                  summary: e.target.value,
                })
              }
            />

            {/* Transcript */}
            <h3 className="text-xl font-semibold mb-2">Transcript</h3>
            <textarea
              className="w-full h-56 p-3 bg-[#222] rounded-md text-white resize-none"
              value={activeTranscription.text}
              onChange={(e) =>
                setActiveTranscription({
                  ...activeTranscription,
                  text: e.target.value,
                })
              }
            />

            {/* Save button */}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
              onClick={async () => {
                const docRef = doc(
                  db,
                  "users",
                  user.uid,
                  "transcriptions",
                  activeTranscription.id
                );
                await updateDoc(docRef, {
                  title: activeTranscription.title,
                  summary: activeTranscription.summary || "",
                  text: activeTranscription.text,
                });
                setActiveTranscription(null);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
