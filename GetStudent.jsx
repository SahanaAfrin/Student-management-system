import {useState} from "react";
import {Link} from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import { GetCall } from "../api/ApiCalls";
function GetStudent() {
    const [output, setOutput] = useState({nic: "", name: "", address: "", contact: ""});
    const [nic, setNic] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    function handleChange(event) {
        setOutput({nic: "", name: "", address: "", contact: ""});
        setResponseMessage("");
        setErrMessage("");
        const newNic = event.target.value;
        setNic(newNic);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");
        if (!/^[A-Za-z0-9]+$/.test(nic)) {
            setErrMessage("Student roll number is empty or invalid");
            document.getElementById("nic").focus();
            return;
        }
        try {
            const student = await GetCall(nic);
            if (student) {
                setResponseMessage("");
                setOutput({
                    nic: student.nic,
                    name: student.name,
                    address: student.address,
                    contact: student.phone
                });
            } else {
                setResponseMessage("No student found");
            }
        } catch (err) {
            if (err.response) {
                setResponseMessage(err.response.data.message);
            } else {
                setResponseMessage(`Error: ${err.message}`);
            }
        } finally {
            setNic("");
        }
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"100px"} alt={"student-logo"}/>
            <div className="student-container">
                <h1>Get Student Details</h1>
                <br/>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={nic} id="nic" name="nic" placeholder="Enter Roll Number"/>

                    <h5>{errMessage}&nbsp;</h5>
                    <br/>
                    <button type={"submit"}>Get Student Details</button>
                    <Link className={"back-link"} to='/dashboard'>Back</Link>
                </form>
                <OutputContainer
                    nic={output.nic}
                    name={output.name}
                    address={output.address}
                    contact={output.contact}
                />
                <br/>
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default GetStudent;
