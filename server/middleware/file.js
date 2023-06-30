const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dir = "./uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpg",
//   "image/jpg": "jpg",
// };

// const storage = multer.diskStorage({

//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type");
//     if (isValid) {
//       error = null;
//     }
//     // cb(null, "images");
//     cb(null, path.join("server/images"));
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(" ").join("-");
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + "-" + Date.now() + "." + ext);
//   },
// });
// Create custom error class
class MulterError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder for file uploads
    cb(null, path.join(dir));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Create Multer instance with custom error handling
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check the file type and reject if it's not an image
    if (!file.mimetype.startsWith("image/")) {
      const error = new MulterError(
        "Only image files are allowed!",
        "INVALID_FILE_TYPE"
      );
      return cb(error);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
});
module.exports = upload.single("image");
// module.exports = multer({ storage: storage }).single("image");
