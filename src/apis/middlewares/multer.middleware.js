import multer from "multer";

// Create a storage engine that stores files in memory
const storage = multer.memoryStorage();

// Define an array of allowed image mime types
const allowedImageMimeTypes = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Define the maximum file size (in bytes)
const maxFileSize = 10 * 1024 * 1024; // 10 MB

// Define the maximum number of files allowed in a single upload
const maxFiles = 1;

// Function to filter and validate uploaded files
const fileFilter = (req, file, cb) => {
  try {
    if (!allowedImageMimeTypes.includes(file.mimetype)) {
      throw new Error("Invalid file type");
    }

    if (file.size > maxFileSize) {
      throw new Error("File size exceeds the limit");
    }

    cb(null, true);
  } catch (err) {
    cb(err, false);
  }
};

// Initialize Multer with the defined options
const uploadFileMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: maxFiles,
  },
});

export default uploadFileMiddleware;
