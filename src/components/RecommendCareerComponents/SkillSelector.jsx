"use client";
import { useState } from "react";
import styles from "./page.module.css";

const SkillSelector = ({ onContinue }) => {
  const [options, setOptions] = useState([
    { option: "Python", isSelected: false },
    { option: "Java", isSelected: false },
    { option: "Kotlin", isSelected: false },
    { option: "Flutter", isSelected: false },
    { option: "Sql", isSelected: false },
    { option: "Programming", isSelected: false },
    { option: "Analytic thinking", isSelected: false },
    { option: "Linux", isSelected: false },
    { option: "C++", isSelected: false },
    { option: "AWS", isSelected: false },
    { option: "HTML/CSS", isSelected: false },
    { option: "Javascript", isSelected: false },
    { option: "React", isSelected: false },
    { option: "Node.js", isSelected: false },
    { option: "Flask", isSelected: false },
    { option: "Django", isSelected: false },
    { option: "GCP", isSelected: false },
    { option: "DSA", isSelected: false },
    { option: "Figma", isSelected: false },
    { option: "Android/flutter", isSelected: false },
    { option: "Excel", isSelected: false },
    { option: "Power BI", isSelected: false },
  ]);

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

export default SkillSelector;
