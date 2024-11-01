import React from 'react';
import './Card.css'; 

function Card({ title, name, image, description ='', goal, raised, timeRemaining }) {
  const progressPercentage = Math.min((raised / goal) * 100, 100);

  return (
    <div className="campaign-card">
      <img src={image} alt={title} className="campaign-image" />
      <div className="card-content">
        <h2 className="campaign-title">{title}</h2>
        <p className="campaign-owner">By {name}</p>
        <p className="campaign-description">{description.substring(0, 150)}</p>
        <div className="campaign-goal">
          <p>Raised: {raised.toLocaleString()}</p>
          <p>Goal: {goal.toLocaleString()}</p>

        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
        </div>
        <p className="time-remaining">{timeRemaining} days left</p>
      </div>
    </div>
  );
}

export default Card;
