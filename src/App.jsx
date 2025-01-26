import React, { useState, useEffect } from 'react';
import MiniGame from './components/Minigame';
import LandscapeWarning from './components/LandscapeWarning';
import ChooseCharacter from './components/ChooseCharacter';
import EndPage from './components/EndPage';
import Chat from './components/Chat';
import DynamicSyringe from './components/DynamicSyringe';
import Menu from './assets/menu.png';
import io from 'socket.io-client';
import './App.css';

const App = () => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const [matchStatus, setMatchStatus] = useState('');
  const [playingGame, setPlayingGame] = useState(false);
  const [chatting, setChatting] = useState(false);
  const [matchId, setMatchId] = useState(null);

  const [isStarted, setIsStarted] = useState(false);
  const [hairColor, setHairColor] = useState('Red');
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [isEnd, setIsEnd] = useState(false);
  const [endResult, setEndResult] = useState('');
  const [isVisible, setIsVisible] = useState(window.innerWidth >= 900);
  const [socket, setSocket] = useState(null);
  
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    useEffect(() => {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
  const onStartGame = (hairColor) => {
    setIsStarted(true);
    setHairColor(hairColor);
  };

  const onEnd = (result) => {
    setIsEnd(true);
    setEndResult(result);
  }

  const onExit = () => {
    setPlayingGame(false);
    setIsVisible(true);
    setIsEnd(false);
    setIsStarted(false);
  }

  const onRestart = () => {
    setIsEnd(false);
    setIsStarted(false);
  }

  const handleBurgerClick = () => {
    if (isLandscape) {
      console.log("openMenu");
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:5000");

    // Listen for match found event
    socketInstance.on("match_found", (data) => {
      setMatchStatus('');
      if (data.activity === 'chat') {
        setChatting(true);
        setMatchId(data.matchId);
      }
    });

    socketInstance.on('patient_update', (updatedData) => {
      setPatientData(updatedData);
    });

    // Save the socket instance
    setSocket(socketInstance);
    // console.log(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patient/${patientId}`);
      if (!response.ok) {
        console.log(response);
        throw new Error('Patient not found');
      }
      const data = await response.json();
      setPatientData(data);
      socket.emit('register', data);
      setError('');
    } catch (error) {
      setError(error.message || 'Error fetching patient data');
      setPatientData(null);
    }
  };

  const findMatch = (activity) => {
    setMatchStatus('Looking for a match...');
    console.log(activity);
    socket.emit('find_match', activity);
  };

  const playGame = () => {
    console.log('play game');
    setPlayingGame(true);
    if (window.innerWidth <= 900) {
      setIsVisible(false);
    }
  }

  return (
    <div className='screen-container'>
      <div className='menu'>
        <img src={Menu} onClick={handleBurgerClick}></img>
      </div>
      <div className="left-container" style={{ display: isVisible ? 'block' : 'none' }}>
        <header className="header">
          <h1 className="title">ED Companion</h1>
        </header>

        <div className="input-container">
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="input-field"
        />
        <button 
          onClick={fetchPatientData}
          className="button"
        >
          {patientData ? 'Refresh' : 'Submit'}
        </button>
        {error && <p className="error">{error}</p>}
        </div>

        {patientData && (
          <>
            <div className="input-container">
              <DynamicSyringe patientData={patientData} />
            </div>        

            <div className="activity-grid">
              <button
                onClick={() => findMatch('chat')}
                className="button"
                style={{ backgroundColor: '#0066cc' }}
              >
                Find Chat Partner
              </button>
              <button
                onClick={() => playGame()}
                className="button"
                style={{ backgroundColor: '#00cc66' }}
              >
                Play a Game
              </button>
              <button
                onClick={() => findMatch('music')}
                className="button"
                style={{ backgroundColor: '#cc00cc' }}
              >
                Music Suggestions
              </button>
            </div>        
          </>
        )}
        </div>

      <div className="app-container">
      {playingGame &&
        (
          <div>
            <LandscapeWarning isLandscape={isLandscape} />
            {isLandscape && (
              isEnd ? (
                <EndPage onExit={onExit} onRestart={onRestart} result={endResult} />
              ) : isStarted ? (
                <MiniGame hairColor={hairColor} onEnd={onEnd} />
              ) : (
                <ChooseCharacter onStartGame={onStartGame} />
              )
            )}
          </div>
        )
      }
      {chatting &&
        <Chat socket={socket} matchId={matchId} />
      }
      {matchStatus && (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#f9f9f9",
            color: "#333",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            fontSize: "16px",
            fontWeight: "bold",
            maxWidth: "400px",
            margin: "20px auto",
          }}
        >
          {matchStatus}
        </p>
      )}
    </div>
    </div>
  );
}

export default App;