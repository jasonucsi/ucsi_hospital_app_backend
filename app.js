require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'outlook', // or your email provider
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASSWORD, // Your email password
    },
});

app.post('/send-email', (req, res) => {
    const { name, contactNo, pickupAddress, ambulanceType, additionalServices } = req.body;

    // Construct the email content
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'jasonerniody36@gmail.com', // Replace with the recipient's email
        subject: 'Ambulance Booking Request',
        text: `
            Name: ${name}
            Contact No: ${contactNo}
            Pickup Address: ${pickupAddress}
            Ambulance Type: ${ambulanceType}
            Additional Services: ${additionalServices}
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});