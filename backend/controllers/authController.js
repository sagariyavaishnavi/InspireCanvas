const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

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

        // Generate 6-digit verification OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationOTPExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'buyer',
            isVerified: false,
            verificationOTP: otp,
            verificationOTPExpires
        });

        // Send verification email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify Your Email Address - InspireCanvas 🎨',
                message: `Hi ${user.name},\n\nThank you for signing up for InspireCanvas! Please use the following 6-digit verification code (OTP) to verify your account:\n\n${otp}\n\nThis code is valid for 24 hours. If you did not sign up for an account, please ignore this email.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #fff;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 40px; line-height: 1;">🎨</span>
                            <h2 style="color: #6366F1; margin: 10px 0 0; font-size: 24px; font-weight: 800; font-family: 'Outfit', sans-serif;">InspireCanvas</h2>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 24px;" />
                        <p style="font-size: 16px; color: #1f2937;">Hi <strong>${user.name}</strong>,</p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">Thank you for signing up for InspireCanvas! Before you can log in, please verify your email address by entering the 6-digit code below on the registration page:</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <span style="font-size: 32px; font-weight: 800; color: #6366F1; letter-spacing: 6px; background-color: #f3f4f6; padding: 16px 32px; border-radius: 12px; border: 1px solid #e5e7eb; display: inline-block; font-family: monospace;">${otp}</span>
                        </div>
                        <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin-bottom: 24px;">This verification code is valid for <strong>24 hours</strong>. If you did not sign up for this account, you can safely ignore this email.</p>
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-top: 24px; margin-bottom: 16px;" />
                        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error('Email verification sending error:', mailError.message);
        }

        res.status(201).json({
            message: 'Registration successful! A 6-digit verification code has been sent to your email address.',
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

        // Check if verified
        if (user.isVerified === false) {
            return res.status(401).json({ message: 'Please verify your email address before logging in.' });
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

// Forgot Password - Generate & Send OTP
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please provide an email address' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        // Generate 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP and expiration (10 minutes)
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send OTP email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Password Reset OTP - InspireCanvas 🔒',
                message: `Hi ${user.name},\n\nYou requested a password reset. Use the following 6-digit verification code (OTP) to reset your password:\n\n${otp}\n\nThis OTP is valid for 10 minutes. If you did not request this, please ignore this email.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #6366F1; text-align: center;">Reset Your Password 🔒</h2>
                        <p>Hi <strong>${user.name}</strong>,</p>
                        <p>You requested a password reset for your InspireCanvas account. Use the verification code below to proceed:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #6366F1; letter-spacing: 5px; background-color: #F3F4F6; padding: 12px 24px; border-radius: 8px; border: 1px solid #E5E7EB; display: inline-block;">${otp}</span>
                        </div>
                        <p style="color: #666; font-size: 14px;">This code is valid for <strong>10 minutes</strong>. If you did not make this request, please secure your account or disregard this email.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error('Forgot password email error:', mailError.message);
        }

        res.status(200).json({ message: 'OTP sent successfully to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password - Verify OTP and update password
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Please provide email, otp, and new password.' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify OTP and Expiration
        if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP code.' });
        }

        if (user.resetPasswordOTPExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP code has expired.' });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'Password must be 8-16 characters and include one uppercase letter, one lowercase letter, one digit, and one special character.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear OTP fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();

        // Send reset success email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Password Has Been Reset Successfully - InspireCanvas 🔒',
                message: `Hi ${user.name},\n\nYour InspireCanvas account password was successfully reset. You can now log in using your new password.\n\nIf you did not perform this change, please contact support immediately.\n\nBest regards,\nThe InspireCanvas Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #fff;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 40px; line-height: 1;">🔒</span>
                            <h2 style="color: #10B981; margin: 10px 0 0; font-size: 24px; font-weight: 800; font-family: 'Outfit', sans-serif;">InspireCanvas</h2>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 24px;" />
                        <h3 style="color: #10B981; font-size: 20px; text-align: center; margin-bottom: 20px;">Password Reset Successful</h3>
                        <p style="font-size: 16px; color: #1f2937;">Hi <strong>${user.name}</strong>,</p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">This is confirmation that your account password was successfully reset. You can now log in using your new password.</p>
                        <div style="text-align: center; margin: 36px 0;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background-color: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">Log In to Your Account</a>
                        </div>
                        <p style="color: #ef4444; font-size: 14px; line-height: 1.5; font-weight: 600;">If you did not perform this change, please contact support or secure your account immediately.</p>
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-top: 24px; margin-bottom: 16px;" />
                        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error('Password reset confirmation email error:', mailError.message);
        }

        res.status(200).json({ message: 'Password reset successfully. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify Email OTP
exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Please provide email and verification code (OTP).' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email address is already verified.' });
        }

        // Verify OTP and Expiration
        if (!user.verificationOTP || user.verificationOTP !== otp) {
            return res.status(400).json({ message: 'Invalid verification code.' });
        }

        if (user.verificationOTPExpires < Date.now()) {
            return res.status(400).json({ message: 'Verification code has expired.' });
        }

        // Activate user
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpires = undefined;
        await user.save();

        // Send Welcome Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to InspireCanvas! 🎉🎨',
                message: `Hi ${user.name},\n\nYour email has been verified! Welcome to InspireCanvas.\n\nBest regards,\nThe InspireCanvas Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #fff;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 40px; line-height: 1;">🎨</span>
                            <h2 style="color: #FF5A5F; margin: 10px 0 0; font-size: 24px; font-weight: 800; font-family: 'Outfit', sans-serif;">InspireCanvas</h2>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 24px;" />
                        <h3 style="color: #FF5A5F; font-size: 20px; text-align: center; margin-bottom: 20px;">Email Verified Successfully! 🎉</h3>
                        <p style="font-size: 16px; color: #1f2937;">Hi <strong>${user.name}</strong>,</p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">Welcome to InspireCanvas! Your account is now fully active. We are thrilled to have you join our global community of digital art creators and collectors.</p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">Start exploring galleries, curating your wishlist, and trading unique digital masterpieces today!</p>
                        <div style="text-align: center; margin: 36px 0;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="background-color: #FF5A5F; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(255, 90, 95, 0.2);">Log In to Your Account</a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">If you have any questions or need assistance, please feel free to reach out to our team at any time.</p>
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-top: 24px; margin-bottom: 16px;" />
                        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error('Welcome email sending error:', mailError.message);
        }

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resend Email Verification OTP
exports.resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please provide an email address.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email address is already verified.' });
        }

        // Generate 6-digit verification OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationOTP = otp;
        user.verificationOTPExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // Send verification email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify Your Email Address - InspireCanvas 🎨',
                message: `Hi ${user.name},\n\nThank you for signing up for InspireCanvas! Please use the following 6-digit verification code (OTP) to verify your account:\n\n${otp}\n\nThis code is valid for 24 hours. If you did not sign up for an account, please ignore this email.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #fff;">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <span style="font-size: 40px; line-height: 1;">🎨</span>
                            <h2 style="color: #6366F1; margin: 10px 0 0; font-size: 24px; font-weight: 800; font-family: 'Outfit', sans-serif;">InspireCanvas</h2>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 24px;" />
                        <p style="font-size: 16px; color: #1f2937;">Hi <strong>${user.name}</strong>,</p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">Please verify your email address by entering the 6-digit code below on the registration page:</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <span style="font-size: 32px; font-weight: 800; color: #6366F1; letter-spacing: 6px; background-color: #f3f4f6; padding: 16px 32px; border-radius: 12px; border: 1px solid #e5e7eb; display: inline-block; font-family: monospace;">${otp}</span>
                        </div>
                        <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin-bottom: 24px;">This verification code is valid for <strong>24 hours</strong>. If you did not sign up for this account, you can safely ignore this email.</p>
                        <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-top: 24px; margin-bottom: 16px;" />
                        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">© 2026 InspireCanvas Inc. All rights reserved.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error('Email verification sending error:', mailError.message);
        }

        res.status(200).json({ message: 'A new 6-digit verification code has been sent to your email address.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
