"use client";
import { useState } from "react";
import styles from "./page.module.css";

const CertificateInput = ({ onContinue }) => {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  const setOption = (option) => {
    const updatedOptions = options.map((item) =>
      item.option === option ? { ...item, isSelected: !item.isSelected } : item
    );
    setOptions(updatedOptions);
  };

  const addNewOption = (e) => {
    e.preventDefault();
    if (
      newOption.trim() !== "" &&
      !options.some(
        (option) => option.option.toLowerCase() === newOption.toLowerCase()
      )
    ) {
      setOptions([...options, { option: newOption, isSelected: true }]);
      setNewOption("");
    }
  };
  const selectedOptions = options.filter((item) => item.isSelected).map(optionObj => optionObj.option);
  return (
    <div>
      <div className={styles.buttonContainer}>
        {options.map((button, key) => (
          <OptionButton
            key={key}
            option={button.option}
            isSelected={button.isSelected}
            setOption={setOption}
          />
        ))}
      </div>
      <form onSubmit={addNewOption} className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter your option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <div className={styles.continuecontainer}>
        <button onClick={() => onContinue(selectedOptions)}>Continue</button>
      </div>
    </div>
  );
};

const OptionButton = ({ option, setOption, isSelected }) => {
  return (
    <button
      className={styles.optionButton + " " + (isSelected ? styles.selected : "")}
      onClick={() => {
        setOption(option);
      }}
    >
      {option}
    </button>
  );
};

export default CertificateInput;
