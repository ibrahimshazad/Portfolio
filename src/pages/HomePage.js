import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Contact from '../components/Contact/Contact';
import '../styles/HomePage.css';
import profilePic from '../assets/me.png';

function HomePage() {
    const [typedText, setTypedText] = useState('');
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [visitCount, setVisitCount] = useState(0);
    
    const roles = useMemo(() => [
        "Software Engineer",
        "Problem Solver",
        "Full Stack Developer"
    ], []);

    useEffect(() => {
        let isSubscribed = true;
        let frameId;
    
        const typeText = async () => {
            try {
                const role = roles[currentRoleIndex];
                let displayText = '';
    
                // Function to update text
                const updateText = (forward = true) => {
                    if (!isSubscribed) return;
                    
                    if (forward) {
                        displayText = role.substring(0, displayText.length + 1);
                    } else {
                        displayText = role.substring(0, displayText.length - 1);
                    }
    
                    setTypedText(displayText);
    
                    if (displayText.length === (forward ? role.length : 0)) {
                        if (forward) {
                            setTimeout(() => updateText(false), 3000);
                        } else {
                            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
                        }
                    } else {
                        frameId = requestAnimationFrame(() => updateText(forward));
                    }
                };
    
                updateText();
            } catch (error) {
                console.error('Animation error:', error);
            }
        };
    
        typeText();
    
        return () => {
            isSubscribed = false;
            cancelAnimationFrame(frameId);
        };
    }, [currentRoleIndex, roles]);

    useEffect(() => {
        // Track the visit
        fetch('http://localhost:5000/api/analytics/visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: 'home' })
        }).catch(err => console.error('Error tracking visit:', err));

        // Get visit count
        fetch('http://localhost:5000/api/analytics/visits')
            .then(res => res.json())
            .then(data => setVisitCount(data.totalVisits))
            .catch(err => console.error('Error fetching visits:', err));
    }, []);

    return (
        <div className="home-container">
            <motion.section 
                className="hero-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Hi, I am Muhammad
                    </motion.h1>
                    <div className="typed-text">{typedText}</div>
                    <motion.p 
                        className="hero-description"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Transforming complex problems into elegant solutions
                    </motion.p>
                </div>
                <motion.img 
                    src={profilePic} 
                    alt="Muhammad" 
                    className="profile-pic"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                />
            </motion.section>

            <motion.section 
                className="skills-section"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <h2>Core Skills</h2>
                <div className="skills-grid">
                    {[
                        { 
                            title: "Languages", 
                            icon: "💻", 
                            skills: ["TypeScript", "Java", "Python", "C#", "C++", "GO", "SQL"] 
                        },
                        { 
                            title: "Frontend & Backend", 
                            icon: "⚡", 
                            skills: ["React", "Node.js", "Django", "Spring Boot", "Flask","Express","NestJS","NextJS","Flutter","React Native"] 
                        },
                        { 
                            title: "Cloud & DevOps", 
                            icon: "☁️", 
                            skills: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins"] 
                        },
                        { 
                            title: "Databases", 
                            icon: "🗄️", 
                            skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Cassandra"] 
                        },
                        { 
                            title: "Testing & Quality", 
                            icon: "🧪", 
                            skills: ["Jest", "Junit", "Selenium", "Postman","Swagger"] 
                        },
                        { 
                            title: "Development", 
                            icon: "🛠️", 
                            skills: ["Git", "Agile", "System Design", "GraphQL", "REST"] 
                        }
                    ].map((category, index) => (
                        <motion.div 
                            key={index}
                            className="skill-card"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <span className="skill-icon">{category.icon}</span>
                            <h3>{category.title}</h3>
                            <ul className="skill-list">
                                {category.skills.map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
            <Contact />
            <motion.div 
                className="visit-counter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                {visitCount} visitors so far
            </motion.div>
        </div>
    );
}

export default HomePage;
