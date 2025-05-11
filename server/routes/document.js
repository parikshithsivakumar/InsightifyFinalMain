const Document = require('../models/Document'); // Make sure to import the model
const express = require('express');
const multer = require('multer');
const { processDocument } = require('../controllers/documentController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), processDocument);

// Route for fetching all documents
router.get('/all', async (req, res) => {
  try {
    const documents = await Document.find();  // Fetch all documents from the database
    res.json({ documents });  // Send back documents in the response
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});



module.exports = router;
