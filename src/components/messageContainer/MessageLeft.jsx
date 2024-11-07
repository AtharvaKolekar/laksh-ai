import styles from "./page.module.css";
import Typewriter from "typewriter-effect";

export default function MessageRight({ text, callback }) {
  return (
    <div className={styles.container + " " + styles.left}>
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString(text)
            .callFunction(() => {
              callback();
            })
            .start();
        }}
        options={{
          delay: 30,
        }}
      />
    </div>
  );
}
