import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Admin from "./pages/Admin/Admin";
import EditUser from "./pages/Admin/EditUser";
import CodeEditor from "./pages/CodeEditor/CodeEditor";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Home from "./pages/Home/page";
import Navebar from "./components/Navbar";
import CodeSubmissions from "./pages/CodeSubmissions/CodeSubmissions";

import "./pusher";
import ChatPage from "./pages/Chat/page";
import MessagePage from "./pages/Message/page";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <Router>
      <div>
        <Navebar />
        {/* <ChatPage /> */}

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/messages/:chatId" element={<MessagePage />} />
          <Route
            path="/editor"
            element={
              <ChakraProvider theme={theme}>
                <CodeEditor />
              </ChakraProvider>
            }
          />
          <Route path="/submissions" element={<CodeSubmissions />} />
          <Route path="/submissions" element={<CodeSubmissions />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
