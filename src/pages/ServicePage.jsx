import React from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from '../components/Footer.jsx';

function ServicePage() {
  return (
    <>
      <Navbar />
      <header style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: 'black',
          padding: '40px',
          borderBottom:'1.5px solid #ddd',
        }}>
          <h1 style={{ fontSize: '42px', margin: 0 }}>Our Services</h1>
          <p style={{ fontSize: '20px', marginTop: '10px' }}>Empowering Charities through Crowdfunding</p>
        </header>
      <div style={styles.aboutContainer}>
        <div style={styles.content}>
          {/* First Section: Text Left, Image Right */}

          <div style={styles.missionSection}>
            <div style={styles.textContainerLeft}>
              <h1 style={styles.heading}>What We Offer</h1>
              <p style={styles.text}>
              At <strong>ThaiFunder</strong>, we are dedicated to helping charities reach their goals by providing a secure, easy-to-use crowdfunding platform. Whether you are a local organization or a global non-profit, our platform enables you to create campaigns that connect with donors worldwide.
              </p>
            </div>
            <div style={styles.imageContainerRight}>
              <img
                src="https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/8f99/live/f44d43a0-7645-11ef-b282-4535eb84fe4b.jpg.webp"
                alt="Helping Thailand"
                style={styles.image}
              />
            </div>
          </div>
          <hr />
          <div style={styles.missionSectionReverse}>
            <div style={styles.textContainerRight}>
              <h1 style={styles.heading}>Zero Fees for Charities</h1>
              <p style={styles.text}>
              We believe in supporting the mission of charitable organizations, which is why we charge no fees for charity campaigns. All funds raised go directly to the cause, ensuring that every donation makes a difference.
              </p>
            </div>
            <div style={styles.imageContainerLeft}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpvxmjMflZ6KULj53jG_IjBKmpXgv3Bqoj7g&s"
                alt="Helping Thailand"
                style={styles.image}
              />
            </div>
          </div>
          <hr />
          <div style={styles.missionSection}>
            <div style={styles.textContainerLeft}>
              <h1 style={styles.heading}>Transparent Fundraising</h1>
              <p style={styles.text}>
              Our platform is built on transparency and trust. Donors can see how much money has been raised and how close the campaign is to its goal. This helps create trust between charities and supporters, ensuring a clear path for fundraising.
              </p>
            </div>
            <div style={styles.imageContainerRight}>
              <img
                src="https://www.wpcharitable.com/wp-content/uploads/2020/05/virtual-fundraiser-banner.jpg"
                alt="Helping Thailand"
                style={styles.image}
              />
            </div>
          </div>
          <hr />
          <div style={styles.missionSectionReverse}>
            <div style={styles.textContainerRight}>
              <h1 style={styles.heading}>Comprehensive Campaign Tools</h1>
              <p style={styles.text}>
              <strong>ThaiFunder</strong> offers a suite of tools for charities to create engaging campaigns. From customizable campaign pages to progress tracking and sharing tools, our platform provides everything needed to maximize outreach and achieve success.
              </p>
            </div>
            <div style={styles.imageContainerLeft}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNVLMRa9_xS_dSn_FxL9AgK3I-brgrFocy3Q&s"
                alt="Helping Thailand"
                style={styles.image}
              />
            </div>
          </div>
          <hr />
          <div style={styles.missionSection}>
            <div style={styles.textContainerLeft}>
              <h1 style={styles.heading}>Global Reach</h1>
              <p style={styles.text}>
              With our platform, charities can reach donors from across the globe. Our easy-to-use interface and secure payment gateways ensure a smooth donation process, no matter where the supporters are located.
              </p>
            </div>
            <div style={styles.imageContainerRight}>
              <img
                src="https://618media.com/wp-content/uploads/2024/01/seo-and-global-reach-expanding-content-globally.webp"
                alt="Helping Thailand"
                style={styles.image}
              />
            </div>
          </div>
          <hr />
          <div style={styles.missionSectionReverse}>
            <div style={styles.textContainerRight}>
              <h1 style={styles.heading}>Secure Payment Processing</h1>
              <p style={styles.text}>
              We understand the importance of security when it comes to donations. ThaiFunder provides safe and secure payment gateways, ensuring that every transaction is protected.
              </p>
            </div>
            <div style={styles.imageContainerLeft}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw4Gvy0T_r3EVZn5Iordx6Zg6-jSmG-hkS2g&s"
                alt="Helping Thailand"
                style={styles.image}
              />
            </div>
          </div>
          <hr />
        </div>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  aboutContainer: {
    padding: '20px 20px',
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
    padding: '40px',
  },
  missionSectionReverse: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: '60px',
    padding: '40px',
  },
  textContainerLeft: {
    flex: 1,
    paddingRight: '30px',
  },
  textContainerRight: {
    flex: 1,
    paddingLeft: '30px',
  },
  imageContainerRight: {
    flex: 1,
    textAlign: 'right',
  },
  imageContainerLeft: {
    flex: 1,
    textAlign: 'left',
  },
  heading: {
    fontSize: '36px',
    marginBottom: '20px',
    color: '#333',
  },
  text: {
    fontSize: '20px',
    lineHeight: '1.8',
    color: '#555',
    marginBottom: '20px',
  },
  image: {
    maxWidth: '450px',
    width: '100%',
    borderRadius: '10px',
  },
  // Responsive styles for smaller screens
  '@media (max-width: 768px)': {
    missionSection: {
      flexDirection: 'column',
      padding: '20px',
    },
    missionSectionReverse: {
      flexDirection: 'column',
      padding: '20px',
    },
    textContainerLeft: {
      paddingRight: '0',
    },
    textContainerRight: {
      paddingLeft: '0',
    },
    imageContainerRight: {
      textAlign: 'center',
      marginTop: '20px',
    },
    imageContainerLeft: {
      textAlign: 'center',
      marginTop: '20px',
    },
    heading: {
      fontSize: '28px',
    },
    text: {
      fontSize: '18px',
    },
  },
};

export default ServicePage;
