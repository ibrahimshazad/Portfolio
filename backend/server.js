const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./db/init');

const app = express();

app.use(cors());
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
    const stmt = db.prepare('INSERT INTO visits (page) VALUES (?)');
    const result = stmt.run(req.body.page);
    res.json({ success: true, id: result.lastInsertRowid });
});

// Get visit statistics
app.get('/api/analytics/visits', (req, res) => {
    const visits = db.prepare(`
        SELECT date(timestamp) as date, COUNT(*) as count 
        FROM visits 
        GROUP BY date(timestamp)
        ORDER BY date DESC 
        LIMIT 30
    `).all();
    
    const totalVisits = db.prepare('SELECT COUNT(*) as count FROM visits').get();

    res.json({
        totalVisits: totalVisits.count,
        dates: visits.map(v => v.date),
        counts: visits.map(v => v.count)
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
