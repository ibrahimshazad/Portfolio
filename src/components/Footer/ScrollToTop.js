import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 300);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    className="scroll-top-button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <i className="fas fa-arrow-up" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

export default ScrollToTop; 