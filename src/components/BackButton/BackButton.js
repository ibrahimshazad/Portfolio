import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BackButton.css';

function BackButton() {
    const navigate = useNavigate();

    return (
        <motion.button
            className="back-button"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <i className="fas fa-arrow-left"></i>
            Back
        </motion.button>
    );
} 