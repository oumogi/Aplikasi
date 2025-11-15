// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, deleteDoc, updateDoc, query, orderBy, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, getBytes } from "firebase/storage";
import { 
  getAuth, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjGzOh9kUpuXNhNpGBRj4JTH_FhJCywn8",
  authDomain: "gemini-drive-66d3f.firebaseapp.com",
  projectId: "gemini-drive-66d3f",
  storageBucket: "gemini-drive-66d3f.firebasestorage.app",
  messagingSenderId: "330396036044",
  appId: "1:330396036044:web:eee49bbc68178f3a01cb69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    type User,
    // Firestore
    doc,
    setDoc,
    onSnapshot,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    collection,
    // Storage
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    getBytes,
};