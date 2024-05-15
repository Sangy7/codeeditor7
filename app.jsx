// App.jsx

import React, { useState, useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import './App.css'; // Import your CSS for styling

function App() {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript"); // Default language is JavaScript
  const [isEditable, setIsEditable] = useState(false); // State to manage edit permission
  const [passcode, setPasscode] = useState(""); // State to manage passcode input
  const [isStarted, setIsStarted] = useState(false); // State to track if coding has started
  const [showCongratulations, setShowCongratulations] = useState(false); // State to manage displaying congratulations message
  const [runResult, setRunResult] = useState(""); // State to store the result of code execution
  const [isCodeEmpty, setIsCodeEmpty] = useState(true); // State to track if code is empty
  const correctPasscode = "1628";

  useEffect(() => {
    // Your Google Meet integration logic can go here if you're using the Google Meet API
  }, []);

  function handleEditorDidMount() {
    const doc = new Y.Doc();
    const provider = new WebrtcProvider("test-room", doc);
    const type = doc.getText("monaco");

    if (passcode === correctPasscode) {
      setIsEditable(true); // Grant edit permission if the passcode is correct
      setShowCongratulations(true); // Show congratulations 
      setTimeout(() => {
        setShowCongratulations(false); // hide congratulations message after 5 seconds
      }, 5000);
    } else {
      // Display an error message 
      alert("Incorrect passcode. Please contact the admin for the correct passcode.");
    }
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const joinGoogleMeet = () => {
    
    window.open('YOUR_MEET_URL', '_blank');
  };

  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
  };

  const handleStartCoding = () => {
    setIsStarted(true); // Set the flag to indicate that coding has started
  };

  const handleRunCode = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const code = model.getValue();
    setRunResult(code);
  };

  return (
    <div className="container">
      <div className="header">
        <h1><a href="/">A-ON CODE EDITOR</a></h1> {/* Change the header link */}
        {!isStarted && (
          <button onClick={handleStartCoding}>Start Coding</button>
        )}
        {isStarted && (
          <>
            <select value={language} onChange={handleLanguageChange}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
            </select>
            <input
              type="password"
              value={passcode}
              onChange={handlePasscodeChange}
              placeholder="Enter Passcode"
            />
            <div className="button-group">
              <button onClick={handleEditorDidMount}>Validate Code</button>
              {!isCodeEmpty && <button onClick={handleRunCode}>Run</button>}
            </div>
          </>
        )}
      </div>
      {isStarted && (
        <div className="editor-container">
          <Editor
            height="80vh"
            width="100%"
            theme="vs-dark"
            onMount={handleEditorDidMount}
            language={language}
            options={{
              readOnly: !isEditable // Make editor read-only if permission is not granted
            }}
            onChange={(value) => {
              setIsCodeEmpty(value.trim() === ""); // Check if code is empty
              setRunResult(""); // Clear run result when code changes
            }}
            editorDidMount={handleEditorDidMount}
          />
          {!isEditable && <div className="overlay">Waiting for permission...</div>}
          {showCongratulations && (
            <div className="congratulations">
              <span role="img" aria-label="Congratulations" className="emoji">😊</span>
              <p>Congratulations! You have access.</p>
            </div>
          )}
          {runResult && (
            <div className="run-result">
              <h2>Output:</h2>
              <pre>{runResult}</pre>
            </div>
          )}
        </div>
      )}
      <div className="meet-button">
        {isStarted && (
          <button onClick={joinGoogleMeet}>Join Google Meet</button>
        )}
      </div>
    </div>
  );
}

export default App;
