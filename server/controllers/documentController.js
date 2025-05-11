const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const Document = require('../models/Document'); // Adjust the path as necessary

exports.processDocument = async (req, res) => {
  try {
    const file = req.file;
    const filePath = path.join(__dirname, '..', 'uploads', file.filename); // Ensure the file is saved correctly

    // Spawn Python process to run the summarizer script
    const python = spawn('python', ['summarizer.py', filePath]);

    let summary = '';
    
    // Collect output from Python script
    python.stdout.on('data', (data) => {
      summary += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    python.on('close', async (code) => {
      if (code !== 0) return res.status(500).json({ error: 'Failed to summarize the document' });

      // Save the document with the filename, summary, and upload date
      const newDoc = new Document({
        filename: file.originalname,  // Store the original filename
        summary: summary.trim(),  // Store the summary content
        upload_date: new Date(),  // Current date for upload time
      });

      try {
        await newDoc.save(); // Save the document to the DB
        res.json({ message: 'Document uploaded and summarized successfully!', document: newDoc });
      } catch (dbErr) {
        console.error('Error saving document to DB:', dbErr);
        res.status(500).json({ error: 'Error saving document to the database' });
      }
    });

  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).json({ error: 'Error processing file' });
  }
};
