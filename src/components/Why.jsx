import React from 'react';
import './Why.css';

const Why = () => {
    const steps = [
        {
            icon: "fa-hand-holding-heart",
            title: "Zero Fees for Charities",
            description: "Our platform waives fees for charitable campaigns, ensuring all donations go directly to the cause.",
             colorClass: "blue-card"
        },
        {
            icon: "fa-eye",
            title: "Transparent Fundraising",
            description: "Track campaign progress and see how funds are being utilized for full transparency.",
             colorClass: "red-card"
        },
        {
            icon: "fa-globe",
            title: "Global Reach",
            description: "Reach supporters around the world and amplify your impact with an international audience.",
              colorClass: "blue-card"
        },
        {
            icon: "fa-lock",
            title: "Secure Payment Processing",
            description: "All transactions are encrypted and processed securely, protecting donor information and funds.",
             colorClass: "red-card"
        },
    ];

    return (
        <div className="why-section">
            <div className="why-cards">
                {steps.map((step, index) => (
                    <div key={index} className={`why-card ${step.colorClass}`}>
                        <i className={`fa ${step.icon} why-icon`} aria-hidden="true"></i>
                        <h3 className="why-title">{step.title}</h3>
                        <p className="why-description">{step.description}</p>
                    </div>
                ))}
            </div>
            <a href="/ServicePage" className="why-button"> Learn more</a>

        </div>
    );
};

export default Why;
