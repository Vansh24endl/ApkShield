const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() === '.apk') {
    cb(null, true);
  } else {
    cb(new Error('Only APK files are allowed!'), false);
  }
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });
