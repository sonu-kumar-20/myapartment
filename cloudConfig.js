const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,         // ✔ from your .env file
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',                 // ✔ Cloudinary folder name
    allowedFormats: ["png", "jpg", "jpeg"],   // ✔ Correct spelling!
  },
});

module.exports = {
  cloudinary,
  storage,
};
