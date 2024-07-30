import React, { useRef, useState } from "react";
import { Box, HStack, Button } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { getSuggestions } from "../../api";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isCopilotEnabled, setIsCopilotEnabled] = useState(true);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue("");
  };

  const handleChange = (newValue) => {
    setValue(newValue);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (isCopilotEnabled) {
      setTypingTimeout(
        setTimeout(async () => {
          if (editorRef.current) {
            const sourceCode = editorRef.current.getValue();
            try {
              const suggestions = await getSuggestions(sourceCode);
              if (suggestions && !sourceCode.includes(suggestions)) {
                setValue((prevValue) => `${prevValue.trim()}\n${suggestions}`);
              }
            } catch (error) {
              console.error("Error fetching suggestions:", error);
            }
          }
        }, 1000)
      );
    }
  };

  const handleSaveCode = async () => {
    if (!value.trim()) {
      alert("Please enter some code before saving.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated.");
        return;
      }
      
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub; 
      console.log(userId);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/code_submission",
        {
          user_id: userId,
          code: value,
        }
      );
      alert(response.data.message || "Code saved successfully!");
    } catch (error) {
      console.error("Error saving code:", error);
      alert("There was an error saving the code.");
    }
  };

  return (
    <Box className="h-screen">
      <HStack spacing={4}>
        <Box w="50%">
          <HStack spacing={2} mb={4}>
            <LanguageSelector language={language} onSelect={onSelect} />
            <Button
              style={{ alignSelf: "center", marginTop: "35px" }}
              onClick={() => setIsCopilotEnabled(!isCopilotEnabled)}
              colorScheme={isCopilotEnabled ? "green" : "red"}
            >
              {isCopilotEnabled ? "Disable" : "Enable"} Copilot
            </Button>
            <Button
              style={{ alignSelf: "center", marginTop: "35px" }}
              onClick={handleSaveCode}
              colorScheme="blue"
            >
              Save Code
            </Button>
          </HStack>
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            theme="vs-dark"
            language={language}
            value={value}
            onMount={onMount}
            onChange={handleChange}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
