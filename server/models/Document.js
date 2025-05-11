const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,  // Ensures filename is always provided
  },
  summary: {
    type: String,
    required: true,  // Ensures summary is always provided
  },
  upload_date: {
    type: Date,
    default: Date.now,  // Sets the upload date to the current date and time
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
