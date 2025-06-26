import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LoginContext } from '../App';
import "../styles/Profile.css";

const Profile = () => {
  const { user } = useContext(LoginContext);
  const [game1Stats, setGame1Stats] = useState(null);
  const [game2Stats, setGame2Stats] = useState(null);
  const [game3Stats, setGame3Stats] = useState(null);
  const [game4Stats, setGame4Stats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      const fetchStats = async () => {
        try {
          const [game1Res, game2Res, game3Res, game4Res] = await Promise.all([
            axios.get(`http://localhost:2089/game1/${user.email}`),
            axios.get(`http://localhost:2089/game2/${user.email}`),
            axios.get(`http://localhost:2089/game3/${user.email}`),
            axios.get(`http://localhost:2089/stats/game4/${user.email}`)
          ]);
          setGame1Stats(game1Res.data.stats);
          setGame2Stats(game2Res.data.stats);
          setGame3Stats(game3Res.data.stats);
          setGame4Stats(game4Res.data.stats);
        } catch (err) {
          console.error('Error fetching stats:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  return (
    <div className="profile-container">
      <h2 className="profile-heading">👤 Profile</h2>
      <p className="profile-email">Email: <strong>{user?.email}</strong></p>

      {loading ? (
        <p className="profile-loading">Loading stats...</p>
      ) : (
        <div className="stats-section">
          <div className="game-stats">
            <h3 className="game-title">🍉 Game 1: Fruit Match</h3>
            {game1Stats ? (
              <ul className="stats-list">
                <li>Games Played: {game1Stats.gamesPlayed}</li>
                <li>Best Time: {game1Stats.bestTime !== null ? `${game1Stats.bestTime}s` : 'N/A'}</li>
                <li>Best Flips: {game1Stats.bestFlips !== null ? game1Stats.bestFlips : 'N/A'}</li>
              </ul>
            ) : (
              <p>No Game 1 stats available.</p>
            )}
          </div>

          <div className="game-stats">
            <h3 className="game-title">🔢 Game 2: Number Series</h3>
            {game2Stats ? (
              <ul className="stats-list">
                <li>Games Played: {game2Stats.gamesPlayed}</li>
                <li>Best Time: {game2Stats.bestTime !== null ? `${game2Stats.bestTime}s` : 'N/A'}</li>
              </ul>
            ) : (
              <p>No Game 2 stats available.</p>
            )}
          </div>

          <div className="game-stats">
            <h3 className="game-title">🎮 Game 3: Food Match</h3>
            {game3Stats ? (
              <ul className="stats-list">
                <li>Games Played: {game3Stats.gamesPlayed}</li>
                <li>Best Time: {game3Stats.bestTime !== null ? `${game3Stats.bestTime}s` : 'N/A'}</li>
                <li>Best Flips: {game3Stats.bestFlips !== null ? game3Stats.bestFlips : 'N/A'}</li>
              </ul>
            ) : (
              <p>No Game 3 stats available.</p>
            )}
          </div>

          <div className="game-stats">
            <h3 className="game-title">🏏 Game 4: Hand Cricket</h3>
            {game4Stats ? (
              <ul className="stats-list">
                <li>Games Played: {game4Stats.gamesPlayed}</li>
                <li>Wins: {game4Stats.gamesWon}</li>
                <li>Losses: {game4Stats.gamesLost}</li>
                <li>Draws: {game4Stats.gamesDraw}</li>
                <li>Win Rate: {game4Stats.winRate}%</li>
              </ul>
            ) : (
              <p>No Game 4 stats available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
