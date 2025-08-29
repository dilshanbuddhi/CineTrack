import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD06lG6LCkv2nzC2NHxRaDOpTv6bLIg-aM",
  authDomain: "task-manager-155b5.firebaseapp.com",
  projectId: "task-manager-155b5",
  storageBucket: "task-manager-155b5.firebasestorage.app",
  messagingSenderId: "309278626612",
  appId: "1:309278626612:web:bb5813be75f05cdc8e0b61"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
