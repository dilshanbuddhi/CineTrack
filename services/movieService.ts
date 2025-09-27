import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {db} from "@/firebase";
import {Movie} from "@/types/movie";
import { auth } from "@/firebase";


export const taskRef = collection(db , "movies")


export const createMovie = async (movie: Movie) => {
    try {
        const uid = auth.currentUser?.uid;
        const docRef = await addDoc(taskRef, { ...movie, userId: uid })
        return docRef
    } catch (error) {
        console.log(error)
    }
}

export const getAllMovies = async () => {
    try {
        const querySnapshot = await getDocs(taskRef);
        console.log(querySnapshot.docs , "querySnapshot.docs")
        return querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id : doc.id
        })) as Movie[];

    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};

export const getMovieById = async (id: string) => {
    try {
        const docRef = doc(db, "movies", id)
        const docSnap = await getDoc(docRef)
        return docSnap.exists()
          ? ({
              id: docSnap.id,
              ...docSnap.data()
            } as Movie)
          : null;
    } catch (error) {
        console.log(error)
    }
}


export const deleteMovie = async (id: string) => {
    try {
        const docRef = doc(db, "movies", id)
        return deleteDoc(docRef)
    } catch (error) {
        console.log(error)
    }
}

export const getAllMoviesByUserId = async () => {
    try {
        const q = query(taskRef, where("userId", "==", auth.currentUser?.uid));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Movie[];
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const updateStatus = async (id: string, status: string) => {
    try {
        const docRef = doc(db, "movies", id)
        return updateDoc(docRef, {status})
    } catch (error) {
        console.log(error)
    }
}

export const updateMovie = async (movie: Movie , id : string) => {
    try {
        const docRef = doc(db, "movies", id)
        return updateDoc(docRef, { ...movie, updatedAt: new Date().toISOString() })
    } catch (error) {
        console.log(error)
    }
}