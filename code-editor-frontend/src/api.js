import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});


export const executeCode = async (language, sourceCode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};

export const getSuggestions = async (sourceCode, language) => {
  try {
    const response = await axios.post("http://localhost:8000/api/suggestions", {
      code: sourceCode,
      language: language,
    });

    return response.data.suggestions.join("\n");
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
};
