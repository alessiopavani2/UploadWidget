require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../backend/uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      message: 'File uploaded successfully', 
      fileName: req.file.filename,
      filePath: path.join(uploadDir, req.file.filename)
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed', details: error.message });
  }
});


// Get uploaded files endpoint
app.get('/api/files', (req, res) => {
  fs.readdir(path.join(__dirname, '../backend/uploads/'), (err, files) => {
    if (err) return res.status(500).json({ error: 'Error retrieving files' });
    res.json({ files });
  });
});

// Start server
app.listen(PORT, () => console.log(`✅ Server listening on http://localhost:${PORT}`));
