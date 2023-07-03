const { Storage } = require('@google-cloud/storage');
const path = require('path');
const multer =require('multer');
const fs = require('fs');
const { log } = require('console');
const dir = './uploads';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
const expirationDate = new Date();
expirationDate.setFullYear(expirationDate.getFullYear() + 10); // Set expiration to 10 years from now

class MulterError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

let projectId = "eduzone-391614"; // Get this from Google Cloud
let keyFilename = path.join("../../server/eduzone-391614-19b720aa0fa5.json"); // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("eduzone");

// Function to get the public URL of a file in Google Cloud Storage
async function getPublicUrl(filePath) {
  const file = bucket.file(filePath);

  try {
    const signedUrls = await file.getSignedUrl({
      action: 'read',
      // expires: Date.now() + 60 * 60 * 1000, // 1 hour from now
      expires: expirationDate
    });

    const url = signedUrls[0];
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL for the file.');
  }
}

// Middleware for handling file uploads and storing them in Google Cloud Storage
function uploadToGCS(req, res, next) {
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      // Check the file type and reject if it's not an image
      if (!file.mimetype.startsWith('image/')) {
        const error = new MulterError('Only image files are allowed!', 'INVALID_FILE_TYPE');
        return cb(error);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
    },
  }).single('image');

  upload(req, res, async (err) => {
    if (err instanceof MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const file = req.file;
    const gcsFileName = file.fieldname + '-' + Date.now() + '-' + file.originalname;
    const gcsFilePath = 'images/'; // Specify the desired file path within the bucket

    const gcsFile = bucket.file(gcsFilePath + gcsFileName);

    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      console.error('Error uploading to Google Cloud Storage:', err);
      return res.status(500).json({ error: 'Failed to upload file to Google Cloud Storage.' });
    });

    stream.on('finish', async () => {
      const imageUrl = await getPublicUrl(gcsFilePath + gcsFileName);
      console.log('File uploaded to Google Cloud Storage:', imageUrl);
      req.file.imageUrl = imageUrl;
      next();
    });

    stream.end(file.buffer);
  });
}

module.exports = uploadToGCS;
