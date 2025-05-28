const LabTest = require('../models/LabTest'); // Adjust path as needed

// @desc    Create new lab test record
// @route   POST /api/labrecords
// @access  Public (You might want to change this based on authentication)
const createLabTest = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      testType,
      testName,
      orderDate,
      sampleCollectionDate,
      status,
      resultDate,
      resultSummary,
      diagnosticEquipmentId,
      remarks,
    } = req.body;

    // Create a new LabTest document
    const labTest = new LabTest({
      patientId,
      doctorId,
      testType,
      testName,
      orderDate,
      sampleCollectionDate,
      status,
      resultDate,
      resultSummary,
      diagnosticEquipmentId,
      remarks,
    });

    // Save the document to the database
    const savedLabTest = await labTest.save();

    // Send a success response
    res.status(201).json(savedLabTest);

  } catch (error) {
    console.error('Error saving lab test record:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// You can add other controller functions here later (e.g., getAllLabTests, getLabTestById, updateLabTest, deleteLabTest)

module.exports = {
  createLabTest,
  // Export other functions here
}; 