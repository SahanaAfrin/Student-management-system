import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginCall } from "../api/ApiCalls";

function Login() {
    const [admin, setAdmin] = useState({ username: "", password: "" });
    const [errMessage, setErrMessage] = useState("");
    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;
        setErrMessage("");
        setAdmin(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    async function handleLogin(event) {
        event.preventDefault();
        setErrMessage("");

        if (!admin.username) {
            setErrMessage("Username is required");
            document.getElementById("username").focus();
            return;
        }
        if (!admin.password) {
            setErrMessage("Password is required");
            document.getElementById("password").focus();
            return;
        }

        try {
            const response = await LoginCall(admin);
            localStorage.setItem("token", response.token);
            navigate("/dashboard");
        } catch (error) {
            setErrMessage(error.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className={"centered-element"}>
            <img className={"login-img"} src={"./images/login-logo.png"} width={"120px"} alt={"login-logo"} />
            <div className={"login-container"}>
                <h1>Login</h1>
                <br />
                <form onSubmit={handleLogin} className={"login-form"}>
                    <input onChange={handleChange} id={"username"} type={"text"} name={"username"} placeholder={"Username"} value={admin.username} />
                    <input onChange={handleChange} id={"password"} type={"password"} name={"password"} placeholder={"Password"} value={admin.password} />
                    <button type={"submit"}>Login</button>
                </form>
                <h5>{errMessage}</h5>
                <p>
                    Don't have an account ?
                </p>
                <button onClick={() => navigate("/signup")}>Sign Up</button> {/* Add Sign Up button */}
            </div>
        </div>
    );
}

export default Login;
