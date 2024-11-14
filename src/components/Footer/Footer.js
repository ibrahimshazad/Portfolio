import React, { useState } from 'react';
import './Footer.css';
import linkedInLogo from '../../assets/linkedin.png';
import githubLogo from '../../assets/github.png';
import emailIcon from '../../assets/email.png';
import { motion } from 'framer-motion';

function Footer() {
    const [activeHover, setActiveHover] = useState(null);
    const email = "muhammad.siddiqui262@gmail.com";

    const handleEmailClick = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(email);
        setActiveHover('email-copied');
        setTimeout(() => setActiveHover(null), 2000);
    };

    const socialLinks = [
        {
            id: 'github',
            icon: githubLogo,
            name: 'GitHub',
            url: 'https://github.com/ibrahimshazad',
            description: 'Check out my open source projects'
        },
        {
            id: 'linkedin',
            icon: linkedInLogo,
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/muhammad-ibrahim-siddiqui-4bb32720b/',
            description: 'Connect with me professionally'
        },
        {
            id: 'email',
            icon: emailIcon,
            name: 'Email',
            url: `mailto:${email}`,
            description: activeHover === 'email-copied' ? 'Email copied!' : 'Get in touch directly'
        }
    ];

    return (
        <footer className="footer">
            <div className="footer-links">
                {socialLinks.map((link) => (
                    <div 
                        key={link.id}
                        className="social-link-container"
                        onMouseEnter={() => setActiveHover(link.id)}
                        onMouseLeave={() => setActiveHover(null)}
                    >
                        <a 
                            href={link.url}
                            className="footer-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={link.id === 'email' ? handleEmailClick : undefined}
                        >
                            <img src={link.icon} alt={link.name} />
                            <span>{link.name}</span>
                        </a>
                        {activeHover === link.id && (
                            <motion.div 
                                className="hover-card"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <p>{link.description}</p>
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </footer>
    );
}

export default Footer;
