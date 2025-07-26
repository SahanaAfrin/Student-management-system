
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL as needed

// Function to handle POST requests for sign-up and student submissions
export const PostCall = async (data) => {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
};

export const GetAllStudentsCall = async () => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
};


// Function to handle login requests
export const LoginCall = async (data) => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
};

export const DeleteCall = async (nic) => {
    const response = await axios.delete(`${API_URL}/students/${nic}`);
    return response.data;
};

export const GetCall = async (nic) => {
    const response = await axios.get(`${API_URL}/students/${nic}`);
    return response.data;
};

export const PatchCall = async (nic, studentData) => {
    const response = await axios.patch(`${API_URL}/students/${nic}`, studentData);
    return response.data;
};

// Function to handle student submissions
export const SubmitStudentCall = async (studentData) => {
    const response = await axios.post(`${API_URL}/students`, studentData);
    return response.data;
};


// Function to retrieve student details
export const GetStudentCall = async (nic) => {
    const response = await axios.get(`${API_URL}/students/${nic}`);
    return response.data;
};
