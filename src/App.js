import "./styles.css";
import React, { useState, useRef } from "react";

const CodeInputForm = () => {
  const [code, setCode] = useState(Array(5).fill(""));
  const [authResult, setAuthResult] = useState("");
  const [toastMessages, setToastMessages] = useState({ ok: "", error: "" });
  const inputRefs = useRef([]);

  const handleInputChange = (index) => (event) => {
    const value = event.target.value.toUpperCase();

    if (/^[a-zA-Z0-9\-_]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Focus the next input
      if (index < 4) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else {
      alert("半角英数字で入力してください");
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }

    if (code.join("").length === 4 && value) {
      submitCode(newCode.join("") + value);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = (event.clipboardData || window.clipboardData)
      .getData("Text")
      .toUpperCase()
      .replace(/-/g, "");

    let validPastedData = "";
    for (let char of pastedData) {
      if (/^[a-zA-Z0-9]*$/.test(char)) {
        validPastedData += char;
      } else {
        break;
      }
    }

    if (validPastedData.length !== pastedData.length) {
      alert("不正な値が含まれています。");
      return;
    }

    const splitData = validPastedData.split("");
    setCode(splitData.concat(Array(5 - splitData.length).fill("")));
    splitData.forEach((char, index) => {
      const input = inputRefs.current[index];
      if (input) {
        input.value = char;
      }
    });

    if (validPastedData.length === 5) {
      submitCode(validPastedData);
    }
  };

  const submitCode = (finalCode) => {
    // Replace this URL with your actual endpoint
    fetch("url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ CODE: finalCode }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("サーバ側でエラーが発生しました");
        }
        return response.json();
      })
      .then((data) => {
        // Handle success response
        setAuthResult("ok");
        // Redirect to the next page or perform other success actions
      })
      .catch((error) => {
        // Handle error response
        setAuthResult("error");
        setToastMessages((prev) => ({
          ...prev,
          error: "サーバ側でエラーが発生しました",
        }));
      });
  };

  return (
    <>
      <div className="code-form">
        {Array.from({ length: 5 }, (_, index) => (
          <React.Fragment key={index}>
            {index === 3 && <span className="skip">-</span>}
            <input
              className="code-form-input"
              type="text"
              maxLength="1"
              pattern="^[a-zA-Z0-9]+$"
              value={code[index]}
              onInput={handleInputChange(index)}
              onPaste={handlePaste}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          </React.Fragment>
        ))}
      </div>
      <div id="auth-result">{authResult === "ok" ? "✅" : "❌"}</div>
      <div className="toast toastOk">{toastMessages.ok}</div>
      <div className="toast toastError">{toastMessages.error}</div>
    </>
  );
};

export default CodeInputForm;
