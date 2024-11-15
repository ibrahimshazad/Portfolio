const { google } = require('googleapis');
require('dotenv').config();

// Add debugging logs
console.log('Environment check:');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...');  // Show first 10 chars for verification
console.log('Client Secret exists:', !!process.env.GOOGLE_CLIENT_SECRET);

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:5000/auth/google/callback'
);

const getAuthUrl = () => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/calendar.readonly',
            'profile',
            'email'
        ],
        prompt: 'consent select_account',
        include_granted_scopes: true
    });
    
    console.log('Generated auth URL:', url);  // Log the generated URL
    return url;
};

const getTokens = async (code) => {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        return tokens;
    } catch (error) {
        console.error('Error getting tokens:', error);
        throw error;
    }
};

module.exports = {
    oauth2Client,
    getAuthUrl,
    getTokens
}; 