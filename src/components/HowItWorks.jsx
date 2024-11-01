import React from 'react';
import './HowItWorks.css'; // Make sure to create this CSS file

const HowItWorks = () => {
    const steps = [
        {
            icon: "fa-user-friends",
            title: "Get Started",
            description: "Join our community by creating an account. Share your story, set your goal, and add compelling images."
        },
        {
            icon: "fa-bullseye",
            title: "Launch Your Campaign",
            description: "Share your campaign with friends, family, and social networks. Build a community around your cause."
        },
        {
            icon: "fa-paper-plane",
            title: "Get Funded",
            description: "Receive donations from supporters worldwide. Track your progress and keep donors updated."
        },
        {
            icon: "fa-check-circle",
            title: "Make It Happen",
            description: "Use the funds to bring your project to life. Share updates and show the impact of contributions."
        },
    ];
 
    return (
        <>
        <div className="how-it-works">
            {steps.map((step, index) => (
                <div className="step" key={index}>
                    <i className={`fas ${step.icon} step-icon`}></i>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                    
                </div>
            ))}
        </div>
        <a href="/CampaignManager" className="step-button"> Start Your Campaign</a>


        </>
    );
};

export default HowItWorks;
