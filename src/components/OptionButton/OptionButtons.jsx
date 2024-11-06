// components/OptionButtons.js
import React from "react";
import styles from "./page.module.css";

const OptionButtons = ({ options, onOptionClick }) => {
  return (
    <div className={styles.buttonContainer}>
      {options.map((option, index) => (
        <button
          key={index}
          className={styles.button}
          onClick={() => onOptionClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default OptionButtons;
