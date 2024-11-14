import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Projects.css';
import covidTrackerImg from '../assets/covid-tracker.jpg';
import mavsAbroadImg from '../assets/mavs-abroad.jpg';
import carRentalImg from '../assets/car-rental.jpg';
import nutrixImg from '../assets/nutrix.jpg';

function Projects() {
    const projects = [
        {
            title: "COVID-19 Tracker",
            description: "Real-time COVID-19 tracking application providing global and country-specific statistics, with interactive dashboards and live updates.",
            technologies: ["Dart", "Flutter", "GO", "REST API"],
            image: covidTrackerImg,
            githubLink: "https://github.com/ibrahimshazad/Covid19TrackerApp",
            liveLink: "https://covid19trackerapp-ibrahim.netlify.app/"
        },
        {
            title: "Mavs Abroad Japan",
            description: "Web platform facilitating study abroad programs in Japan for UTA students, featuring program information and application management.",
            technologies: ["React", "Next.js", "Firebase", "HTML/CSS"],
            image: mavsAbroadImg,
            githubLink: "https://github.com/ibrahimshazad/mavsabroadjapan",
            liveLink: "#"
        },
        {
            title: "Car Rental System",
            description: "Full-stack car rental management system with user authentication, booking management, and admin dashboard.",
            technologies: ["Python", "Tkinter", "SQLite"],
            image: carRentalImg,
            githubLink: "https://github.com/ibrahimshazad/CarRentalSystem",
            liveLink: "#"
        },
        {
            title: "Nutrix",
            description: "Nutrition tracking and meal planning application with personalized recommendations and progress tracking.",
            technologies: ["Java", "Kotlin", "Android SDK", "Firebase"],
            image: nutrixImg,
            githubLink: "https://github.com/ibrahimshazad/Nutrix",
            liveLink: "#"
        }
    ];

    return (
        <div className="projects-container">
            <motion.h1 
                className="projects-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Featured Projects
            </motion.h1>
            <div className="projects-grid">
                {projects.map((project, index) => (
                    <motion.div 
                        key={index}
                        className="project-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className="project-content">
                            <div className="project-image">
                                <img src={project.image} alt={project.title} />
                            </div>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-technologies">
                                {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                            <div className="project-links">
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-github"></i> GitHub
                                </a>
                                {project.liveLink !== "#" && (
                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                        <i className="fas fa-external-link-alt"></i> Live Demo
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Projects;
