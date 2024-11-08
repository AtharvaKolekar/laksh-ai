"use client";
import styles from "./loading.module.css";
import { useState, useEffect } from "react";

export default function LoadingComponent({ onFinish }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Evaluating your specialization",
    "Assessing passions and interests",
    "Aligning skills with potential careers",
    "Identifying the best career matches",
    "Finalizing the perfect career path",
  ];
  
  useEffect(() => {
    if (step === steps.length) {
      onFinish();
    }
    const timeout = setTimeout(() => {
      if (step < steps.length) {
        setStep((prevElem) => prevElem + 1);
      } 
    }, 4000);

    return () => clearTimeout(timeout);
  }, [step, steps.length, onFinish]);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.stepsContainer}>
        <div className={styles.loader}></div>
        <br />
        <div className="step">
            <div className="loader"></div>
            <p>{steps[step]}</p>
        </div>

      </div>
    </div>
  );
}
