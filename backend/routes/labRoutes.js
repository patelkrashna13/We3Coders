const express = require('express');
const router = express.Router();
const { createLabTest } = require('../controllers/labController'); // Adjust path as needed

// POST /api/labrecords
router.post('/', createLabTest);

// You can add other routes here later (e.g., GET '/', GET '/:id', PUT '/:id', DELETE '/:id')

module.exports = router; 