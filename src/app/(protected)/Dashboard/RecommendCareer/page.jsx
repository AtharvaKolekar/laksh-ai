"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

import MessageContainer from "@/components/messageContainer/MessageContainer";

import SkillSelector from "@/components/RecommendCareerComponents/SkillSelector";
import InterestSelector from "@/components/RecommendCareerComponents/InterestSelector";
import SpecializationSelector from "@/components/RecommendCareerComponents/SpecializationSelector";
import CertificateInput from "@/components/RecommendCareerComponents/CertificateInput";
import LoadingComponent from "@/components/RecommendCareerComponents/LoadingComponent";
import ResultComponent from "@/components/RecommendCareerComponents/ResultComponent";

import { initFirebase } from "@/lib/firebase";
import { getDatabase, ref, get, child } from "firebase/database";
import { useRouter } from "next/navigation";

import { Progress } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RecommendCareer() {
  const router = useRouter();
  const app = initFirebase();
  const database = getDatabase(app);

  const [page, setPage] = useState(0);
  const [responses, setResponses] = useState([]);

  const [show, setShow] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    // event.preventDefault();

    const formData = new FormData();
    formData.append("specialization", responses[0].toString());
    formData.append("interest", responses[1].toString());
    formData.append("skills", responses[2].toString());
    formData.append("certification", responses[3].toString());

    try {
      const res = await fetch(
        "https://harshalnelge.pythonanywhere.com/career/recommend/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const data = await res.json();
      console.log(data);
      setResponse(data); // Assuming you want to store the response
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleContinue = (data) => {
    console.log(page);
    if (data.length < 1) return;
    setResponses([...responses, data]);
    setPage(page + 1);
  };

  const QuestionCard = ({ question, window }) => {
    return (
      <div className={styles.container}>
        <div style={{ height: "35px", backgroundColor: "#ffffff" }}>
          <Progress
            className="rounded"
            value={3 + (page / 5) * 100}
            barStyle={{ backgroundColor: "#6100FF" }}
          />
        </div>
        <MessageContainer text={question} callback={() => {}} />
        {window === 0 && <SpecializationSelector onContinue={handleContinue} />}
        {window === 1 && <InterestSelector onContinue={handleContinue} />}
        {window === 2 && <SkillSelector onContinue={handleContinue} />}
        {window === 3 && <CertificateInput onContinue={handleContinue} />}
      </div>
    );
  };

  // let currentQuestion ;
  let [currentQuestion, setCurrentQuestion] = useState(null);
  useEffect(() => {
    const myFun = async () => {
      if (page === 4) {
        console.log(responses);
      }

      switch (page) {
        case 0:
          setCurrentQuestion(
            <QuestionCard
              question="Hi there! I'm here to help you explore career options. To get started, could you tell me what specialization you're currently pursuing?"
              window={0}
            />
          );
          break;
        case 1:
          setCurrentQuestion(
            <QuestionCard
              question="Great, sounds interesting! Now, could you share what specific field or area you're most interested in?"
              window={1}
            />
          );
          break;
        case 2:
          setCurrentQuestion(
            <QuestionCard
              question="That's wonderful to hear! It's great that you have a clear area of interest. Now, let's talk about your skills. Could you share some of the skills you already have or ones you would like to develop further?"
              window={2}
            />
          );

          break;
        case 3:
          setCurrentQuestion(
            <QuestionCard
              question="Fantastic! Developing your skills is a crucial step toward your career goals. Have you completed any certifications or courses that you'd like to mention?"
              window={3}
            />
          );
          break;
        case 4:
          handleSubmit();
          setCurrentQuestion(
            <LoadingComponent
              onFinish={() => {
                setPage(page + 1);
              }}
            />
          );
          // handleSubmit();
          break;
        case 5:
          setCurrentQuestion(
            <ResultComponent
              result={response}
              onClick={() => {
                setResponses([]);
                setPage(0);
              }}
            />
          );
          // handleSubmit();
          break;
        default:
          setCurrentQuestion(null);
      }
    };

    myFun();
    return () => {};
  }, [page, show]);

  return <>{currentQuestion}</>;
}
