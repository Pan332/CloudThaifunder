import React from 'react';
import { FaGamepad, FaTshirt, FaPenNib, FaFilm, FaMusic, FaPalette, FaFlask, FaBook, FaHandHoldingHeart, FaMedkit, FaGraduationCap, FaBriefcase } from 'react-icons/fa';
import './Category.css';  // Import the external CSS file

const Categories = () => {
  const categories = [
    { icon: <FaHandHoldingHeart size={40} color={'#FF4500'} />, label: 'Charities', link: '/CharitiesPage' },
    { icon: <FaMedkit size={40} color={'#C71585'} />, label: 'Medical & Healing', link: '/MedicalPage' },
    { icon: <FaGraduationCap size={40} color={'#20B2AA'} />, label: 'Education', link: '/EducationPage' },
    { icon: <FaBriefcase size={40} color={'#FFD700'} />, label: 'Business & Startup', link: '/BusinessPage' },
    { icon: <FaGamepad size={40} color={'#4CAF50'} />, label: 'Games', link: '/GamesPage' }, 
    { icon: <FaTshirt size={40} color={'#FF6347'} />, label: 'Fashion', link: '/FashionPage' },   
    { icon: <FaPenNib size={40} color={'#333333'} />, label: 'Design', link: '/DesignPage' },    
    { icon: <FaFilm size={40} color={'#FF8C00'} />, label: 'Film', link: '/FilmPage' },          
    { icon: <FaMusic size={40} color={'#FF1493'} />, label: 'Music', link: '/MusicPage' },   
    { icon: <FaPalette size={40} color={'#1E90FF'} />, label: 'Art', link: '/ArtPage' },         
    { icon: <FaFlask size={40} color={'#8A2BE2'} />, label: 'Technology', link: '/TechnologyPage' }, 
    { icon: <FaBook size={40} color={'#4682B4'} />, label: 'Book', link: '/BooksPage' },      
  ];

  return (
    <div className="container">
      <div className="categoriesGrid">
        {categories.map((category, index) => (
          <a 
            key={index} 
            href={category.link} 
            className="categoryItem" 
            rel="noopener noreferrer"
          >
            {category.icon}
            <p className="label">{category.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Categories;
