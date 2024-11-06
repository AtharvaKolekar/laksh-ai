import { useEffect, useState } from "react"
import {
  signOut as firebaseSignOut,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged
} from "firebase/auth"

import { auth } from "@/lib/firebase"


const GoogleProvider = new GoogleAuthProvider();
const GithubProvider = new GithubAuthProvider();

export async function signIn(provider) {
    if (provider === "google") {
        return signInWithPopup(auth, GoogleProvider)
    }
    if (provider === "github") {
        return signInWithPopup(auth, GithubProvider)
    }
    throw new Error("Invalid provider")
}

export async function signOut() {
  return firebaseSignOut(auth)
}

export function useUser() {
  const [user, setUser] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, user => setUser(user))
  }, [])

  return user
}
