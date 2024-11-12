import React from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

function Contact() {
    const email = "muhammad.siddiqui262@gmail.com";
    const subject = "Portfolio Contact";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    return (
        <motion.section 
            className="contact-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2>Get In Touch</h2>
            <p>Have a question or want to work together? Feel free to reach out!</p>
            <a 
                href={mailtoLink}
                className="contact-button"
                target="_blank"
                rel="noopener noreferrer"
            >
                <i className="fas fa-envelope"></i>
                Send Email
            </a>
        </motion.section>
    );
}

export default Contact; 