const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer and SMTP.
 * Falls back to logging to console if SMTP settings are missing.
 * 
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Subject line
 * @param {string} options.message - Text message body
 * @param {string} [options.html] - Optional HTML message body
 */
const sendEmail = async (options) => {
    const { email, subject, message, html } = options;

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || 'InspireCanvas <noreply@inspirecanvas.com>';

    if (!host || !user || !pass) {
        console.log('\n===== [SMTP FALLBACK] =====');
        console.log(`To: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${message}`);
        if (html) {
            console.log(`HTML: ${html}`);
        }
        console.log('===========================\n');
        console.log('To send actual emails, please configure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in backend/.env');
        return;
    }

    const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465, // true for 465, false for others
        auth: {
            user,
            pass
        }
    });

    const mailOptions = {
        from,
        to: email,
        subject,
        text: message,
        html: html || message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${email} with subject: "${subject}"`);
    } catch (err) {
        console.error(`Failed to send email to ${email}:`, err.message);
    }
};

module.exports = sendEmail;
