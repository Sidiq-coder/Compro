import React, { useState, useRef } from 'react';
import { Button } from './Button';

/**
 * FileUpload - Reusable component untuk upload file dengan preview
 * Mendukung image dan video dengan drag & drop functionality
 */
const FileUpload = ({
  label = "Upload Files",
  accept = "image/*,video/*",
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  value = [],
  onChange,
  error,
  helperText,
  className = ""
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    let hasError = false;

    // Validation
    if (value.length + fileArray.length > maxFiles) {
      setUploadError(`Maksimal ${maxFiles} file yang dapat diupload`);
      return;
    }

    fileArray.forEach(file => {
      if (file.size > maxSize) {
        setUploadError(`File ${file.name} terlalu besar. Maksimal ${maxSize / (1024 * 1024)}MB`);
        hasError = true;
        return;
      }

      // Create file object with preview
      const fileObj = {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      };
      validFiles.push(fileObj);
    });

    if (!hasError && validFiles.length > 0) {
      setUploadError('');
      onChange([...value, ...validFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    handleFileSelect(files);
  };

  const removeFile = (id) => {
    const updatedFiles = value.filter(file => file.id !== id);
    onChange(updatedFiles);
    
    // Revoke object URL to prevent memory leaks
    const fileToRemove = value.find(file => file.id === id);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.startsWith('video/')) {
      return (
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : error || uploadError
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
              Klik untuk upload
            </span> atau drag & drop
          </div>
          <p className="text-xs text-gray-500">
            {accept.includes('image') && accept.includes('video') ? 'Gambar atau Video' : 
             accept.includes('image') ? 'Gambar' : 'File'} 
            {` hingga ${maxSize / (1024 * 1024)}MB (maksimal ${maxFiles} file)`}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {(error || uploadError) && (
        <p className="text-sm text-red-600">{error || uploadError}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && !uploadError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* File Preview List */}
      {value.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">File yang diupload:</h4>
          <div className="grid grid-cols-1 gap-3">
            {value.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {fileObj.preview ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    getFileIcon(fileObj.type)
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileObj.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(fileObj.size)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(fileObj.id)}
                  className="flex-shrink-0 p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
