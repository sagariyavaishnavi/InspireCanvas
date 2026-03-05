const express = require('express');
const router = express.Router();
const {
    createArtwork,
    getArtworks,
    getArtworkById,
    updateArtwork,
    deleteArtwork
} = require('../controllers/artworkController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getArtworks)
    .post(protect, authorize('artist'), upload.single('image'), createArtwork);

router.route('/:id')
    .get(getArtworkById)
    .put(protect, authorize('artist'), updateArtwork)
    .delete(protect, authorize('artist'), deleteArtwork);

module.exports = router;
