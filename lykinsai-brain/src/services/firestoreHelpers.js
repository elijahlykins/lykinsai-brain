import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

const COLLECTION = "transcriptions";

export const saveTranscription = async (userId, title, text) => {
  await addDoc(collection(db, COLLECTION), {
    userId,
    title,
    text,
    createdAt: new Date(),
  });
};

export const getUserTranscriptions = async (userId) => {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateTranscriptionTitle = async (id, newTitle) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { title: newTitle });
};

export const deleteTranscription = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};
