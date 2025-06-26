import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../App';
import '../styles/Game4.css';

import leftdot from '../assets/leftdot.png';
import leftone from '../assets/leftone.png';
import lefttwo from '../assets/lefttwo.png';
import leftthree from '../assets/leftthree.png';
import leftfour from '../assets/leftfour.png';
import leftfive from '../assets/leftfive.png';
import leftsix from '../assets/leftsix.png';

import robetdot from '../assets/robetdot.png';
import robetone from '../assets/robetone.png';
import robettwo from '../assets/robettwo.png';
import robetthree from '../assets/robetthree.png';
import robetfour from '../assets/robetfour.png';
import robetfive from '../assets/robetfive.png';
import robetsix from '../assets/robetsix.png';

import robetface from '../assets/robetface.png';
import humanface from '../assets/humanface.png';

let leftSymbols = [leftdot, leftone, lefttwo, leftthree, leftfour, leftfive, leftsix];
let rightSymbols = [robetdot, robetone, robettwo, robetthree, robetfour, robetfive, robetsix];
let runs = [0, 1, 2, 3, 4, 5, 6];
let rightHand = [robetdot, robetfive, robettwo];
let leftHand = [leftdot, leftfive, lefttwo];
let tossChoices = ['🪨', '📄', '✂️'];

