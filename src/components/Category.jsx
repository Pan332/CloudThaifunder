import React from 'react';
import { FaGamepad, FaTshirt, FaPenNib, FaFilm, FaMusic, FaPalette, FaFlask, FaBook } from 'react-icons/fa';

const Categories = () => {
  const categories = [
    { icon: <FaGamepad size={40} />, label: 'Games', link: '/games' },
    { icon: <FaTshirt size={40} />, label: 'Fashion', link: '/fashion' },
    { icon: <FaPenNib size={40} />, label: 'Design', link: '/design' },
    { icon: <FaFilm size={40} />, label: 'Film', link: '/film' },
    { icon: <FaMusic size={40} />, label: 'Music', link: '/music' },
    { icon: <FaPalette size={40} />, label: 'Art', link: '/art' },
    { icon: <FaFlask size={40} />, label: 'Technology', link: '/technology' },
    { icon: <FaBook size={40} />, label: 'Book', link: '/book' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <a 
            key={index} 
            href={category.link} 
            style={styles.categoryItem} 
            target="_blank" 
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
  },
  label: {
    marginTop: '10px',
    fontSize: '16px',
  },
};

export default Categories;
