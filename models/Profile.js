const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Profile', profileSchema);