const Game4 = () => {
  const { user } = useContext(LoginContext);

  const [playerSymbol, setPlayerSymbol] = useState(leftdot);
  const [computerSymbol, setComputerSymbol] = useState(robetdot);
  const [playerToss, setPlayerToss] = useState(leftdot);
  const [computerToss, setComputerToss] = useState(robetdot);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [tossMessage, setTossMessage] = useState('Waiting for toss');
  const [gameStarted, setGameStarted] = useState(false);
  const [showToss, setShowToss] = useState(true);
  const [chooseBatBowl, setChooseBatBowl] = useState(false);
  const [isPlayerBatting, setIsPlayerBatting] = useState(false);
  const [matchOver, setMatchOver] = useState(false);
  const [playerLocked, setPlayerLocked] = useState(false);
  const [computerLocked, setComputerLocked] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [commentry, setcommentry] = useState(null);
  const [lockToss, setLocktoss] = useState(false)
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setLoadingStats(true);
      axios.get(`http://localhost:2089/stats/game4/${user.email}`)
        .then((res) => {
          setStats(res.data.stats);
          setLoadingStats(false);
        })
        .catch((err) => {
          console.error('Error fetching stats:', err);
          setLoadingStats(false);
        });
    }
  }, [user]);

  useEffect(()=>{
    if(playerLocked)
    if(playerScore < computerScore) {
      setTimeout(() => {
        setGameStarted(false)
      setMatchOver(true)
      }, 1000);
      
    }
    if(computerLocked)
    if(playerScore > computerScore) {
      setTimeout(() => {
        setGameStarted(false)
      setMatchOver(true)
      }, 1000);
    }
  },[playerLocked,computerLocked,playerScore,computerScore])

  const resetGame = () => {
    setGameStarted(false);
    setShowToss(true);
    setMatchOver(false);
    setPlayerScore(0);
    setComputerScore(0);
    setTossMessage('Waiting for toss');
    setPlayerSymbol(leftdot);
    setComputerSymbol(robetdot);
    setPlayerToss(leftdot);
    setComputerToss(robetdot);
    setPlayerLocked(false);
    setComputerLocked(false);
    setResultMessage(null);
    setcommentry(null);
    setLocktoss(false);
  };

  const selectBatting = () => {
    setIsPlayerBatting(true);
    setShowToss(false);
    setGameStarted(true);
    setChooseBatBowl(false);
    setcommentry("Player won the toss and chose to bat");
  };

  const selectBowling = () => {
    setIsPlayerBatting(false);
    setShowToss(false);
    setGameStarted(true);
    setChooseBatBowl(false);
    setcommentry("Player won the toss and chose to bowl");
  };

  const handleToss = async (index) => {
    if(lockToss) return;
    for (let i = 0; i < leftHand.length; i++) {
      await sleep(50);
      setPlayerToss(leftHand[i]);
      setComputerToss(rightHand[i]);
    }
    const compChoice = Math.floor(Math.random() * 3);
    setComputerToss(rightHand[compChoice]);
    setPlayerToss(leftHand[index]);

    if (index === compChoice) {
      setTossMessage('Try again');
    } else {
      let winner;
      if ((index === 0 && compChoice === 2) || (index === 1 && compChoice === 0) || (index === 2 && compChoice === 1)) {
        winner = 'player';
        setLocktoss(true)
      } else {
        winner = 'computer';
      }

      if (winner === 'player') {
        setTossMessage('Player wins the toss');
        setChooseBatBowl(true);
      } else {
        const compBat = Math.round(Math.random());
        setIsPlayerBatting(compBat !== 1);
        setTossMessage(`Computer won the toss and chose to ${compBat ? 'bat' : 'bowl'}`);
        setcommentry(`Computer won the toss and chose to ${compBat ? 'bat' : 'bowl'}`);
        setTimeout(() => {
          setGameStarted(true);
          setShowToss(false);
        }, 1000);
      }
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handlePlay = async (index) => {
    if (matchOver) return;

    for (let i = 0; i < leftSymbols.length; i++) {
      await sleep(50);
      setPlayerSymbol(leftSymbols[i]);
      setComputerSymbol(rightSymbols[i]);
    }

    const compChoice = Math.floor(Math.random() * 7);
    setPlayerSymbol(leftSymbols[index]);
    setComputerSymbol(rightSymbols[compChoice]);

    if (isPlayerBatting) {
      if (playerScore === 'yet to Bat') setPlayerScore(0);
      if (index === compChoice) {
        setIsPlayerBatting(false);
        setPlayerLocked(true);
        if(computerLocked) {
         setcommentry(`Computer won by ${computerScore - playerScore}`);
        }
        else{
        setcommentry(`Player got out! Target for computer: ${playerScore + 1}`);
        }
      } else if (computerLocked) {
        const updatedScore = playerScore + (index === 0 ? compChoice : index);
        setPlayerScore(updatedScore);
        if (updatedScore > computerScore) {
          setPlayerLocked(true);
          setcommentry(`Player won by ${updatedScore - computerScore} runs`);
        } else {
          setcommentry(`Player needs ${computerScore - updatedScore} more to win`);
        }
      } else {
        const updatedScore = playerScore + (index === 0 ? compChoice : index);
        setPlayerScore(updatedScore);
        setcommentry(`Player scored ${updatedScore}`);
      }
    } else {
      if (computerScore === 'yet to Bat') setComputerScore(0);
      if (index === compChoice) {
        setIsPlayerBatting(true);
        setComputerLocked(true);
        if (playerLocked) {
          setcommentry(`Player won by ${playerScore - computerScore} runs`);
        } else {
          setcommentry(`Computer got out! Target for player: ${computerScore+1}`);
        }
      } else if (playerLocked) {
        const updatedScore = computerScore + (compChoice === 0 ? index : compChoice);
        setComputerScore(updatedScore);
        if (updatedScore > playerScore) {
          setComputerLocked(true);
          setcommentry(`Computer won by ${updatedScore - playerScore} runs`);
        } else {
          setcommentry(`Computer needs ${playerScore - updatedScore} more to win`);
        }
      } else {
        const updatedScore = computerScore + (compChoice === 0 ? index : compChoice);
        setComputerScore(updatedScore);
        setcommentry(`Computer scored ${updatedScore}`);
      }
    }
    if (matchOver) {
      console.log('playerLocked && computerLocked')
      setGameStarted(false);

      let result;
      if (playerScore > computerScore) {
        result = 'win';
        setResultMessage(`Player wins by ${playerScore - computerScore}`);
      } else if (computerScore > playerScore) {
        result = 'loss';
        setResultMessage(`Computer wins by ${computerScore - playerScore}`);
      } else {
        result = 'draw';
        setResultMessage('Match Draw');
      }

      if (result !== 'draw' && user?.email) {
        axios.post('http://localhost:2089/stats/game4/update', {
          email: user.email,
          result: result
        }).then((res) => {
          setStats(res.data.stats);
        }).catch((err) => {
          console.error('Failed to update stats:', err);
        });
      }
      console.log("end")
      return matchOver;
    }
  };

  return (
    <>
      <img className='robet' src={robetface} alt='robetface' />
      <img className='human' src={humanface} alt='humanface' />
      <div className="game-container">
        <h1>Hand Cricket</h1>
        <h2>{commentry}</h2>

        {gameStarted && (
          <>
            <div className="score">
              <div className="player-score">{playerScore}</div>
              <div className="computer-score">{computerScore}</div>
            </div>
            <div className="symble">
              <img src={playerSymbol} alt="player" />
              <img src={computerSymbol} alt="computer" />
            </div>
            <div className="runs">
              {runs.map((run, index) => (
                <button key={index} onClick={() => !matchOver && handlePlay(index)} disabled={matchOver}>
                  {run}
                </button>
              ))}
            </div>
          </>
        )}

        {showToss && (
          <div className="tossbox">
            <div className="tossName"><h1>Toss Time</h1></div>
            <div className="tossName"><h2>{tossMessage}</h2></div>
            <div className="tosses">
              <img className="tossimg" src={playerToss} alt="player toss" />
              <img className="tossimg" src={computerToss} alt="computer toss" />
            </div>
            <div className="tossbuttons">
              {tossChoices.map((choice, idx) => (
                <button key={idx} className="eachbattu" onClick={() => handleToss(idx)}>
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}

        {chooseBatBowl && (
          <div className="selectbutuu">
            <button className="sekectba" onClick={selectBatting}>Batting</button>
            <button className="sekectba" onClick={selectBowling}>Bowling</button>
          </div>
        )}

        {matchOver && (
          <div className="restart-box">
            <div>{resultMessage}</div>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}

        {user?.email && (
          <div className="stats-box">
            <h3>Your Hand Cricket Stats</h3>
            {loadingStats ? (
              <p>Loading stats...</p>
            ) : stats ? (
              <ul>
                <li>Games Played: {stats.gamesPlayed}</li>
                <li>Wins: {stats.gamesWon}</li>
                <li>Losses: {stats.gamesLost}</li>
                <li>Draw: {stats.gamesDraw}</li>
                <li>Win Rate: {stats.winRate}%</li>
              </ul>
            ) : (
              <p>No stats available.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Game4;
