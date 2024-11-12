import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import './ScrollProgress.css';

function ScrollProgress() {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="progress-bar"
            style={{ scaleX: scrollYProgress }}
        />
    );
}

export default ScrollProgress; 