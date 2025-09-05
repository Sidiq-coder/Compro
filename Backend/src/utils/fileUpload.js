// fileUpload.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Create directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/attendance-proofs/',
    'uploads/product-images/',
    'uploads/article-attachments/',
    'uploads/event-images/'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize directories
createUploadDirs();

// Dynamic storage based on file type/route
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = 'uploads/';
    
    // Determine upload directory based on route
    if (req.route && req.route.path) {
      if (req.route.path.includes('/products')) {
        uploadDir += 'product-images/';
      } else if (req.route.path.includes('/articles')) {
        uploadDir += 'article-attachments/';
      } else if (req.route.path.includes('/events')) {
        uploadDir += 'event-images/';
      } else if (req.route.path.includes('/attendances')) {
        uploadDir += 'attendance-proofs/';
      } else {
        uploadDir += 'misc/';
      }
    } else {
      uploadDir += 'attendance-proofs/';
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  let allowedTypes = [];
  
  // Determine allowed types based on route
  if (req.route && req.route.path) {
    if (req.route.path.includes('/products') || req.route.path.includes('/events')) {
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    } else if (req.route.path.includes('/articles')) {
      allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    } else if (req.route.path.includes('/attendances')) {
      allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    } else {
      allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    }
  } else {
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  }
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Maximum 5 files per request
  }
});

export const uploadFiles = async (files) => {
  return files.map(file => `/${file.filename}`);
};