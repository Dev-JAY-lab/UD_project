import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
     apiKey: "AIzaSyBeJ-BA-kM1r7y3mZDuZzauepHzWjbMtYo",
    authDomain: "urbandiary-82b27.firebaseapp.com",
    projectId: "urbandiary-82b27",
    storageBucket: "urbandiary-82b27.firebasestorage.app",
    messagingSenderId: "550345012191",
    appId: "1:550345012191:web:5d078a05ef22c85d940a6a",
    measurementId: "G-X6QFQZSJ40"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);