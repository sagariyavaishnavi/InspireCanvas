const Artwork = require('../models/Artwork');

// Create Artwork
exports.createArtwork = async (req, res, next) => {
    try {
        const { title, description, price, category, tags, status } = req.body;
        const image = req.file ? req.file.path : null;

        if (!image) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const artwork = await Artwork.create({
            title,
            description,
            price,
            category,
            image,
            artist: req.user._id,
            tags: tags ? JSON.parse(tags) : [],
            status: status || 'active'
        });

        res.status(201).json(artwork);
    } catch (error) {
        let terminalError = error.message;
        if (terminalError.includes('api_key') || terminalError.includes('cloud_name')) {
            terminalError = 'Cloudinary Configuration Error (Sensitive details hidden)';
        }
        console.error('Create Artwork Error:', terminalError);

        // Pass the original error to the global handler in server.js 
        // which now handles safe, descriptive categorization 
        next(error);
    }
};

// Get All Artworks (with filters)
exports.getArtworks = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice, artist, search, status } = req.query;
        let query = {};

        // If searching/filtering for specific artist, or if status is provided, use it.
        // Otherwise default to only active (for general gallery)
        if (status) {
            query.status = status;
        } else if (artist) {
            // If artist is requesting their own works via the dashboard, 
            // the frontend should be able to see everything.
            // We don't filter to 'active' by default if an artist ID is present.
        } else {
            query.status = 'active';
        }

        if (category && category !== 'All') query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (artist) query.artist = artist;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const artworks = await Artwork.find(query).populate('artist', 'name email avatar');
        res.status(200).json(artworks);
    } catch (error) {
        next(error);
    }
};

// Get Single Artwork
exports.getArtworkById = async (req, res, next) => {
    try {
        const artwork = await Artwork.findById(req.params.id).populate('artist', 'name bio avatar');
        if (!artwork) {
            return res.status(404).json({ message: 'Artwork not found' });
        }

        // Increment views
        artwork.views += 1;
        await artwork.save();

        res.status(200).json(artwork);
    } catch (error) {
        next(error);
    }
};

// Update Artwork
exports.updateArtwork = async (req, res, next) => {
    try {
        let artwork = await Artwork.findById(req.params.id);
        if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

        // Ensure user is artwork owner
        if (artwork.artist.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this artwork' });
        }

        artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(artwork);
    } catch (error) {
        next(error);
    }
};

// Delete Artwork
exports.deleteArtwork = async (req, res, next) => {
    try {
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

        if (artwork.artist.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this artwork' });
        }

        await artwork.deleteOne();
        res.status(200).json({ message: 'Artwork removed' });
    } catch (error) {
        next(error);
    }
};
