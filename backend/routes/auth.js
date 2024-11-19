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
        
        res.redirect('/meeting-success');
    } catch (error) {
        console.error('Auth Error:', error);
        res.redirect('/meeting-error');
    }
});

module.exports = router; 