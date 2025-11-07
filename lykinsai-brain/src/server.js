import express from "express";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Whisper transcription endpoint
app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  try {
    const audioFile = fs.createReadStream(req.file.path);
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    fs.unlinkSync(req.file.path);
    res.json({ transcription: transcription.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// Endpoint to save transcription (optionally connect to Firestore)
app.post("/api/saveTranscription", async (req, res) => {
  const { text, uid } = req.body;
  // Here you can integrate Firebase Firestore:
  // await addDoc(collection(db, "users", uid, "transcriptions"), {...})
  console.log(`Save for user ${uid}:`, text);
  res.json({ success: true });
});

app.listen(3001, () => console.log("Server running on port 3001"));
