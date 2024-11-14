import React from 'react';
import '../styles/HomePage.css';
import profilePic from '../assets/me.png';  // Ensure the path is correct

function HomePage() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Hi, I am Muhammad</h1>
                <p className="quote">"Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do." - Steve Jobs</p>
            </header>
            <div className="content-container">
                <div className="text-content">
                    <h2>About Me</h2>
                    <p>I initially wrote here, I am a Software Engineer but actually I don't think I am. Yes, I have a degree in Software Engineering as well as my Job title is as a Software Engineer.</p>
                    <p>But I consider myself to be a problem solver, I enjoy complex problems and weird edge cases. I like thinking about problems in depth and often ponder restlessly over them.</p>
                    <p>Hence, to limit myself to just being a Software Engineer seems to be a bit of an injustice. I am a problem solver, and I love complex problems.</p>
                </div>
                <img src={profilePic} alt="Muhammad" className="profile-pic"/>
            </div>
        </div>
    );
}

export default HomePage;
