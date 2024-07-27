import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <div className="auth-page">
            <div className="form-box login">
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required />
                        <FaLock className="icon" />
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>
                            Don't have an account? <a onClick={handleRegister}>Register</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
