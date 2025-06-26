import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About SPN Games 🎮</h1>
      <p className="about-intro">
        Welcome to <strong>SPN Games</strong> – your destination for quick, fun, and brain-boosting web games! Whether you're here to relax or challenge your memory, focus, or reflexes, we've got something for you.
      </p>

      <div className="game-section">
        <h2>🍉 Game 1: Fruit Memory Match</h2>
        <p>
          Test your memory by flipping cards and matching identical fruit images. Beat your own best time and flip count. It’s fun, colorful, and perfect for training your brain.
        </p>
      </div>

      <div className="game-section">
        <h2>🔢 Game 2: Number Series</h2>
        <p>
          Sharpen your logic by identifying the correct number sequence. Levels get more challenging as you go, helping you train focus and numerical reasoning.
        </p>
      </div>

      <div className="game-section">
        <h2>🍔 Game 3: Food Match (Hard Mode)</h2>
        <p>
          Like Fruit Memory Match, but harder! Match identical food items across a 4x5 grid. Keep track of your time and flip stats – and try to set a new high score!
        </p>
      </div>

      <div className="game-section">
        <h2>🏏 Game 4: Hand Cricket</h2>
        <p>
          A virtual twist on the classic hand cricket game! Choose your numbers and go head-to-head with the computer. Bat, bowl, and aim for a win!
        </p>
      </div>

      <p className="about-footer">
        SPN Games is designed to be light, fast, and accessible – no downloads, no clutter, just pure fun. Play now and challenge yourself!
      </p>
    </div>
  );
};

export default About;

