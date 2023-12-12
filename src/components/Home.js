import React, { useState } from 'react';
import './styles/index.css';
// import logoPlaceholder from '../images/logos/logo_notext_192x192.png';
import logoPlaceholder from '../images/logos/logo_notext_192x192.png';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

function HomeScreen(props) {
  const options = [
    '🏆\u00A0\u00A0\u00A0Create a League',
    '🤝\u00A0\u00A0\u00A0Invites',
    '🏈\u00A0\u00A0\u00A0My Leagues',
    '🖥️\u00A0\u00A0\u00A0Draft'
  ];
  
  const navigator = useNavigate();
  const [activePillIndex, setActivePillIndex] = useState(0);

  const handlePillClick = (index) => {
    setActivePillIndex(index);
    
    if (index === 0) {
      navigator('/myLeagues');
    } else if (index === 1) {
      navigator('/invites');
    } else if (index === 2) {
      navigator('/myLeagues');
    } else if (index === 3) {
      navigator('/draft');
    }
  };

  return (
    <div className="HomePage">
      <header className="header">
        <div className="logo">
          <img src={logoPlaceholder} alt="Logo" />
          <h1 className="title">Flex Fantasy</h1>
        </div>
        <NavBar isLoggedIn={props.isLoggedIn} />
      </header>
      <div className="pills-container">
        {options.map((option, index) => (
          <div
            key={index}
            className={`pill ${index === activePillIndex ? 'active' : ''}`}
            onClick={() => handlePillClick(index)}
          >
            <h2 className="option-name">{option}</h2>
          </div>
        ))}
      </div>
      {/* The bottom half of the page for fantasy football news */}
      <div className="news-container">
        {/* Placeholder content for news */}
      </div>
    </div>
  );
}

export default HomeScreen;
