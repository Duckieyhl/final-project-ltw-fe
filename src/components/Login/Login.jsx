import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [creds, setCreds] = useState({ login_name: "", password: "" });
    const [registerData, setRegisterData] = useState({
        login_name: "", password: "", confirm_password: "",
        first_name: "", last_name: "", location: "", description: "", occupation: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8081/admin/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(creds),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.user, data.token);
                localStorage.setItem("token", data.token);
                navigate('/users');
            } else {
                setError("Invalid username or password!");
            }
        } catch (err) {
            setError("Login failed!");
        }
    };

    const handleRegister = async () => {
        setError("");
        setSuccess("");

        if (registerData.password !== registerData.confirm_password) {
            return setError("Mật khẩu không khớp!");
        }

        try {
            const response = await fetch("http://localhost:8081/user", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                setSuccess("Đăng ký thành công! Hãy đăng nhập.");
                setRegisterData({
                    login_name: "", password: "", confirm_password: "",
                    first_name: "", last_name: "", location: "", description: "", occupation: ""
                });
                setIsRegister(false); // chuyển về form login
            } else {
                const data = await response.json();
                setError(data.message || "Đăng ký thất bại!");
            }
        } catch (err) {
            setError("Đăng ký thất bại!");
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 400 }}>
            {!isRegister ? (
                // Form Login
                <div>
                    <h2>Đăng nhập</h2>
                    <span>Login Name:</span><br />
                    <input
                        type="text"
                        value={creds.login_name}
                        onChange={(e) => setCreds({ ...creds, login_name: e.target.value })}
                    /><br /><br />
                    <span>Password:</span><br />
                    <input
                        type="password"
                        value={creds.password}
                        onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                    /><br /><br />
                    <button onClick={handleLogin}>Đăng nhập</button>
                    <button onClick={() => { setIsRegister(true); setError(""); }} style={{ marginLeft: 10 }}>
                        Đăng ký
                    </button>
                </div>
            ) : (
                // Form Register
                <div>
                    <h2>Đăng ký</h2>
                    <span>Login Name:</span><br />
                    <input type="text" value={registerData.login_name}
                        onChange={(e) => setRegisterData({ ...registerData, login_name: e.target.value })}
                    /><br /><br />
                    <span>Password:</span><br />
                    <input type="password" value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    /><br /><br />
                    <span>Confirm Password:</span><br />
                    <input type="password" value={registerData.confirm_password}
                        onChange={(e) => setRegisterData({ ...registerData, confirm_password: e.target.value })}
                    /><br /><br />
                    <span>First Name:</span><br />
                    <input type="text" value={registerData.first_name}
                        onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                    /><br /><br />
                    <span>Last Name:</span><br />
                    <input type="text" value={registerData.last_name}
                        onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                    /><br /><br />
                    <span>Location:</span><br />
                    <input type="text" value={registerData.location}
                        onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                    /><br /><br />
                    <span>Description:</span><br />
                    <input type="text" value={registerData.description}
                        onChange={(e) => setRegisterData({ ...registerData, description: e.target.value })}
                    /><br /><br />
                    <span>Occupation:</span><br />
                    <input type="text" value={registerData.occupation}
                        onChange={(e) => setRegisterData({ ...registerData, occupation: e.target.value })}
                    /><br /><br />
                    <button onClick={handleRegister}>Register Me</button>
                    <button onClick={() => { setIsRegister(false); setError(""); }} style={{ marginLeft: 10 }}>
                        Đăng nhập
                    </button>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}

export default Login;