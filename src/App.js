import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import { ThemeProvider } from './components/Theme/ThemeContext';
import './styles/App.css';
import Meeting from './components/Meeting/Meeting';

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Resume = lazy(() => import('./pages/Resume'));
const GithubStats = lazy(() => import('./pages/GithubStats'));

function App() {
    return (
        <ThemeProvider>
        <Router>
            <div className="App">
                <NavBar />
                <Suspense fallback={<div className="loading">Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/meet" element={<Meeting />} />
                        <Route path="/resume" element={<Resume />} />
                        <Route path="/github-stats" element={<GithubStats />} />
                    </Routes>
                </Suspense>
                <Footer />
            </div>
        </Router>
        </ThemeProvider>
    );
}

export default App;
