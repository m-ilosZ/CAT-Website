const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const GMAIL_USER = 'youremail@gmail.com';
const GMAIL_PASS = 'yourapppassword';
const ADMIN_EMAIL = 'ekelty4708@student.pps.net';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
});

app.post('/signup', async (req, res) => {
    const { name, email } = req.body;
    try {
        const userMailOptions = {
            from: GMAIL_USER,
            to: email,
            subject: 'Welcome to CAT Community Night!',
            text: `Hello ${name},\n\nThank you for signing up for our Community Night event on March 18th, 2026!\n\nWe're excited to have you join us for an evening of engaging presentations, networking, and great food.\n\nSee you there!\n\nBest regards,\nClimate Action Team`,
        };

        const adminMailOptions = {
            from: GMAIL_USER,
            to: ADMIN_EMAIL,
            subject: 'New Community Night Sign-Up',
            text: `New signup received!\n\nName: ${name}\nEmail: ${email}\n\nTimestamp: ${new Date().toLocaleString()}`,
        };

        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(200).json({ message: 'Signup successful! Confirmation email sent.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error processing signup. Please try again.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
