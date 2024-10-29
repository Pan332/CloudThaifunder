import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div style={styles.aboutContainer}>
        <div style={styles.content}>
          {/* Mission Section */}
          <div style={styles.missionSection}>
            <div style={styles.textContainer}>
              <h1 style={styles.heading}>Our Mission</h1>
              <p style={styles.text}>
                At <strong>Thaifunder</strong>, our mission is to empower communities and individuals across Thailand by providing a platform to raise funds for meaningful causes. Whether it's helping a local charity, supporting medical expenses, or launching community-driven projects, we believe in the power of collective contributions to make a difference.
              </p>
            </div>
            <div style={styles.imageContainer}>
              <img
                src="https://cdn.theatlantic.com/media/img/photo/2011/10/worst-flooding-in-decades-swamps-thailand/t01_RTR2R6LH/main_1200.jpg"
                alt="Helping Thailand"
                style={styles.image}
              />
            </div>
          </div>
            <hr />
          {/* Story Section */}
          <div style={styles.storySection}>
            <h2 style={styles.heading}>Founding Story</h2>
            <p style={styles.text}>
              Thaifunder was born out of the desire to give back to the communities that make Thailand such a vibrant and resilient country. From bustling city centers to rural villages, we recognized the immense potential in the collective power of individuals joining forces to support causes that matter. Our founders, seeing the challenges in traditional fundraising methods, decided to create a platform where anyone, regardless of their background, could raise funds for projects that would make a lasting impact.
            </p>
            <p style={styles.text}>
              In 2024, Thaifunder was officially launched with the goal of connecting people and causes. What started as a small team of passionate individuals has now grown into a thriving community of donors, campaigners, and volunteers who are all dedicated to making a difference. Whether it’s funding a life-saving medical procedure, helping a local school rebuild, or supporting artists in need of a platform to share their work, we’ve been honored to witness the generosity of the Thai people and beyond.
            </p>
            <img
                src="https://phuketnews.phuketindex.com/wp-content/uploads/2020/01/thai-kids-800x480.jpg"
                alt="Helping Thailand"
             
              />
            <p style={styles.text}>
              At Thaifunder, transparency and trust are at the core of everything we do. We strive to ensure that each campaign is vetted for legitimacy, so donors know exactly where their contributions are going. Our platform is user-friendly and accessible, allowing campaigns to reach a broad audience both locally and internationally.
            </p>
            <p style={styles.text}>
              We’ve come a long way, but this is just the beginning. In the future, we aim to expand our services to neighboring countries, helping more people raise funds for causes that matter to them. By providing tools for success and maintaining a close connection with our communities, we believe we can inspire positive change across Thailand and beyond.
            </p>
            <hr />
            <p style={styles.text}>
              Join us in our journey to make a positive impact in Thailand, and together, let’s continue to empower individuals and communities to achieve their goals, no matter how big or small.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  aboutContainer: {
    backgroundColor: '#f9f9f9',
    padding: '50px 20px',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  missionSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: '60px',
  },
  textContainer: {
    flex: 1,
    paddingRight: '30px',
   
  },
  imageContainer: {
    flex: 1,
    textAlign: 'right',
  },
  heading: {
    fontSize: '36px',
    marginBottom: '20px',
    color: '#333',
  },
  text: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '20px',
  },
  image: {
    maxWidth: '400px',
    width: '100%',
    borderRadius: '10px',
  },
  storySection: {
    marginTop: '40px',
  },
  '@media (max-width: 768px)': {
    missionSection: {
      flexDirection: 'column',
    },
    textContainer: {
      paddingRight: '0',
    },
    imageContainer: {
      textAlign: 'center',
      marginTop: '20px',
    },
  },
};

export default AboutPage;
