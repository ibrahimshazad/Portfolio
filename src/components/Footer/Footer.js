import React from 'react';
import './Footer.css'; // Make sure this points to the correct CSS file
import linkedInLogo from '../../assets/linkedin.png'
import githubLogo from '../../assets/github.png'; // Adjust path as necessary
import emailIcon from '../../assets/email.png'; // Adjust path as necessary

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-links">
                <a href="https://github.com/ibrahimshazad" target="_blank" rel="noopener noreferrer">
                    <img src={githubLogo} alt="GitHub" />
                    GitHub
                </a>
                <a href="mailto:muhammad.siddiqui262@gmail.com">
                    <img src={emailIcon} alt="Email" />
                    Email Me
                </a>
                <a href="https://www.linkedin.com/in/muhammad-ibrahim-siddiqui-4bb32720b/" target="_blank" rel="noopener noreferrer">
                    <img src={linkedInLogo} alt="LinkedIn" />
                    LinkedIn
                </a>
            </div>
        </footer>
    );
}

export default Footer;
