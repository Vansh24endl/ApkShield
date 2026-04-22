const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const { uploadApk, getJobStatus, getAllJobs, downloadApk } = require('../controllers/apkController');

router.post('/upload', auth, upload.single('apk'), uploadApk);
router.get('/status/:id', auth, getJobStatus);
router.get('/jobs', auth, getAllJobs);
router.get('/download/:id', auth, downloadApk);

module.exports = router;
