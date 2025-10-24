import React from 'react';
import { motion } from 'framer-motion';
import '../styles/About.css';

function About() {
    const experiences = [
        {
            title: "Software Engineer II",
            company: "Ikon Technologies - Arlington, TX",
            period: "February 2025 - Present",
            description: "I design and build large-scale backend systems and data pipelines using TypeScript, NestJS, GraphQL, and AWS to power revenue-generating products and integrations. I also lead technical initiatives, mentor engineers, and collaborate with executives to drive platform-wide innovation and efficiency."
        },
        {
            title: "Software Development Engineer I",
            company: "Ikon Technologies - Arlington, TX",
            period: "June 2022 - February 2025",
            description: "Led the migration to AWS Cognito, enhancing security with OAuth flow and SSO. Designed and deployed highly scalable GraphQL APIs with Apollo GraphQL on AWS Fargate. Enhanced monitoring capabilities by integrating SNS, CloudWatch, and Kinesis."
        },
        {
            title: "Software Engineer Intern",
            company: "Ikon Technologies",
            period: "January 2022 - June 2022",
            description: "Integrated DynamoDB for efficient real-time analytics of telemetrics data. Implemented Route 53 routing and ELB for DNS management and load balancing. Automated infrastructure provisioning using AWS CloudFormation and Terraform."
        },
        {
            title: "Encryption Lead",
            company: "Office of Information Technology at UTA",
            period: "October 2019 - December 2021",
            description: "Developed and executed comprehensive data encryption strategy across AWS services. Conducted training sessions for IT staff on AWS security practices and encryption techniques."
        }
    ];

    const education = {
        university: "The University of Texas at Arlington",
        degree: "Bachelor of Science: Software Engineering",
        gpa: "3.9/4.0",
        honors: "Dean's List, Maverick Scholar, Magna Cum Laude"
    };

    const certifications = [
        {
            title: "AWS Certified Solutions Architect - Professional",
            issuer: "Amazon Web Services (AWS)",
            date: "2023",
            credlyLink: "https://www.credly.com/badges/83bf6208-ce4c-493a-af3c-9a5f9344f614/linked_in?t=sbq8y4"
        },
        {
            title: "AWS Certified Solutions Architect - Associate",
            issuer: "Amazon Web Services (AWS)",
            date: "2022",
            credlyLink: "https://www.credly.com/badges/df20036f-bd3d-42e9-96f8-7ad669b6d8b4/linked_in"
        },
        {
            title: "AWS Certified Cloud Practitioner",
            issuer: "Amazon Web Services (AWS)",
            date: "2022",
            credlyLink: "https://www.credly.com/badges/d9725e27-bead-4508-bdcd-e04c204f8445/linked_in"
        }
    ];

    return (
        <div className="about-container">
            <motion.h1 
                className="about-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                About Me
            </motion.h1>

            <motion.section 
                className="about-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2>Professional Summary</h2>
                <p>Innovative Software Engineer II with over 3.5 years of professional experience in cloud solutions and software architecture. Expert in designing and implementing large-scale backend systems and data pipelines using TypeScript, NestJS, GraphQL, and AWS. Proven track record of leading technical initiatives, mentoring engineers, and driving platform-wide innovation while delivering high-quality software that enhances business operations and efficiency.</p>
            </motion.section>

            <motion.section 
                className="education-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h2>Education</h2>
                <div className="education-card">
                    <h3>{education.university}</h3>
                    <p>{education.degree}</p>
                    <p>GPA: {education.gpa}</p>
                    <p className="honors">{education.honors}</p>
                </div>
            </motion.section>

            <motion.section 
                className="certifications-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h2>Certifications</h2>
                <div className="certifications-grid">
                    {certifications.map((cert, index) => (
                        <motion.div 
                            key={index}
                            className="certification-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <h3>{cert.title}</h3>
                            <p>{cert.issuer}</p>
                            <p className="cert-date">{cert.date}</p>
                            <a 
                                href={cert.credlyLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="verify-button"
                            >
                                Verify Certificate
                            </a>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section 
                className="experience-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2>Experience</h2>
                {experiences.map((exp, index) => (
                    <motion.div 
                        key={index}
                        className="experience-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <h3>{exp.title}</h3>
                        <h4>{exp.company}</h4>
                        <p className="period">{exp.period}</p>
                        <p>{exp.description}</p>
                    </motion.div>
                ))}
            </motion.section>
        </div>
    );
}

export default About;
