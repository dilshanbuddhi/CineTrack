import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC8UeThj2zlSi5l-M0WGen_BU4bmZbiTl8",
  authDomain: "task-manager-app-ca147.firebaseapp.com",
  projectId: "task-manager-app-ca147",
  storageBucket: "task-manager-app-ca147.firebasestorage.app",
  messagingSenderId: "3155864725",
  appId: "1:3155864725:web:cae6728b9b4376ed94bf9c"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
