// Determines our internal file category (pdf/image/resume) from the uploaded MIME type
const getFileCategory = (mimetype) => {
  if (mimetype === 'application/pdf') return 'pdf';

  if (['image/jpeg', 'image/png', 'image/webp'].includes(mimetype)) return 'image';

  if (
    [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(mimetype)
  ) {
    return 'resume';
  }

  return null;
};

module.exports = { getFileCategory };