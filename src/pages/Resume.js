import React from 'react';
import { motion } from 'framer-motion';
import resumePDF from '../assets/Muhammad_pdf_resume.pdf';
import '../styles/Resume.css';

function Resume() {
    return (
        <div className="resume-container">
            <motion.h1 
                className="resume-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                My Resume
            </motion.h1>
            
            <motion.div 
                className="resume-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="resume-actions">
                    <a 
                        href={resumePDF} 
                        download="Muhammad_Ibrahim_Resume.pdf"
                        className="download-button"
                    >
                        <i className="fas fa-download"></i> Download PDF
                    </a>
                    <a 
                        href={resumePDF} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-button"
                    >
                        <i className="fas fa-eye"></i> View Full Screen
                    </a>
                </div>
                
                <div className="resume-preview">
                    <iframe
                        src={`${resumePDF}#view=FitH`}
                        title="Resume Preview"
                        width="100%"
                        height="800px"
                    />
                </div>
            </motion.div>
        </div>
    );
}

export default Resume;
