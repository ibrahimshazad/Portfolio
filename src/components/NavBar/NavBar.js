import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../Theme/ThemeToggle';
import './NavBar.css';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <NavLink to="/">MI</NavLink>
                <div className="theme-toggle-wrapper">
                    <ThemeToggle />
                </div>
            </div>
            
            <div className="nav-controls">
                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    <motion.span 
                        animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                    ></motion.span>
                    <motion.span 
                        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                    ></motion.span>
                    <motion.span 
                        animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                    ></motion.span>
                </div>
            </div>

            <AnimatePresence>
                <motion.ul 
                    className={`nav-links ${isOpen ? 'active' : ''}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <li>
                        <NavLink to="/" end>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about">About</NavLink>
                    </li>
                    <li>
                        <NavLink to="/projects">Projects</NavLink>
                    </li>
                    <li>
                        <NavLink to="/meet">Meet</NavLink>
                    </li>
                    <li>
                        <NavLink to="/resume">Resume</NavLink>
                    </li>
                    <li>
                        <NavLink to="/github-stats">GitHub Stats</NavLink>
                    </li>
                </motion.ul>
            </AnimatePresence>
        </nav>
    );
}

export default NavBar;
