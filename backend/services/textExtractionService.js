const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

// Extracts raw text from a PDF buffer
const extractFromPDF = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

// Extracts raw text from a DOC/DOCX buffer (resume)
const extractFromDocx = async (buffer) => {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
};

// Extracts text from an image using OCR
const extractFromImage = async (buffer) => {
  const { data } = await Tesseract.recognize(buffer, 'eng');
  return data.text;
};

// Routes extraction based on file category and mimetype
const extractText = async (fileBuffer, fileType, mimetype) => {
  if (fileType === 'pdf') {
    return extractFromPDF(fileBuffer);
  }

  if (fileType === 'resume') {
    // .doc (legacy) is not supported by mammoth — only .docx
    if (mimetype === 'application/msword') {
      throw new Error('Legacy .doc files are not supported. Please upload .docx or PDF.');
    }
    return extractFromDocx(fileBuffer);
  }

  if (fileType === 'image') {
    return extractFromImage(fileBuffer);
  }

  throw new Error('Unsupported file type for text extraction');
};

module.exports = { extractText };