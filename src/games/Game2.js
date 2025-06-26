import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import '../styles/Game2.css';

const initialNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Game2 = ({ user }) => {
  const [numbers, setNumbers] = useState([...initialNumbers]);
  const [visible, setVisible] = useState(Array(numbers.length).fill(false));
  const [series, setSeries] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [find, setFind] = useState(1);
  const [msg, setMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [lock, setLock] = useState(false);
  const [target, setTarget] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);


  const show = (level) => {
    let rotat = [...numbers];
    for (let i = 0; i < 5; i++) {
      const k = Math.floor(Math.random() * rotat.length);
      rotat = [...rotat.slice(k).reverse(), ...rotat.slice(0, k)];
    }
    setNumbers(rotat);

    let temp = Array(rotat.length).fill(false);
    for (let i = 1; i <= level; i++) {
      const idx = rotat.indexOf(i);
      if (idx !== -1) temp[idx] = true;
    }

    setVisible(temp);
    setLock(true);
    setTimeout(() => {
      setVisible(Array(rotat.length).fill(false));
      setFind(1);
      setLock(false);
    }, 1000);
  };

  useEffect(() => {
    if (gameOver) {
      setMsg('Game Over!');
      return;
    }

    setMsg('');
    show(series);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [series, gameOver]);

  useEffect(() => {
    axios.get('http://localhost:2089/api/game/fastest/Game2')
      .then(res => {
        if (res.data.fastest) {
          setTarget(res.data.fastest.time);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (find > numbers.length) {
      setGameOver(true);
      axios.post('http://localhost:2089/api/game/score', {
        userId: user?._id,
        game: 'Game2',
        time: 60 - timeLeft
      }).catch(console.error);

      // Fetch updated stats
      if (user?.email) {
        setLoadingStats(true);
        axios.get(`http://localhost:2089/game2/${user.email}`)
          .then((res) => {
            setStats(res.data.stats);
            setLoadingStats(false);
          })
          .catch((err) => {
            console.error('Error fetching stats:', err);
            setLoadingStats(false);
          });
      }
    }
  }, [find]);

  const handleGuess = (index) => {
    if (visible[index] || gameOver || lock) return;

    if (numbers[index] === find) {
      const updated = [...visible];
      updated[index] = true;
      setVisible(updated);

      if (find < series) {
        setFind(find + 1);
      } else {
        setLock(true);
        setTimeout(() => {
          setSeries(series + 1);
          setLock(false);
        }, 1000);
      }
    } else {
      const updated = [...visible];
      updated[index] = true;
      setVisible(updated);
      setLock(true);
      setTimeout(() => {
        setSeries(1);
        setFind(1);
        setVisible(Array(numbers.length).fill(false));
        setLock(false);
      }, 800);
    }
  };

  const restart = () => {
    setGameOver(false);
    setSeries(1);
    setFind(1);
    setTimeLeft(60);
    setVisible(Array(numbers.length).fill(false));
    setMsg('');
    setStats(null);
  };

  return (
    <div className="game2-container">
      <div className="target-box">
        <h4>🎯 Target</h4>
        {target !== null ? <p>Fastest Time: {target}s</p> : <p>Loading...</p>}
      </div>

      <h1 className="header2">🧠 Game 2: Number Series</h1>
      <h3 className="message">{msg}</h3>
      <h3 className="timer">⏳ Time Left: {timeLeft}s</h3>

      <div className="grid">
        {numbers.map((num, index) => (
          <button
            className='box'
            key={index}
            onClick={() => handleGuess(index)}
            disabled={gameOver}
          >
            {visible[index] ? num : ''}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="controls">
          <button onClick={restart}>Play Again</button>
          <button>
            <NavLink to="/game1">Go to Game 1</NavLink>
          </button>
        </div>
      )}

      {gameOver && user?.email && (
        <div className="stats-box">
          <h3>Your Number Series Stats</h3>
          {loadingStats ? (
            <p>Loading stats...</p>
          ) : stats ? (
            <ul>
              <li>Games Played: {stats.gamesPlayed}</li>
              <li>Best Time: {stats.bestTime !== null ? `${stats.bestTime}s` : 'N/A'}</li>
            </ul>
          ) : (
            <p>No stats available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Game2;
