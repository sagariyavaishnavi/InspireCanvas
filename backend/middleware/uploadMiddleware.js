const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Use artist name for folder, or default if not available
        const folderName = req.user && req.user.name
            ? `inspirecanvas/${req.user.name.replace(/\s+/g, '_').toLowerCase()}`
            : 'inspirecanvas/general';

        return {
            folder: folderName,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
        };
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
