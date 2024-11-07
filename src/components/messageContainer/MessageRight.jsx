import styles from "./page.module.css";
import Typewriter from "typewriter-effect";

export default function MessageRight({ text }) {
  return <div className={styles.container + " " + styles.right}>{text}</div>;
}
