import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

function ContactForm() {
    const form = useRef();
    const [status, setStatus] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus('sending');

        emailjs.sendForm(
            'YOUR_SERVICE_ID', // From EmailJS dashboard
            'YOUR_TEMPLATE_ID', // From EmailJS dashboard
            form.current,
            'YOUR_PUBLIC_KEY' // From EmailJS dashboard
        )
        .then((result) => {
            setStatus('success');
            form.current.reset();
            setTimeout(() => setStatus(''), 3000);
        }, (error) => {
            setStatus('error');
            setTimeout(() => setStatus(''), 3000);
        });
    };

    return (
        <motion.div 
            className="contact-form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2>Get In Touch</h2>
            <form ref={form} onSubmit={sendEmail}>
                <div className="form-group">
                    <input
                        type="text"
                        name="user_name"
                        placeholder="Your Name"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="user_email"
                        placeholder="Your Email"
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        required
                    />
                </div>
                <button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status && (
                    <div className={`status-message ${status}`}>
                        {status === 'success' ? 'Message sent successfully!' : 'Failed to send message.'}
                    </div>
                )}
            </form>
        </motion.div>
    );
}

export default ContactForm; 