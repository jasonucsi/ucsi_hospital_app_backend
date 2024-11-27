require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');  // bodyParser is optional in Express 4.16+ but it's fine to use it

const app = express();

// Middleware to parse URL-encoded data (x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));  // This will parse the body sent as x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));  // You can also use the built-in Express method

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'outlook', // or your email provider
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASSWORD, // Your email password
    },
});

app.post('/send-email', (req, res) => {
    console.log('Request Body:', req.body);  // Log the request body to verify it
    const { Name, contactNo, email, pickupAddress, ambulanceType, additionalServices } = req.body;

    // Check for missing fields
    if (!Name || !contactNo || !email || !pickupAddress || !ambulanceType) {
        return res.status(400).send('Missing required fields');
    }

    // Construct the email content
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'jasonerniody36@gmail.com', // Replace with the recipient's email
        subject: 'Ambulance Booking Request',
        text: `
            Name: ${Name}
            Contact No: ${contactNo}
            Email: ${email}
            Pickup Address: ${pickupAddress}
            Ambulance Type: ${ambulanceType}
            Additional Services: ${additionalServices}
        `,
        headers: {
            'X-Priority': '1', // High priority
            'Importance': 'high', // Mark as important
        },
    };

    // Send the email
    transporter.sendMail(mailOptions || req.body, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);  // Log the error
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
