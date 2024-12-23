const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
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