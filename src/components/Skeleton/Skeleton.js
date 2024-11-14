import React from 'react';
import { motion } from 'framer-motion';
import './Skeleton.css';

function Skeleton({ type }) {
    const variants = {
        card: {
            width: '100%',
            height: '200px',
            borderRadius: '10px'
        },
        text: {
            width: '80%',
            height: '20px',
            borderRadius: '4px',
            marginBottom: '10px'
        },
        title: {
            width: '60%',
            height: '32px',
            borderRadius: '4px',
            marginBottom: '20px'
        }
    };

    return (
        <motion.div
            className="skeleton"
            style={variants[type]}
            animate={{
                background: ['#f0f0f0', '#e0e0e0', '#f0f0f0'],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    );
}

export default Skeleton; 