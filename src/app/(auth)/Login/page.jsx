"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

import Header from "@/components/chat/header/Header";
import LoadingPage from "@/components/loadingPage/LoadingPage";
import MessageContainer from "@/components/messageContainer/MessageContainer";
import OptionButtons from "@/components/OptionButton/OptionButtons";

import { Progress } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { signIn, useUser } from "@/lib/auth";
import { initFirebase } from "@/lib/firebase";
import { getDatabase, ref, set, get, child } from "firebase/database";

export default function GetStarted() {
  const app = initFirebase();
  const database = getDatabase(app);

  const router = useRouter();
  const welcomeMessage =
    "Hello there! Welcome back to WonderAI. Please sign in to continue your careerpath with WonderAI.";

  const [messages, setMessages] = useState([welcomeMessage]);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [inputValue, setInputValue] = useState("");

  let [showAnswer, setShowAnswer] = useState(false);

  const optionsList = [["Google Account", "Github Account"]];
  const user = useUser();
  if (user === false) return <LoadingPage />;
  if (user) {
    get(child(ref(database), `UserData/${user.uid}/Details`)).then((snapshot) => {
      if (snapshot.exists()) {
        router.replace("/Dashboard");
        return <LoadingPage />;
      } else {
        router.replace("/GetStarted");
        return <LoadingPage />;
      }
    });
    return <LoadingPage />;
  }
  const signInwithGoogle = async () => {
    signIn("google")
      .then((result) => {})
      .catch((error) => {
        console.log(error.message);
        window.location.reload();
      });
  };
  const signInwithGithub = async () => {
    signIn("github")
      .then((result) => {})
      .catch((error) => {
        console.log(error.message);
        window.location.reload();
      });
  };

  const handleOptionClick = (option) => {
    console.log(index);
    if (index == 0) {
      if (option == "Google Account") {
        signInwithGoogle();
      }
      if (option == "Github Account") {
        signInwithGithub();
      }
    }
  };

  return (
    <main>
      <Header title="Welcome back to WonderAI" />

      <div className={styles.container}>
        <div style={{ height: "35px", backgroundColor: "#ffffff" }}>
          <Progress
            className="rounded"
            value={3}
            barStyle={{ backgroundColor: "#6100FF" }}
          />
        </div>

        {messages.map((message, idx) => (
          <div className={styles.parent} key={idx}>
            {message != null && (
              <MessageContainer
                text={message}
                callback={() => {
                  setShowAnswer(true);
                }}
              />
            )}
            {responses[idx] != null && (
              <div className={styles.userResponse}>
                <div className={styles.userResponseText}>{responses[idx]}</div>
              </div>
            )}
          </div>
        ))}

        {showAnswer && (
          <OptionButtons
            options={optionsList[index]}
            onOptionClick={handleOptionClick}
          />
        )}
      </div>
    </main>
  );
}
