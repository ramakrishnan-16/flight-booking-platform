import multer from "multer";
import path from "path";
import fs from "fs";

// ======================================================
// UPLOAD DIRECTORY
// ======================================================

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "flight-documents"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ======================================================
// STORAGE
// ======================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      extension;

    cb(null, filename);
  },
});

// ======================================================
// FILE FILTER
// ======================================================

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".csv",
  ".xls",
  ".xlsx",
  ".json",
  ".txt",
];

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error(
        `Unsupported file format: ${extension}`
      ),
      false
    );
  }

  cb(null, true);
};

// ======================================================
// MULTER
// ======================================================

const uploadFlightDocument = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default uploadFlightDocument;