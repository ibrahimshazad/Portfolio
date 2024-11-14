import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Contact.css';

function Contact() {
    const [contactCount, setContactCount] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const maxMessageLength = 500;
    const [countLoading, setCountLoading] = useState(true);

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        setCountLoading(true);
        fetch('http://localhost:5000/api/analytics/contacts')
            .then(res => res.json())
            .then(data => {
                setContactCount(data.totalContacts);
                setCountLoading(false);
            })
            .catch(err => {
                console.error('Error fetching contact count:', err);
                setCountLoading(false);
            });
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }
        if (formData.message.length > maxMessageLength) {
            newErrors.message = `Message cannot exceed ${maxMessageLength} characters`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsLoading(true);
        setStatus('sending');
        
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setStatus('success');
                setContactCount(prev => prev + 1);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus(''), 3000);
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('error');
            setErrors({ submit: error.message });
            setTimeout(() => {
                setStatus('');
                setErrors({});
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.section 
            className="contact-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="contact-header">
                <h2>Get In Touch</h2>
                <motion.div 
                    className="contact-counter"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {countLoading ? (
                        <span className="loading-dots">Loading...</span>
                    ) : (
                        `${contactCount} messages received`
                    )}
                </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
                <motion.div className="form-group">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if (errors.name) setErrors({...errors, name: ''});
                        }}
                        className={errors.name ? 'error' : ''}
                        required
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </motion.div>

                <motion.div className="form-group">
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            if (errors.email) setErrors({...errors, email: ''});
                        }}
                        className={errors.email ? 'error' : ''}
                        required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </motion.div>

                <motion.div className="form-group">
                    <textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => {
                            setFormData({...formData, message: e.target.value});
                            if (errors.message) setErrors({...errors, message: ''});
                        }}
                        className={errors.message ? 'error' : ''}
                        required
                    />
                    <div className="message-footer">
                        {errors.message && <span className="error-message">{errors.message}</span>}
                        <span className="character-count">
                            {formData.message.length}/{maxMessageLength}
                        </span>
                    </div>
                </motion.div>

                <motion.button 
                    type="submit" 
                    disabled={isLoading || status === 'sending'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? (
                        <div className="loading-spinner" />
                    ) : status === 'sending' ? 
                        'Sending...' : 
                        'Send Message'
                    }
                </motion.button>

                <AnimatePresence>
                    {status && (
                        <motion.div 
                            className={`status-message ${status}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {status === 'success' ? 
                                'Message sent successfully!' : 
                                'Failed to send message. Please try again.'}
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </motion.section>
    );
}

export default Contact;