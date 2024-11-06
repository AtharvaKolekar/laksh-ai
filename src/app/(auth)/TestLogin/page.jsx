// Import necessary modules and components...
"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Header from "@/components/chat/header/Header";
import { Progress } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import LoadingPage from "@/components/loadingPage/LoadingPage";

import MessageContainer from "@/components/messageContainer/MessageContainer";
import OptionButtons from "@/components/OptionButton/OptionButtons";
import { signIn, signOut, useUser } from "@/lib/auth"
import { initFirebase } from "@/lib/firebase";

import { getDatabase , ref, set, get, child } from "firebase/database";
import { useRouter } from "next/navigation";

export default function GetStarted() {

  
  const app = initFirebase();
  const database = getDatabase(app);

  const welcomeMessage =
    "Hello there! Welcome to WonderAI.<br>I'm here to assist you with any questions or tasks you have. Let's get started, shall we?";

  const router = useRouter();
  const [messages, setMessages] = useState([welcomeMessage]);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [inputValue, setInputValue] = useState("");
  
  let [showAnswer, setShowAnswer] = useState(false);



  
  
  const user = useUser();
  if(user === false)  return <LoadingPage />
  if (user) {
    //let data = responses;
    const data = ['Get started', 'Atharva', 'He/Him/his', 'B.Tech', '2026', 'PCE'];
    
    const [ , name, pronouns, course, graduationyear, college] = data;
    const structuredData = {
      name,
      pronouns,
      course,
      graduationyear,
      college
    };

    console.log(user);
    get(child(ref(database), `UserData/${user.uid}`)).then((snapshot) => {
      
      if (!snapshot.exists()) {
          
        set(ref(database, 'UserData/' + user.uid), structuredData)
        .then(() => {
          router.replace("/Dashboard");
          return <LoadingPage />
        })
        
      } 
      else {
        router.replace("/Dashboard");
        return <LoadingPage />
      }
      
    })
    return <LoadingPage />

  }



  const signInwithGoogle = async () => {
    // let data = responses;
    const data = ['Get started', 'Atharva', 'He/Him/his', 'B.Tech', '2026', 'PCE'];

    const [ , name, pronouns, course, graduationyear, college] = data;
    const structuredData = {
      name,
      pronouns,
      course,
      graduationyear,
      college
    };

    signIn("google")
      .then((result) => {
        // goDashboard(result.user);
      })
      .catch((error) => {
        console.log(error.message);
        window.location.reload();
      });

  };
  const signInwithGithub = async () => {
    const result = await signInWithPopup(auth, GithubProvider);
    console.log(result.user);
  };



  return (
   <main style={{textAlign : "center"}}>
      <br /><br />
      <button onClick={signInwithGoogle}>SignIn with Google</button>
      <br /><br />
      <button onClick={signInwithGithub}>SignIn with GitHub</button>
      <br /><br />
      <button onClick={() => signOut} className="hover:underline ">SignOut</button>
   </main>
  );
}
