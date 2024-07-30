import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email,
                password
            });
            const token = response.data.authorization.token;
            localStorage.setItem("token", token);

            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            if (userRole === "admin") {
                navigate("/admin"); 
            } else {
                navigate("/submissions"); 
            }
        } catch (error) {
            console.error("Login error", error);
        }
    };

    return (
        <div className="auth-page">
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <FaLock className="icon" />
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>
                            Don't have an account?
                            <button type="button" onClick={() => navigate("/register")} className="link-button">
                                Register
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;