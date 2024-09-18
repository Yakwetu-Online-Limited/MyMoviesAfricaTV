require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const shortcode = process.env.SHORTCODE;

// Generate OAuth Token
app.get('/mpesa/token', async (req, res) => {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

// Initiate Payment (STK Push)
app.post('/mpesa/stkpush', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }
    const token = authHeader.split(' ')[1];
    const phoneNumber = req.body.phone;
    const amount = req.body.amount;
    
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const passkey = process.env.MPESA_PASSKEY;
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const payload = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: 'http://192.168.100.86:3000/mpesa/callback',
        AccountReference: 'MyMoviesAfrica',
        TransactionDesc: 'Payment for movies'
    };

    try {
        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
