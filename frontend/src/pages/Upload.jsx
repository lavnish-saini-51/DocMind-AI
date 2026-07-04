import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Image as ImageIcon, FileUser, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadDocument } from '../services/uploadService';

const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const getFileIcon = (type) => {
  if (type === 'application/pdf') return FileText;
  if (type?.startsWith('image/')) return ImageIcon;
  return FileUser;
};

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const validateAndSetFile = (file) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file type. Please upload a PDF, image, or resume.');
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      toast.error('File size must be under 150MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      await uploadDocument(selectedFile, setProgress);
      toast.success('Document uploaded successfully!');
      navigate('/chat');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const Icon = selectedFile ? getFileIcon(selectedFile.type) : UploadCloud;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 text-center">
          Upload your document
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
          PDF, Image, or Resume — max 150MB
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !selectedFile && inputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer
            ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                setProgress(0);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-300" />
            </button>
          )}

          <div className="w-14 h-14 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
            <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>

          {selectedFile ? (
            <>
              <p className="font-medium text-gray-900 dark:text-white truncate max-w-full">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-gray-900 dark:text-white">
                Drag & drop your file here
              </p>
              <p className="text-sm text-gray-400 mt-1">or click to browse</p>
            </>
          )}
        </div>

        {uploading && (
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition"
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload & Start Chat'}
        </button>
      </div>
    </div>
  );
};

export default Upload;