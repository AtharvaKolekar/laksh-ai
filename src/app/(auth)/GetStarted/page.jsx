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

  const welcomeMessage =
    "Hello there! Welcome to WonderAI.<br>I'm here to assist you with any questions or tasks you have. Let's get started, shall we?";

  const router = useRouter();
  const [messages, setMessages] = useState([welcomeMessage]);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  function getYearsArray() {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = 0; i < 5; i++) {
      yearsArray.push((currentYear + i).toString());
    }
    return yearsArray;
  }

  const questions = [
    "Hey there! What's your good name?",
    "Nice to meet you! What pronouns do you prefer?",
    "Cool! So, what field are you currently pursuing?",
    "When do you expect to graduate?",
    "Which college are you attending?",
    "Sign up to continue your careerpath with WonderAI",
  ];

  const optionsList = [
    ["Get started"],
    ["input", "Enter your full name"],
    ["He/Him/his", "She/Her", "Them/They", "Prefer not to say"],
    ["B.Tech", "B.Sc", "B.E.", "BCA", "Other"],
    getYearsArray(),
    ["input", "Enter your college name"],
    ["Google Account", "Github Account"],
  ];

  const user = useUser();
  if (user === false) return <LoadingPage />;
  if (user) {
    let data = responses;
    const [, name, pronouns, course, graduationyear, college] = data;
    const structuredData = {
      name,
      pronouns,
      course,
      graduationyear,
      college,
    };

    console.log(index);
    if (responses.length == 7) {
      get(child(ref(database), `UserData/${user.uid}`)).then((snapshot) => {
        if (!snapshot.exists()) {
          set(ref(database, "UserData/" + user.uid), structuredData).then(
            () => {
              router.replace("/Dashboard");
              return <LoadingPage />;
            }
          );
        } else {
          router.replace("/Dashboard");
          return <LoadingPage />;
        }
      });
      return <LoadingPage />;
    }
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

  const addMessage = () => {
    if (index <= questions.length) {
      setShowAnswer(false);
      setMessages([...messages, questions[index]]);
      setIndex(index + 1);
    }
  };

  const handleOptionClick = (option) => {
    if (index == 6) {
      if (option == "Google Account") {
        signInwithGoogle();
      }
      if (option == "Github Account") {
        signInwithGithub();
      }
    }
    setResponses([...responses, option]);
    addMessage();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputValue.length < 2) return;
    setResponses([...responses, inputValue]);
    setInputValue("");
    addMessage();
  };

  return (
    <main>
      <Header title="Get Started with WonderAi" />
      <div className={styles.container}>
        <div style={{ height: "35px", backgroundColor: "#ffffff" }}>
          <Progress
            className="rounded"
            value={3 + (index / questions.length) * 100}
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

        {index <= questions.length && showAnswer && (
          <>
            {optionsList[index][0] === "input" ? (
              <form
                onSubmit={handleInputSubmit}
                className={styles.inputContainer}
              >
                <input
                  type="text"
                  placeholder={optionsList[index][1]}
                  value={inputValue}
                  name="input"
                  onChange={handleInputChange}
                />
                <button type="submit">Continue</button>
              </form>
            ) : (
              <OptionButtons
                options={optionsList[index]}
                onOptionClick={handleOptionClick}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
