const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Replace with your email and password
const GMAIL_USER = 'youremail@gmail.com';
const GMAIL_PASS = 'yourpassword';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
});

app.post('/signup', (req, res) => {
    const { name, email } = req.body;
    const mailOptions = {
        from: GMAIL_USER,
        to: email,
        subject: 'Signup Confirmation',
        text: `Hello ${name},

Thank you for signing up!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Signup successful, confirmation email sent!');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});