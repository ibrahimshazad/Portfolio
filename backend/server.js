const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./db/init');
const { oauth2Client, getAuthUrl, getTokens } = require('./config/googleAuth');
const calendarService = require('./services/calendarService');

const app = express();

// Add logging middleware to debug CORS issues
app.use((req, res, next) => {
    next();
});

// Enhanced CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {


        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `CORS policy does not allow access from the specified origin: ${origin}`;
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.message.includes('CORS')) {
        return res.status(403).json({
            error: 'CORS Error',
            message: err.message,
            origin: req.headers.origin,
            allowedOrigins
        });
    }
    next(err);
});

app.use(express.json());

// Rate limiting configuration
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // limit each IP to 5 requests per windowMs
    message: { error: 'Too many contact requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Track page visit
app.post('/api/analytics/visit', (req, res) => {
    db.run('INSERT INTO visits (page) VALUES (?)', [req.body.page], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to track visit' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Get visit statistics
app.get('/api/analytics/visits', (req, res) => {
    db.all(`
        SELECT date(timestamp) as date, COUNT(*) as count 
        FROM visits 
        GROUP BY date(timestamp)
        ORDER BY date DESC 
        LIMIT 30
    `, [], (err, visits) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to get visits' });
        }
        
        db.get('SELECT COUNT(*) as count FROM visits', [], (err, totalVisits) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to get total visits' });
            }
            
            res.json({
                totalVisits: totalVisits.count,
                dates: visits.map(v => v.date),
                counts: visits.map(v => v.count)
            });
        });
    });
});

// Handle contact form submissions
app.post('/api/contact', contactLimiter, (req, res) => {
    const { name, email, message } = req.body;
    
    try {
        // Server-side validation
        if (!name || name.length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters' });
        }
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }
        if (!message || message.length < 10 || message.length > 500) {
            return res.status(400).json({ error: 'Message must be between 10 and 500 characters' });
        }

        const stmt = db.prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)');
        const result = stmt.run(name, email, message);
        res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Get contact statistics
app.get('/api/analytics/contacts', (req, res) => {
    try {
        const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get();
        res.json({ totalContacts: totalContacts.count });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to get contact count' });
    }
});

// Add Google OAuth routes
app.get('/auth/google', (req, res) => {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const tokens = await getTokens(code);
        
        
        res.send('Authentication successful! Check your server console for the tokens.');
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).send('Authentication failed');
    }
});

// Get available slots
app.get('/api/calendar/slots', async (req, res) => {
    try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 14); // Get slots for next 14 days
        
        const slots = await calendarService.getAvailableSlots(startDate, endDate);
        res.json({ slots });
    } catch (error) {
        console.error('Error fetching slots:', error);
        res.status(500).json({ error: 'Failed to fetch available slots' });
    }
});

// Schedule meeting
app.post('/api/calendar/schedule', async (req, res) => {
    try {
        const meeting = await calendarService.createMeeting(req.body);
        res.json({ success: true, meeting });
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ error: 'Failed to schedule meeting' });
    }
});

// Add meetings analytics endpoint
app.get('/api/analytics/meetings', (req, res) => {
    try {
        const result = db.prepare('SELECT COUNT(*) as totalMeetings FROM meetings').get();
        res.json({ totalMeetings: result.totalMeetings });
    } catch (error) {
        console.error('Error getting meeting count:', error);
        res.status(500).json({ error: 'Failed to get meeting count' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
