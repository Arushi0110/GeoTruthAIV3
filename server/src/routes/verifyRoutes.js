const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { verifyNews } = require('../controllers/verifyController');

router.post('/', upload.single('image_file'), verifyNews);

module.exports = router;
