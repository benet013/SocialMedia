import api from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthForm({ method, route }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const isLogin = method === "login";
    const authType = isLogin ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = isLogin ? { username, password } : { username, password, email };
        try {
            const response = await api.post(route, payload);
            if (isLogin) {
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);
                navigate("/");
            }
            else {
                navigate("/login");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>{authType}</h2>
                    {method === "register" && (<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />)}
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <button type="submit">{authType}</button>
                    <div className="signup-or-signin">
                        {method === "login" ? (
                            <>
                                <span>Don't have an account?</span>
                                <a onClick={() => navigate("/register")}>Register</a>
                            </>
                        ) : (
                            <>
                                <span>Already have an account?</span>
                                <a onClick={() => navigate("/login")}>Login</a>
                            </>
                        )}
                    </div>
                </form>

            </div>
        </div>

    )
}

export default AuthForm;