import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoginContext } from '../App';
import '../styles/Game1.css';

const imageUrls = [
  "https://img.freepik.com/free-photo/png-red-apple-isolated-white-background_185193-163303.jpg",
  "https://img.freepik.com/free-photo/slice-watermelon-white-background_93675-128140.jpg",
  "https://img.freepik.com/free-photo/grapes-fruit-isolated-white-background_74190-4053.jpg",
  "https://img.freepik.com/free-photo/delicious-mango-still-life_23-2151542130.jpg",
  "https://img.freepik.com/free-photo/bananas_1339-1180.jpg",
  "https://img.freepik.com/free-photo/pineapple-fruit_74190-4912.jpg",
  "https://img.freepik.com/free-photo/pngjuicy-pomegranate-isolated-white-background_185193-165541.jpg",
  "https://img.freepik.com/free-photo/view-delicious-healthy-cantaloupe-melon_23-2151659017.jpg"
];

const Shuffle = (array) => {
  let result = [...array];
  let k = Math.floor(Math.random() * 6 + 1);
  for (let i = 0; i <= k; i++) {
    result = [...result.slice(k).reverse(), ...result.slice(0, k).reverse()];
    if (i + 3 < result.length) {
      let temp = result[i];
      result[i] = result[i + 3];
      result[i + 3] = temp;
    }
  }
  return result;
};

const Game1 = () => {
  const { user } = useContext(LoginContext);
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [firstIndex, setFirstIndex] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [time, setTime] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const duplicated = [...imageUrls, ...imageUrls];
    const shuffled = Shuffle(duplicated);
    setImages(shuffled);
    setMatched(Array(16).fill(false));
    setFlipped(Array(16).fill(true));
    setTimeout(() => {
      setFlipped(Array(16).fill(false));
    }, 1500);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (matched.length > 0 && matched.every(Boolean) && !gameOver) {
      setGameOver(true);
    }
  }, [matched, gameOver]);

  useEffect(() => {
    if (gameOver && user?.email) {
      axios.post('http://localhost:2089/game1/update', {
        email: user.email,
        time,
        flips: flipCount
      })
        .then(res => setStats(res.data.stats))
        .catch(err => console.error('Error posting stats:', err));
    }
  }, [gameOver, time, flipCount, user]);

  useEffect(() => {
    if (user?.email) {
      setLoadingStats(true);
      axios.get(`http://localhost:2089/game1/${user.email}`)
        .then(res => {
          setStats(res.data.stats);
          setLoadingStats(false);
        })
        .catch(err => {
          console.error('Error fetching stats:', err);
          setLoadingStats(false);
        });
    }
  }, [user]);

  const handleFlip = (index) => {
    if (lockBoard || flipped[index] || matched[index]) return;

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    if (firstIndex === null) {
      setFirstIndex(index);
    } else {
      setFlipCount((count) => count + 1);
      if (images[firstIndex] === images[index]) {
        setLockBoard(true);
        setTimeout(() => {
          const newMatched = [...matched];
          newMatched[firstIndex] = true;
          newMatched[index] = true;
          setMatched(newMatched);
          setLockBoard(false);
        }, 800);
        setFirstIndex(null);
      } else {
        setLockBoard(true);
        setTimeout(() => {
          const reset = [...flipped];
          reset[firstIndex] = false;
          reset[index] = false;
          setFlipped(reset);
          setFirstIndex(null);
          setLockBoard(false);
        }, 800);
      }
    }
  };

  const restart = () => window.location.reload();
  const goToGame3 = () => navigate('/game3');

  return (
    <div className="memory-wrapper">
      <div className="best-stats">
        <h4>🎯 Target</h4>
        {stats ? (
          <>
            <p>Best Time: {stats.bestTime !== null ? `${stats.bestTime}s` : 'N/A'}</p>
            <p>Best Flips: {stats.bestFlips !== null ? stats.bestFlips : 'N/A'}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <h1>🍉 Game 1: Fruit Memory Match</h1>
      <p className="memory-timer">⏱ Time: {time}s</p>
      <p className="memory-timer">🔄 Flips: {flipCount}</p>

      {!gameOver ? (
        <div className="memory-grid">
          {images.map((img, i) => (
            <button key={i} onClick={() => handleFlip(i)} className="memory-card">
              {matched[i] ? (
                <div className="memory-empty" />
              ) : (
                <img
                  src={
                    flipped[i]
                      ? img
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGkEUx4qTFqgMJYM2CmBUK0NplxCddOpD6-w&s"
                  }
                  alt={`card-${i}`}
                  className="memory-img"
                />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="memory-finished">
          <h2>🎉 Game Over!</h2>
          <h3>Your Time: {time}s</h3>
          <h3>Total Flips: {flipCount}</h3>
          <button onClick={restart} className="memory-restart">🔁 Play Again</button>
          <button onClick={goToGame3} className="memory-next">🎯 Go to Game 3</button>
        </div>
      )}

      {user?.email && gameOver && (
        <div className="stats-box">
          <h3>Your Fruit Match Stats</h3>
          {loadingStats ? (
            <p>Loading stats...</p>
          ) : stats ? (
            <ul>
              <li>Games Played: {stats.gamesPlayed}</li>
              <li>Best Time: {stats.bestTime !== null ? `${stats.bestTime}s` : 'N/A'}</li>
              <li>Best Flips: {stats.bestFlips !== null ? stats.bestFlips : 'N/A'}</li>
            </ul>
          ) : (
            <p>No stats available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Game1;
