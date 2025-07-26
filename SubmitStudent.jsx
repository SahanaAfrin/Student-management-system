import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import { SubmitStudentCall, GetAllStudentsCall } from "../api/ApiCalls";

function SubmitStudent() {
    const [output, setOutput] = useState({ RollNumber: "", name: "", address: "", contact: "" });
    const [student, setStudent] = useState({ RollNumber: "", name: "", address: "", contact: "" });
    const [errMessage, setErrMessage] = useState("");
    const [students, setStudents] = useState([]); // Initialize with empty array
    const [responseMessage, setResponseMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [foundStudent, setFoundStudent] = useState(null);

    useEffect(() => {
        // Fetch students from backend on component mount
        async function fetchStudents() {
            try {
                const studentsFromBackend = await GetAllStudentsCall();
                // Map backend student data to frontend format
                const formattedStudents = studentsFromBackend.map(s => ({
                    RollNumber: s.nic,
                    name: s.name,
                    address: s.address,
                    contact: s.phone
                }));
                setStudents(formattedStudents);
            } catch (error) {
                setErrMessage("Failed to fetch students: " + (error.response?.data?.message || error.message));
            }
        }
        fetchStudents();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setResponseMessage("");
        setErrMessage("");
        setStudent((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }

    function handleCheckOut() {
        setErrMessage("");
        setResponseMessage("");
        if (!/^[A-Za-z0-9]+$/.test(student.RollNumber)) {
            setErrMessage("Student roll number is empty or invalid");
            document.getElementById("RollNumber").focus();
            return;
        } else if (!/^[A-Za-z][A-Za-z ]+$/.test(student.name)) {
            setErrMessage("Student name is empty or invalid");
            document.getElementById("name").focus();
            return;
        } else if (!/^[A-Za-z\d][A-Za-z\d-|/# ,.:;\\]+$/.test(student.address)) {
            setErrMessage("Student address is empty or invalid");
            document.getElementById("address").focus();
            return;
        } else if (!/^\d{10}$/.test(student.contact)) {
            setErrMessage("Student contact must contain exactly 10 digits");
            document.getElementById("contact").focus();
            return;
        }
        setOutput({ RollNumber: student.RollNumber, name: student.name, address: student.address, contact: student.contact });
        setStudent({ RollNumber: "", name: "", address: "", contact: "" });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");
        setIsSubmitting(true);

        if (!output.RollNumber || !output.name || !output.address || !output.contact) {
            setErrMessage("Inputs didn't check out");
            setIsSubmitting(false);
            return;
        }

        try {
            const studentData = {
                nic: output.RollNumber,
                name: output.name,
                address: output.address,
                phone: output.contact,
            };
            await SubmitStudentCall(studentData);
            setStudents((prevStudents) => [...prevStudents, output]);
            setResponseMessage("Student successfully submitted to the database");
            setOutput({ RollNumber: "", name: "", address: "", contact: "" });
            setStudent({ RollNumber: "", name: "", address: "", contact: "" });
        } catch (error) {
            setErrMessage("Failed to submit student: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"} />
            <div className="student-container">
                <h1>Submit Student</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input autoComplete="off" onChange={handleChange} value={student.RollNumber} id="RollNumber" name="RollNumber" placeholder="Enter Roll Number" />
                    <input autoComplete="name" onChange={handleChange} value={student.name} id="name" name="name" placeholder="Enter Name" />
                    <input autoComplete="street-address" onChange={handleChange} value={student.address} id="address" name="address" placeholder="Enter Address" />
                    <input autoComplete="tel" onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Enter Contact" />
                    <h5>{errMessage}&nbsp;</h5>
                    <br />
                    <button onClick={handleCheckOut} type={"button"}>Check Out</button>
                    <button type={"submit"} disabled={isSubmitting || !output.RollNumber || !output.name || !output.address || !output.contact}>Submit Student</button>
                    <Link className={"back-link"} to='/dashboard'>Back</Link>
                </form>
                <br />
                <OutputContainer
                    nic={output.RollNumber}
                    name={output.name}
                    address={output.address}
                    contact={output.contact}
                />
                <br />
                <h4>{responseMessage}</h4>
                <h2>Student List</h2>
                {foundStudent && (
                    <div>
                        <h3>Student Details:</h3>
                        <p>Roll Number: {foundStudent.RollNumber}</p>
                        <p>Name: {foundStudent.name}</p>
                        <p>Address: {foundStudent.address}</p>
                        <p>Contact: {foundStudent.contact}</p>
                    </div>
                )}
                {/* Removed duplicate responseMessage rendering */}
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '2px solid black' }}>Roll Number</th>
                            <th style={{ border: '2px solid black' }}>Name</th>
                            <th style={{ border: '2px solid black' }}>Address</th>
                            <th style={{ border: '2px solid black' }}>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.RollNumber}>
                                <td style={{ border: '2px solid black' }}>{student.RollNumber}</td>
                                <td style={{ border: '2px solid black' }}>{student.name}</td>
                                <td style={{ border: '2px solid black' }}>{student.address}</td>
                                <td style={{ border: '2px solid black' }}>{student.contact}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SubmitStudent;
