import React from 'react';
import { motion } from 'framer-motion';
import './ProjectFilter.css';

function ProjectFilter({ currentFilter, setFilter, technologies }) {
    return (
        <motion.div 
            className="filter-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <button 
                className={currentFilter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
            >
                All
            </button>
            {technologies.map((tech, index) => (
                <button
                    key={index}
                    className={currentFilter === tech ? 'active' : ''}
                    onClick={() => setFilter(tech)}
                >
                    {tech}
                </button>
            ))}
        </motion.div>
    );
}

export default ProjectFilter; 