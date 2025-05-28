const express = require('express');
const router = express.Router();
const { addStaff } = require('../controllers/staffController');

router.post('/', addStaff);

// You can add other routes here for fetching, updating, deleting staff, etc.

module.exports = router; 