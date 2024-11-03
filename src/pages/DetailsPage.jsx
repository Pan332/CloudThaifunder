import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import './DetailsPage.css';

function DetailsPage() {
  const data = {
    title: "Campaign Title",
    short_description: "This is a short description of the campaign.",
    description: "This is a detailed description of the campaign. It gives an in-depth explanation of what the campaign is about and its goals.",
    goal_amount: 10000,
    raised_amount: 6500,
    created_by: "John Doe",
    deadline: "2024-12-31",
    image: "https://media.istockphoto.com/id/1354066820/photo/gavieiro-or-el-silencio-beach-cudillero-asturias-spain.jpg?s=612x612&w=0&k=20&c=X6Q0YT2ay8brfNjAeaK4nUqzyeR9yALH4TCIndsqtOY=", // Placeholder image URL
  };

  const progress = (data.raised_amount / data.goal_amount) * 100;

  return (
    <>
      <Navbar />
    
      <Footer />
    </>
  );
}

export default DetailsPage;
