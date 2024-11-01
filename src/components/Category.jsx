import React from 'react';
import { FaGamepad, FaTshirt, FaPenNib, FaFilm, FaMusic, FaPalette, FaFlask, FaBook } from 'react-icons/fa';

const Categories = () => {
  const categories = [
    { icon: <FaGamepad size={40} color={'green'} />, label: 'Games', link: '/GamesPage' },
    { icon: <FaTshirt size={40} color={'Red'} />, label: 'Fashion', link: '/fashion' },
    { icon: <FaPenNib size={40} color={'Black'} />, label: 'Design', link: '/design' },
    { icon: <FaFilm size={40} color={'Black'} />, label: 'Film', link: '/film' },
    { icon: <FaMusic size={40} color={'Pink'} />, label: 'Music', link: '/MusicPage' },
    { icon: <FaPalette size={40} color={'blue'} />, label: 'Art', link: '/art' },
    { icon: <FaFlask size={40} color={'purple'} />, label: 'Technology', link: '/TechnologyPage' },
    { icon: <FaBook size={40} color={'blue'} />, label: 'Book', link: '/BookPage' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <a 
            key={index} 
            href={category.link} 
            style={styles.categoryItem} 
            rel="noopener noreferrer"
          >
            {category.icon}
            <p style={styles.label}>{category.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

// Styles for the categories section
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.3s ease', // Smooth transition for the scale effect
  },
  label: {
    marginTop: '10px',
    fontSize: '16px',
  },
};

// Add hover effect
styles.categoryItem[':hover'] = {
  transform: 'scale(1.1)', // Slightly increase size on hover
};

export default Categories;
