const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/upload', upload.single('imageFile'), fileController.uploadFile);

module.exports = router;
