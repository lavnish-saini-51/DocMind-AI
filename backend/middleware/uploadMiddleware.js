const multer = require('multer');

// Store files in memory only — never write to disk (privacy-first requirement)
const storage = multer.memoryStorage();

// Allowed MIME types for PDF, Image, and Resume (doc/docx treated as resume format)
const allowedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload a PDF, image, or resume (doc/docx).'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB max,
});

module.exports = upload;