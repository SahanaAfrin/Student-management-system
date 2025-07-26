import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './DeleteStudent.css';
import { GetAllStudentsCall, DeleteCall } from "../api/ApiCalls";

function DeleteStudent() {
    const [students, setStudents] = useState([]);
    const [rollNumberToDelete, setRollNumberToDelete] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchStudents() {
            try {
                const studentsFromBackend = await GetAllStudentsCall();
                const formattedStudents = studentsFromBackend.map(s => ({
                    RollNumber: s.nic,
                    name: s.name,
                    address: s.address,
                    contact: s.phone
                }));
                setStudents(formattedStudents);
            } catch (error) {
                setMessage("Failed to fetch students: " + (error.response?.data?.message || error.message));
            }
        }
        fetchStudents();
    }, []);

    const [pendingDeleteStudent, setPendingDeleteStudent] = useState(null);

    async function handleDelete() {
        setMessage(""); // Clear any existing message when delete is attempted
        setPendingDeleteStudent(null); // Clear any existing pending delete confirmation
        const studentToDelete = students.find(student => student.RollNumber === rollNumberToDelete);
        if (!studentToDelete) {
            setMessage("No student found with that roll number.");
            return;
        }
        setPendingDeleteStudent(studentToDelete);
    }

    async function confirmDelete() {
        if (!pendingDeleteStudent) return;
        try {
            await DeleteCall(pendingDeleteStudent.RollNumber);
            const updatedStudents = students.filter(student => student.RollNumber !== pendingDeleteStudent.RollNumber);
            setStudents(updatedStudents);
            setMessage("The student has been deleted.");
            setRollNumberToDelete("");
            setPendingDeleteStudent(null);
        } catch (error) {
            setMessage("Failed to delete student: " + (error.response?.data?.message || error.message));
            setPendingDeleteStudent(null);
        }
    }

    function cancelDelete() {
        setPendingDeleteStudent(null);
    }

    return (
        <div className="delete-student-container">
            <h1>Delete Student</h1>
            <input 
                type="text" 
                value={rollNumberToDelete} 
                onChange={(e) => setRollNumberToDelete(e.target.value)} 
                placeholder="Enter Roll Number to Delete" 
            />
            <button onClick={handleDelete}>Delete Student</button>
            {message && <p style={{ color: 'green', fontSize: '23px', fontWeight: 'bold' }}>{message}</p>}

            {pendingDeleteStudent && (
                <div className="confirmation" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                    <p style={{ marginRight: '10px', fontSize: '23px', fontWeight: 'bold' }}>Do you want to delete {pendingDeleteStudent.name}?</p>
                    <button onClick={confirmDelete} style={{ padding: '5px 15px', fontSize: '16px' }}>Yes</button>
                    <button onClick={cancelDelete} style={{ padding: '5px 15px', fontSize: '16px' }}>No</button>
                </div>
            )}

            <h2>Student List</h2>
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
        {students.map(student => (
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
    );
}

export default DeleteStudent;
