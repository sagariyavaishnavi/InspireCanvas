const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be 8-16 characters and include one uppercase letter, one lowercase letter, one digit, and one special character.' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'buyer'
        });

        res.status(201).json({
            message: 'User registered successfully. Please login to continue.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get Current User
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            brandLogo: user.brandLogo,
            bio: user.bio
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, bio, avatar, brandLogo } = req.body;
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        
        // Handle removals
        if (avatar === '') user.avatar = '';
        if (brandLogo === '') user.brandLogo = '';

        if (req.files) {
            if (req.files.avatar) user.avatar = req.files.avatar[0].path;
            if (req.files.brandLogo) user.brandLogo = req.files.brandLogo[0].path;
        }

        await user.save();

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            brandLogo: user.brandLogo,
            bio: user.bio
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
