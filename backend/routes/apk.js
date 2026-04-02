const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadApk, getJobStatus, getAllJobs, downloadApk } = require('../controllers/apkController');

router.post('/upload', upload.single('apk'), uploadApk);
router.get('/status/:id', getJobStatus);
router.get('/jobs', getAllJobs);
router.get('/download/:id', downloadApk);

module.exports = router;
