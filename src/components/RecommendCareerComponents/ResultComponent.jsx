
import styles from "./result.module.css";
import { useRouter } from "next/navigation";

export default function LoadingComponent({ result, onClick }) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      
      <p className={styles.toRight}>
        <span className={styles.ai}>
          LakshAI
          <svg fill="#ba0ffd" viewBox="0 0 24 24">
            <path d="M16 20L17.6 14.6L23 13L17.6 11.4L16 5.99999L14.4 11.4L9 13L14.4 14.6L16 20Z"></path>
            <path d="M7.5 21L8.3 18.3L11 17.5L8.3 16.7L7.5 14L6.7 16.7L4 17.5L6.7 18.3L7.5 21Z"></path>
            <path d="M7.5 10.8L8.07143 8.87142L10 8.29999L8.07143 7.72856L7.5 5.79999L6.92857 7.72856L5 8.29999L6.92857 8.87142L7.5 10.8Z"></path>
          </svg>
        </span>
        recommends you to be a
      </p>
      <div className={styles.animate}>
        <h2>{result[0]}</h2>
      </div>
      <div className={styles.otherCareersContainer}>
        <p className={styles.toRight + " " + styles.d}>
          🚩 Careers you also might be interested
        </p>
        <div className={styles.otherCareers}>
          <div onClick={() => router.push("/Dashboard/Roadmap?career=" + result[1]) } className={styles.sec + " " + styles.a} >
            <p>{result[1]}</p>
          </div>
          <div onClick={() => router.push("/Dashboard/Roadmap?career=" + result[2]) } className={styles.sec + " " + styles.b}>
            <p>{result[2]}</p>
          </div>
          <div onClick={() => router.push("/Dashboard/Roadmap?career=" + result[3]) } className={styles.sec + " " + styles.c}>
            <p>{result[3]}</p>
          </div>
        </div>
      </div>
      <div className={styles.generateAgain}>
        <button onClick={onClick}>Generate Again</button>
      </div>
      <div className={styles.continueRoadmap}>
        <button onClick={() => router.push("/Dashboard/Roadmap?career=" + result[0]) }>Continue to Roadmap</button>
      </div>
    </div>
  );
}
