const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Expense = require('../models/expense'); // Import the model

const upload = multer({ dest: './uploads/' });  // Optional: move this to your route file

// Route to handle the file upload and PDF extraction
exports.uploadExpenseDocument = (req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '../uploads', uploadedFile.filename);
  const absolutePath = path.resolve(filePath); // Ensure it's absolute for Windows compatibility

  exec(`python ./extract_pdf.py "${absolutePath}"`, async (err, stdout, stderr) => {
    if (err) {
      console.error('Error executing Python script:', err);
      return res.status(500).json({ error: 'Error processing PDF' });
    }

    if (stderr) {
      console.error('Python script stderr:', stderr);
      return res.status(500).json({ error: 'Error in PDF extraction' });
    }

    let extractedData;
    try {
      extractedData = JSON.parse(stdout);
    } catch (parseError) {
      console.error('Error parsing Python script output:', parseError);
      return res.status(500).json({ error: 'Failed to parse extracted data' });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Create and save the new expense
    const newExpense = new Expense({
      name: extractedData.name || 'Unknown',
      amount: parseFloat(extractedData.amount) || 0,
      date: extractedData.date || new Date().toISOString().slice(0, 10),
      category: extractedData.category || 'Miscellaneous',
    });

    try {
      await newExpense.save();
      res.status(200).json({
        message: 'Expense extracted and saved successfully',
        data: extractedData,
      });
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      res.status(500).json({ error: 'Failed to save extracted expense to database' });
    }
  });
};
