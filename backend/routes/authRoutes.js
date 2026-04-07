const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'brandLogo', maxCount: 1 }]), updateProfile);

module.exports = router;
