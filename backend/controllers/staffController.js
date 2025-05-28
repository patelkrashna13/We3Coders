const Staff = require('../models/Staff');

// @desc    Add new staff member
// @route   POST /api/staff
// @access  Public
const addStaff = async (req, res) => {
  try {
    const { name, age, gender, role, department, qualification, experience, mobileNo, email, schedule, employmentStatus } = req.body;

    // Basic validation (you can add more comprehensive validation)
    if (!name) {
      return res.status(400).json({ message: 'Please include a name' });
    }

    const staff = await Staff.create({
      name,
      age,
      gender,
      role,
      department,
      qualification,
      experience,
      mobileNo,
      email,
      schedule,
      employmentStatus,
    });

    res.status(201).json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// You can add other controller functions here for fetching, updating, deleting staff, etc.

module.exports = { addStaff }; 