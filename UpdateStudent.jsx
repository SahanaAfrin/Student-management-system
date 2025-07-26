import { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import { GetCall, PatchCall } from "../api/ApiCalls";

function UpdateStudent() {
    const [originalStudent, setOriginalStudent] = useState(null);
    const [student, setStudent] = useState({ nic: "", name: "", address: "", contact: "" });
    const [updatedStudent, setUpdatedStudent] = useState(null);
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;
        setResponseMessage("");
        setErrMessage("");
        setStudent((prevValue) => ({
            ...prevValue,
            [name]: value
        }));
    }

    async function handleCheckOut() {
        setResponseMessage("");
        setErrMessage("");

        if (!/^[A-Za-z0-9]+$/.test(student.nic)) {
            setErrMessage("Student roll number is empty or invalid");
            document.getElementById("nic").focus();
            return;
        }

        try {
            const foundStudent = await GetCall(student.nic);
            if (foundStudent) {
                setOriginalStudent({
                    RollNumber: foundStudent.nic,
                    name: foundStudent.name,
                    address: foundStudent.address,
                    contact: foundStudent.phone
                });
                setUpdatedStudent(null);
            } else {
                setErrMessage("No student found with this roll number");
                setOriginalStudent(null);
                setUpdatedStudent(null);
            }
        } catch (error) {
            setErrMessage("Failed to fetch student: " + (error.response?.data?.message || error.message));
            setOriginalStudent(null);
            setUpdatedStudent(null);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");

        if (!originalStudent) {
            setErrMessage("Inputs didn't check out");
            return;
        }

        const updatedData = {
            nic: student.nic,
            name: student.name || originalStudent.name,
            address: student.address || originalStudent.address,
            phone: student.contact || originalStudent.contact
        };

        try {
            const updated = await PatchCall(student.nic, updatedData);
            setUpdatedStudent({
                RollNumber: updated.nic,
                name: updated.name,
                address: updated.address,
                contact: updated.phone
            });
            setResponseMessage("The student's details have been updated successfully");
        } catch (error) {
            setErrMessage("Failed to update student: " + (error.response?.data?.message || error.message));
            setUpdatedStudent(null);
        }

        setStudent({ nic: "", name: "", address: "", contact: "" });
    }

    return (
        <div className="centered-element">
            <img className="student-img" src="https://cdn-icons-png.flaticon.com/512/5349/5349022.png" width="120px" alt="user-logo" />
            <div className="student-container">
                <h1>Update Student Details</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={student.nic} id="nic" name="nic" placeholder="Enter Roll Number *" />
                    <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Enter Name " />
                    <input onChange={handleChange} value={student.address} id="address" name="address" placeholder="Enter Address" />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Enter Contact " />
                    <h5>{errMessage}&nbsp;</h5>
                    <br />
                    <button onClick={handleCheckOut} type="button">Check Out</button>
                    <button type="submit">Update Student Details</button>
                    <Link className="back-link" to="/dashboard">Back</Link>
                </form>
                <br />

                {/* BEFORE UPDATE TABLE */}
                <h2>Before Update:</h2>
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{originalStudent?.RollNumber || "-"}</td>
                            <td>{originalStudent?.name || "-"}</td>
                            <td>{originalStudent?.address || "-"}</td>
                            <td>{originalStudent?.contact || "-"}</td>
                        </tr>
                    </tbody>
                </table>

                {/* AFTER UPDATE TABLE */}
                <h2>After Update:</h2>
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{updatedStudent?.RollNumber || "-"}</td>
                            <td>{updatedStudent?.name || "-"}</td>
                            <td>{updatedStudent?.address || "-"}</td>
                            <td>{updatedStudent?.contact || "-"}</td>
                        </tr>
                    </tbody>
                </table>

                <OutputContainer
                    nic={updatedStudent?.RollNumber || ""}
                    name={updatedStudent?.name || ""}
                    address={updatedStudent?.address || ""}
                    contact={updatedStudent?.contact || ""}
                />
                <br />
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default UpdateStudent;
