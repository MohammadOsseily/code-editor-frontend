import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Admin from "./pages/Admin/Admin";
import EditUser from "./pages/Admin/EditUser";
import CodeEditor from "./pages/CodeEditor/CodeEditor";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Admin from "./pages/Admin/Admin";
import EditUser from "./pages/Admin/EditUser";
import Home from "./pages/Home/page";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route
            path="/editor"
            element={
              <ChakraProvider theme={theme}>
                <CodeEditor />
              </ChakraProvider>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
