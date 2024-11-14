import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';


// Ensure the upload directory exists
const ensureUploadDirExists = () => {
  const uploadDir = 'uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Max 5MB size
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const saveAsWebP = (fileBuffer) => {
  ensureUploadDirExists();

  const filePath = path.join('uploads', `${uuidv4()}.webp`);

  return sharp(fileBuffer)
    .webp({ quality: 80 })
    .toFile(filePath)
    .then(() => filePath)
    .catch((error) => {
      throw new Error('Failed to convert image to WebP: ' + error.message);
    });
};

const uploadAndConvert = (req, res, next) => {
  upload.single('imageFile')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      // Convert the uploaded image to WebP format and save it
      const filePath = await saveAsWebP(req.file.buffer);
      // Attach the filePath to the req.body so it's passed to the controller
      req.body.imagePath = filePath; // Adding the image path to the body
      next(); // Proceed to the next middleware or controller
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

export default uploadAndConvert;