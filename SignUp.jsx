import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostCall } from "../api/ApiCalls";

function Signup() {
    const [user, setUser] = useState({ username: "", password: "" });
    const [errMessage, setErrMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;
        setErrMessage("");
        setSuccessMessage("");
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    async function handleSignup(event) {
        event.preventDefault();
        setErrMessage("");
        setSuccessMessage("");

        if (!user.username || !user.password) {
            setErrMessage("Username and password are required");
            return;
        }

        try {
            await PostCall(user);
            setSuccessMessage("User registered successfully. Redirecting to login...");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            setErrMessage(error.response?.data?.message || "Signup failed");
        }
    }

    return (
        <div className={"centered-element"}>
            <img className={"login-img"} src={"./images/login-logo.png"} width={"120px"} alt={"login-logo"} />
            <div className={"login-container"}>
                <h1>Sign Up</h1>
                <form onSubmit={handleSignup} className={"login-form"}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={user.username}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <h5 style={{ color: "red" }}>{errMessage}</h5>
                <h5 style={{ color: "green" }}>{successMessage}</h5>
            </div>
        </div>
    );
}

export default Signup;
