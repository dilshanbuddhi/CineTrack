import {addDoc, collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "@/firebase";
import {Movie} from "@/types/movie";

export const taskRef = collection(db , "movies")

import { auth } from "@/firebase";

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
        const querySnapshot = await getDocs(taskRef)
        const movies: Movie[] = []
        querySnapshot.forEach((doc) => {
           // movies.push({id: doc.id, ...doc.data()})
        })
        return movies
    } catch (error) {
        console.log(error)
    }
}

export const getMovieById = async (id: string) => {
    try {
        const docRef = doc(db, "movies", id)
        const docSnap = await getDoc(docRef)
        return docSnap.exists()
          ? ({
              id: docSnap.id,
              ...docSnap.data()
            } as Movie)
          : null
    } catch (error) {
        console.log(error)
    }
}