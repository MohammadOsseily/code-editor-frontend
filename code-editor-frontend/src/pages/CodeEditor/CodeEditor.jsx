import React, { useRef, useState, useEffect } from "react";
import { Box, HStack, Button } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { getSuggestions } from "../../api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CodeEditor = () => {
  const editorRef = useRef();
  const monacoRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isCopilotEnabled, setIsCopilotEnabled] = useState(true);
  const [suggestions, setSuggestions] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintWidget, setHintWidget] = useState(null);

  useEffect(() => {
    console.log("Component mounted");
    return () => console.log("Component unmounted");
  }, []);

  useEffect(() => {
    console.log("Suggestions state updated:", suggestions);
    if (hintWidget && editorRef.current) {
      if (showHint && suggestions) {
        console.log("Hint Widget: Showing hint with suggestions:", suggestions);
        hintWidget.updateContent(suggestions);
        hintWidget.show();
      } else {
        console.log("Hint Widget: Hiding hint");
        hintWidget.hide();
      }
    }
  }, [showHint, suggestions, hintWidget]);

  const onMount = (editor, monaco) => {
    console.log("onMount: Editor and Monaco instances set");
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.focus();

    setHintWidget(createHintWidget(editor, monaco));

    editor.onKeyDown((e) => {
      if (e.keyCode === monaco.KeyCode.Tab) {
        e.preventDefault();
      } else {
        setShowHint(false); // Hide suggestions on any key press
        if (hintWidget) hintWidget.hide(); // Ensure the hint widget is hidden
      }
    });
  };

  const insertSuggestion = () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco || !suggestions) return;

    const position = editor.getPosition();
    const range = new monaco.Range(
      position.lineNumber,
      position.column,
      position.lineNumber,
      position.column
    );

    editor.executeEdits("insert-suggestion", [
      {
        range: range,
        text: suggestions,
        forceMoveMarkers: true,
      },
    ]);

    setValue(editor.getValue());
    setSuggestions("");
    setShowHint(false);
    hintWidget && hintWidget.hide();
  };

  const createHintWidget = (editor, monaco) => {
    const hintNode = document.createElement("div");
    hintNode.className = "monaco-hint-widget";
    hintNode.style.background = "#1e1e1e";
    hintNode.style.color = "#d4d4d4";
    hintNode.style.padding = "5px";
    hintNode.style.borderRadius = "3px";
    hintNode.style.position = "absolute";
    hintNode.style.zIndex = "10";
    hintNode.style.display = "none";

    console.log("Hint Widget created");

    const widget = {
      domNode: hintNode,
      getId: () => "hint.widget",
      getDomNode: () => hintNode,
      getPosition: () => {
        const position = editor.getPosition();
        return {
          position,
          preference: [monaco.editor.ContentWidgetPositionPreference.BELOW],
        };
      },
      updateContent: (content) => {
        hintNode.textContent = content;
      },
      show: () => {
        hintNode.style.display = "block";
      },
      hide: () => {
        hintNode.style.display = "none";
      },
    };

    editor.addContentWidget(widget);
    return widget;
  };

  const onSelect = (language) => {
    console.log("Language selected:", language);
    setLanguage(language);
    setValue("");
  };

  const handleChange = (newValue) => {
    console.log("Editor value changed:", newValue);
    setValue(newValue);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      console.log("Typing timeout cleared");
    }

    if (isCopilotEnabled) {
      setTypingTimeout(
        setTimeout(async () => {
          if (editorRef.current) {
            const sourceCode = editorRef.current.getValue();
            console.log("handleChange: Fetching suggestions for:", sourceCode);
            try {
              const suggestionResult = await getSuggestions(
                sourceCode,
                language
              );
              console.log(
                "handleChange: Suggestions received:",
                suggestionResult
              );
              setSuggestions(suggestionResult);
              setShowHint(true);
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
              onClick={insertSuggestion}
              colorScheme="blue"
            >
              Apply Suggestion
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
