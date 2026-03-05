const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Artwork must have a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Artwork must have a description']
    },
    price: {
        type: Number,
        required: [true, 'Artwork must have a price']
    },
    category: {
        type: String,
        required: [true, 'Artwork must belong to a category'],
        enum: ['Paintings', 'Photography', '3D Art', 'Illustrations', 'Digital Art', 'Abstract', 'Other']
    },
    image: {
        type: String,
        required: [true, 'Artwork must have an image']
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Artwork must belong to an artist']
    },
    tags: [String],
    status: {
        type: String,
        enum: ['active', 'sold', 'hidden', 'draft'],
        default: 'active'
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Artwork', artworkSchema);
