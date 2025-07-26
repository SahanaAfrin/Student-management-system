
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Create a new student
router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { nic, name, phone, address } = req.body;
    const existingStudent = await Student.findOne({ nic });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this NIC already exists' });
    }
    const student = new Student({ nic, name, phone, address });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
});

// Get student by NIC
router.get('/:nic', async (req, res) => {
  try {
    const student = await Student.findOne({ nic: req.params.nic });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update student by NIC
router.patch('/:nic', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { nic: req.params.nic },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete student by NIC
router.delete('/:nic', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ nic: req.params.nic });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
