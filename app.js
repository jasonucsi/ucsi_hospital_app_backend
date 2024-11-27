require('dotenv').config();
const cors = require('cors')
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const corsOptions = {
    origin: '*',  // Allow all origins (for testing) or specify allowed origins like 'http://localhost:3000'
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
  };
  
app.use(cors(corsOptions)); // Add this line for CORS
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));  // Handle URL-encoded bodies (if you're sending x-www-form-urlencoded)


const transporter = nodemailer.createTransport({
    service: 'outlook', // or your email provider
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASSWORD, // Your email password
    },
});

app.post('/send-email', (req, res) => {
    const { name, contactNo, email, pickupAddress, ambulanceType, additionalServices } = req.body;
    console.log(req.body)
    console.log('Name:', name);
    console.log('Contact No:', contactNo);
    console.log('Email:', email);
    console.log('Pickup Address:', pickupAddress);
    console.log('Ambulance Type:', ambulanceType);
    console.log('Additional Services:', additionalServices);
    // Construct the email content
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'info@ucsihospital.com', // Replace with the recipient's email
        cc: '' || '', // Add CC here as a string or array of email addresses
        subject: 'Ambulance Booking Request',
        text:` 
            Name: ${name}
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

module.exports = app;


// ===== for postman =====
// require('dotenv').config();
// const express = require('express');
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');  // bodyParser is optional in Express 4.16+ but it's fine to use it

// const app = express();

// // Middleware to parse URL-encoded data (x-www-form-urlencoded)
// app.use(bodyParser.urlencoded({ extended: true }));  // This will parse the body sent as x-www-form-urlencoded

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//     service: 'outlook', // or your email provider
//     auth: {
//         user: process.env.EMAIL, // Your email
//         pass: process.env.PASSWORD, // Your email password
//     },
// });

// app.post('/send-email', (req, res) => {
//     console.log('Request Body:', req.body);  // Log the request body to verify it
    
//     // Match the exact keys (or use case-insensitive destructuring)
//     const { 
//         Name: name, 
//         contactNo, 
//         email, 
//         pickupAddress, 
//         ambulanceType, 
//         additionalServices 
//     } = req.body;

//     // Check for missing fields
//     if (!name || !contactNo || !email || !pickupAddress || !ambulanceType) {
//         return res.status(400).send('Missing required fields');
//     }

//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: 'jasonerniody36@gmail.com', // Replace with the recipient's email
//         subject: 'Ambulance Booking Request',
//         text: `
//             Name: ${name}
//             Contact No: ${contactNo}
//             Email: ${email}
//             Pickup Address: ${pickupAddress}
//             Ambulance Type: ${ambulanceType}
//             Additional Services: ${additionalServices}
//         `,
//     };

//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);  // Log the error
//             return res.status(500).json({ error: error.toString() }); // Return a detailed error in JSON format
//         }
//         res.status(200).send('Email sent: ' + info.response);
//     });
// });

// // Start the server
// app.listen(process.env.PORT || 3000, () => {
//     console.log('Server is running on port 3000');
// });

