const multer = require('multer');

const storage = multer.memoryStorage(); // store image in memory buffer

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB per image
});

module.exports = upload;
