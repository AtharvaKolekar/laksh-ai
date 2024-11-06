import styles from "./page.module.css";
import Typewriter from "typewriter-effect";

export default function MessageContainer({ text, callback }) {

  return (
    <div className={styles.container}>
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
