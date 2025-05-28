const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: String,
  age: Number,
  gender: {
    type: String,
    enum: ['M', 'F', 'Prefer not to say'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  typeOfDisease: {
    type: String,
    enum: ['ENT', 'OPD', 'Orthopaedic', 'Optics', 'Dental', 'Skin', 'Reproductive'],
  },
  timings: String,
  mobileNo: String,
  doctorName: String,
  date: String,
  time: String,
  reason: String,
});

module.exports = mongoose.model('Appointment', appointmentSchema); 