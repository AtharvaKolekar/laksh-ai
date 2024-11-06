"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "@/components/chat/header/Header";

import { signOut, useUser } from "@/lib/auth"
import { initFirebase } from "@/lib/firebase";

import { getDatabase , ref, set, get, child } from "firebase/database";
import { useRouter } from 'next/navigation'

export default function Dashboard() {


  const router = useRouter();
  const app = initFirebase();
  const database = getDatabase(app);
  const user = useUser();

  const [name, setName] = useState("");

  if (user) {
    console.log(user);
    get(child(ref(database), `UserData/${user.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setName(snapshot.val().name);
      } else {
        console.log("No data available");
      }
    })
  }

  return (
    <main>
        <Header
          title={"Mentors Page"}
          profile
          logout={signOut}
        />
      <div className={styles.container}>
    
      </div>
    </main>
  );
}