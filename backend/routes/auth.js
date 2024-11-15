const express = require('express');
const router = express.Router();
const { getAuthUrl, getTokens } = require('../config/googleAuth');

router.get('/google', (req, res) => {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
});

router.get('/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const tokens = await getTokens(code);
        
        // Store these tokens securely
        // You might want to save them in your database or environment variables
        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token);
        
        res.redirect('/meeting-success');
    } catch (error) {
        console.error('Auth Error:', error);
        res.redirect('/meeting-error');
    }
});

module.exports = router; 