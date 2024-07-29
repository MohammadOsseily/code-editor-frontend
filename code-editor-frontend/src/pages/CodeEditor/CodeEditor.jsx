import { useRef, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { getSuggestions } from "../../api";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(""); // Reset the editor content when changing language
  };

  const handleChange = (newValue) => {
    setValue(newValue);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(async () => {
        if (editorRef.current) {
          const sourceCode = editorRef.current.getValue();
          try {
            const suggestions = await getSuggestions(sourceCode);
            // Only append if suggestions are new
            if (suggestions && !sourceCode.includes(suggestions)) {
              setValue((prevValue) => `${prevValue.trim()}\n${suggestions}`);
            }
          } catch (error) {
            console.error("Error fetching suggestions:", error);
          }
        }
      }, 1000) // Adjust the delay as needed
    );
  };

  return (
    <Box>
      <HStack spacing={4}>
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
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
