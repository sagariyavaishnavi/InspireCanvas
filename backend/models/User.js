const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['artist', 'buyer'],
        default: 'buyer'
    },
    avatar: {
        type: String,
        default: ''
    },
    brandLogo: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: 500
    },
    resetPasswordOTP: {
        type: String,
        default: undefined
    },
    resetPasswordOTPExpires: {
        type: Date,
        default: undefined
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationOTP: {
        type: String,
        default: undefined
    },
    verificationOTPExpires: {
        type: Date,
        default: undefined
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
