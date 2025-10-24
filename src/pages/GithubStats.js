import { motion } from 'framer-motion';
import '../styles/GithubStats.css';
import img2023 from '../assets/2023.png';
import img2024 from '../assets/2024.png';
import img2025 from '../assets/2025.png';

function GithubStats() {
    return (
        <div className="github-stats-container">
            <motion.h1 
                className="github-stats-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                My GitHub Activity
            </motion.h1>

            <div className="stats-grid">
                <motion.div 
                    className="stat-card contribution-graph"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="year-title">My GitHub Activity</h2>
                    
                    <div className="current-activity">
                        <img
                            src={`https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=muhammadikon&theme=chartreuse_dark`}
                            alt="GitHub Current Activity"
                            className="stat-image yearly-summary"
                        />
                    </div>

                    <h2 className="year-title">Contribution History</h2>
                    <div className="years-container">
                        <motion.div 
                            className="year-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h3>2023</h3>
                            <img
                                src={img2023}
                                alt="2023 GitHub Contributions"
                                className="year-image"
                            />
                        </motion.div>
                        
                        <motion.div 
                            className="year-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3>2024</h3>
                            <img
                                src={img2024}
                                alt="2024 GitHub Contributions"
                                className="year-image"
                            />
                        </motion.div>
                        
                        <motion.div 
                            className="year-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h3>2025</h3>
                            <img
                                src={img2025}
                                alt="2025 GitHub Contributions"
                                className="year-image"
                            />
                        </motion.div>
                    </div>

                    <div className="github-buttons">
                        <a href="https://github.com/muhammadikon" target="_blank" rel="noopener noreferrer" className="github-link">
                            View Full Profile
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default GithubStats;