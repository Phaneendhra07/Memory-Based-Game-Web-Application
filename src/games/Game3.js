import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../App';
import '../styles/Game3.css';

const animalImages = [
  "https://img.freepik.com/free-photo/thinly-sliced-pepperoni-is-popular-pizza-topping-american-style-pizzerias-isolated-white-background-still-life_639032-229.jpg",
  "https://img.freepik.com/free-photo/hamburger-with-cheese-lettuce-tomatoes_1232-506.jpg",
  "https://img.freepik.com/free-photo/french-fries_1339-1402.jpg",
  "https://img.freepik.com/free-photo/cup-delicious-coffee_23-2148093796.jpg",
  "https://img.freepik.com/free-photo/spaghetti-with-vegetablesbroccolitomatoespeppers-isolated-white-background_123827-21345.jpg",
  "https://img.freepik.com/free-photo/white-rice-with-vegetables-black-bowl-isolated-white-background_123827-31928.jpg",
  "https://img.freepik.com/free-photo/close-up-fried-chicken-drumsticks_23-2148682835.jpg",
  "https://img.freepik.com/free-photo/sandwich_1339-1108.jpg",
  "https://img.freepik.com/free-photo/dumpling-bun-isolated_1203-3174.jpg",
  "https://img.freepik.com/free-photo/yakitori-chicken-stick-close-up_181624-61208.jpg"
];

// Utility to shuffle an array
const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const Game3 = () => {
  const { user } = useContext(LoginContext);

  const [images, setImages] = useState([]);
  const [flipped, setFlipped] = useState(Array(20).fill(false));
  const [matched, setMatched] = useState(Array(20).fill(false));
  const [firstIndex, setFirstIndex] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const initializeGame = () => {
    const duplicated = [...animalImages.slice(0, 10), ...animalImages.slice(0, 10)];
    const shuffled = shuffleArray(duplicated);
    setImages(shuffled);
    setFlipped(Array(20).fill(false));
    setMatched(Array(20).fill(false));
    setFirstIndex(null);
    setLockBoard(false);
    setTime(0);
    setFlipCount(0);
    setGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) {
        setTime((t) => t + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (matched.every(Boolean) && matched.length > 0 && !gameOver) {
      setGameOver(true);
    }
  }, [matched, gameOver]);

  useEffect(() => {
    if (gameOver && user?.email) {
      axios.post('http://localhost:2089/game3/update', {
        email: user.email,
        time,
        flips: flipCount,
      })
        .then((res) => {
          setStats(res.data.stats);
        })
        .catch((err) => console.error('Error posting stats:', err));
    }
  }, [gameOver, user?.email, time, flipCount]);

  useEffect(() => {
    if (user?.email) {
      setLoadingStats(true);
      axios.get(`http://localhost:2089/game3/${user.email}`)
        .then((res) => {
          setStats(res.data.stats);
          setLoadingStats(false);
        })
        .catch((err) => {
          console.error('Error fetching stats:', err);
          setLoadingStats(false);
        });
    }
  }, [user?.email]);

  const handleFlip = (index) => {
    if (lockBoard || flipped[index] || matched[index]) return;

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    if (firstIndex === null) {
      setFirstIndex(index);
    } else {
      setFlipCount((prev) => prev + 1);
      if (images[firstIndex] === images[index]) {
        const newMatched = [...matched];
        newMatched[firstIndex] = true;
        newMatched[index] = true;
        setMatched(newMatched);
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
        }, 600);
      }
    }
  };

  const restart = () => {
    initializeGame();
    if (user?.email) {
      setLoadingStats(true);
      axios.get(`http://localhost:2089/game3/${user.email}`)
        .then((res) => {
          setStats(res.data.stats);
          setLoadingStats(false);
        })
        .catch((err) => {
          console.error('Error refreshing stats:', err);
          setLoadingStats(false);
        });
    }
  };

  return (
    <div className="memory-wrapper">
      <div className="best-stats">
        <h4>🎯 Target</h4>
        {stats ? (
          <>
            <p>Fastest Time: {stats.bestTime !== null ? `${stats.bestTime}s` : 'N/A'}</p>
            <p>Fewest Flips: {stats.bestFlips !== null ? stats.bestFlips : 'N/A'}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <h1>🍔 Game 3: Food Match (Hard Mode)</h1>
      <p className="memory-timer">⏱ Time: {time}s</p>
      <p className="memory-timer">🔄 Flips: {flipCount}</p>

      {!gameOver ? (
        <div className="animal-grid-4x5">
          {images.map((img, i) => (
            <button key={i} onClick={() => handleFlip(i)} className="memory-card">
              <img
                src={
                  flipped[i] || matched[i]
                    ? img
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGkEUx4qTFqgMJYM2CmBUK0NplxCddOpD6-w&s"
                }
                alt={`card-${i}`}
                className="memory-img"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="memory-finished">
          <h2>🎉 Game Over!</h2>
          <h3>Your Time: {time}s</h3>
          <h3>Total Flips: {flipCount}</h3>
          <button onClick={restart} className="memory-restart">🔁 Try Again</button>
        </div>
      )}

      {user?.email && gameOver && (
        <div className="stats-box">
          <h3>Your Food Match Stats</h3>
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

export default Game3;
