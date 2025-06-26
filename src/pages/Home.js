import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

import game3 from '../assets/game3.png'
import game1 from '../assets/game1.png'
import game2 from '../assets/game2.png'
import game4 from '../assets/game4.png'

const Home = () => {
  return (
    <div className="home-container">
      <h1>🎮 Welcome to the Game Zone</h1>
      <div className="game-grid">

        <Link to="/game1" className="game-card">
          <img
            src={game1}
            alt="Game 1"
            className="game-image"
          />
          <h3>Memory Match</h3>
        </Link>

        <Link to="/game2" className="game-card">
          <img
            src={game2}
            alt="Game 2"
            className="game-image"
          />
          <h3>Number Series</h3>
        </Link>

         <Link to="/game3" className="game-card">
          <img src={game3} alt="Game 3" className="game-image" />
          <h3>Food match</h3>
        </Link> 
         <Link to="/game4" className="game-card">
          <img src={game4} alt="Game 4" className="game-image" />
          <h3>Hand cricket</h3>
        </Link> 

      </div>
    </div>
  );
};

export default Home;