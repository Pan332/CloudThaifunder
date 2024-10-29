import React from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';

function ContactPage() {
  const teamMembers = [
    {
      name: "Panuwat Korkiatthamrong",
      image: "data:image/jpeg;base64,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", // Replace with the actual image URL
      github: "https://github.com/johndoe",
      facebook: "https://facebook.com/johndoe",
      email: "mailto:johndoe@example.com",
      instagram: "https://instagram.com/johndoe"
    },
    {
      name: "Danasawin Peetitrakul",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsJ1ZQtsth-JY2mfd-seIF_Uh19nwqwBgk4w&s", // Replace with the actual image URL
      github: "https://github.com/janesmith",
      facebook: "https://facebook.com/janesmith",
      email: "mailto:janesmith@example.com",
      instagram: "https://instagram.com/janesmith"
    }
  ];

  const styles = {
    contactPage: {
      textAlign: 'center',
      padding: '20px',
      marginBottom: '230px',

    },
    team: {
      display: 'flex',
      justifyContent: 'center',
      gap: '100px',
      marginTop:'70px'
    },
    teamMember: {
      border: '2px solid #ccc',
      padding: '20px',
      borderRadius: '10px',
      width: '300px',
      backgroundColor: '#f9f9f9',
    },
    teamMemberImage: {
      width: '100%',
      borderRadius: '50%',
      marginBottom: '15px',
    },
    teamMemberName: {
      fontSize: '20px',
      marginBottom: '10px',
    },
    socialIcons: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '10px',
    },
    socialIconLink: {
      color: '#333',
      fontSize: '24px',
      textDecoration: 'none',
    },
  };

  return (
    <>
      <Navbar />
      <div style={styles.contactPage}>
        <div style={styles.team}>
          {teamMembers.map((member, index) => (
            <div key={index} style={styles.teamMember}>
              <img src={member.image} alt={member.name} style={styles.teamMemberImage} />
              <h2 style={styles.teamMemberName}>{member.name}</h2>
              <div style={styles.socialIcons}>
                <a href={member.github} target="_blank" rel="noopener noreferrer" style={styles.socialIconLink}>
                  <i className="fab fa-github"></i>
                </a>
                <a href={member.facebook} target="_blank" rel="noopener noreferrer" style={styles.socialIconLink}>
                  <i className="fab fa-facebook"></i>
                </a>
                <a href={member.email} style={styles.socialIconLink}>
                  <i className="fas fa-envelope"></i>
                </a>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer" style={styles.socialIconLink}>
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ContactPage;
