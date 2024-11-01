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
              Thaifunder was born out of the desire to give back to the communities that make Thailand such a vibrant and resilient country. From bustling city centers to rural villages, we recognized the immense potential in the collective power of individuals joining forces to support causes that matter.
            </p>
            <img
              src="https://scx2.b-cdn.net/gfx/news/2024/tourists-evacuated-hot.jpg"
              alt="Helping Thailand"
              style={styles.imageLarge}
            />
            <p style={styles.text}>
              In 2024, Thaifunder was officially launched with the goal of connecting people and causes. Whether it’s funding a life-saving medical procedure, helping a local school rebuild, or supporting artists in need, we’ve been honored to witness the generosity of the Thai people and beyond.
            </p>
            <img
              src="https://phuketnews.phuketindex.com/wp-content/uploads/2020/01/thai-kids-800x480.jpg"
              alt="Helping Thailand"
              style={styles.imageLarge}
            />
            <p style={styles.text}>
              At Thaifunder, transparency and trust are at the core of everything we do. We strive to ensure that each campaign is vetted for legitimacy, so donors know exactly where their contributions are going.
            </p>
            <hr />
            <p style={styles.text}>
              Join us in our journey to make a positive impact in Thailand. Together, let’s continue to empower individuals and communities to achieve their goals.
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
  imageLarge: {
    maxWidth: '800px',
    width: '100%',
    borderRadius: '10px',
    margin: '20px 0',
  },
  storySection: {
    marginTop: '40px',
  },
  // Responsive adjustments
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
    heading: {
      fontSize: '28px',
    },
    text: {
      fontSize: '16px',
    },
    image: {
      maxWidth: '100%',
    },
    imageLarge: {
      maxWidth: '100%',
    },
  },
};

export default AboutPage;
