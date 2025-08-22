import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ onFileSelect, maxFiles = 5, acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf'] }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return acceptedTypes.includes(extension);
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please use supported file types.');
    }

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      status: 'ready',
      content: null
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Process files
    newFiles.forEach(fileObj => processFile(fileObj));
  };

  const processFile = async (fileObj) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileObj.id ? { ...f, status: 'processing' } : f)
    );

    try {
      const content = await readFileContent(fileObj.file);
      
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileObj.id ? { ...f, status: 'completed', content } : f)
      );

      // Notify parent component
      onFileSelect(fileObj.id, {
        ...fileObj,
        content,
        status: 'completed'
      });

    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileObj.id ? { ...f, status: 'error', error: error.message } : f)
      );
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    onFileSelect(fileId, null); // Notify removal
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Requirements Documents
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supported formats: {acceptedTypes.join(', ')} (Max {maxFiles} files)
        </p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary"
        >
          Choose Files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(file.status)}
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                    {file.status === 'processing' && ' - Processing...'}
                    {file.status === 'error' && ` - Error: ${file.error}`}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;