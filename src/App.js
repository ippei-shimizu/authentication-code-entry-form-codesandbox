import "./styles.css";
import React, { useState, useRef, useEffect } from "react";

const CodeInput = ({ onCodeComplete }) => {
  const inputRefs = useRef([]);
  const [codeInputs, setCodeInputs] = useState(Array(6).fill(""));

  const validateInput = (input) => /^[a-zA-Z0-9\-_]*$/.test(input);

  const handleChange = (value, index) => {
    const upperValue = value.toUpperCase();
    if (validateInput(upperValue)) {
      const newCodeInputs = [...codeInputs];
      newCodeInputs[index] = upperValue;
      setCodeInputs(newCodeInputs);
      // Try to focus next input if exists and is not a skip input
      const nextInputRef = inputRefs.current[index + 1];
      if (nextInputRef && !nextInputRef.classList.contains("skip")) {
        nextInputRef.focus();
      }
      if (newCodeInputs.join("").length === 5) {
        onCodeComplete(newCodeInputs.join(""));
      }
    } else {
      alert("半角英数字で入力してください");
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = (e.clipboardData || window.clipboardData)
      .getData("Text")
      .toUpperCase()
      .replace(/-/g, "");

    let validLength = 0;
    for (let i = 0; i < pastedData.length; i++) {
      if (validateInput(pastedData[i])) {
        validLength++;
      } else {
        break;
      }
    }

    const newCodeInputs = [...codeInputs];
    for (let i = 0; i < 6 && i < validLength; i++) {
      newCodeInputs[index + i] = pastedData[i];
    }
    setCodeInputs(newCodeInputs);

    if (validLength !== pastedData.length) {
      alert("不正な値が含まれて入れています。");
    } else if (newCodeInputs.join("").length === 5) {
      onCodeComplete(newCodeInputs.join(""));
    }
  };

  // You should implement onCodeComplete function to handle the completed code
  // For example, posting it to a server or validating it in some way.

  return (
    <div>
      {codeInputs.map((value, index) => (
        <input
          key={index}
          className="code-form-input"
          value={value}
          onChange={(e) => handleChange(e.target.value, index)}
          onPaste={(e) => handlePaste(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
      {/* Other elements like toast notifications and result icons go here */}
    </div>
  );
};

export default CodeInput;
