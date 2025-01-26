import React, { useState, useEffect } from 'react';
import MiniGame from './components/Minigame';
import LandscapeWarning from './components/LandscapeWarning';
import ChooseCharacter from './components/ChooseCharacter';
import EndPage from './components/EndPage';
import Chat from './components/Chat';
import DynamicSyringe from './components/DynamicSyringe';
import BlackMenu from './assets/black_menu.png';
import WhiteMenu from './assets/white_menu.png';
import io from 'socket.io-client';
import './App.css';
import BreathingGuide from './components/BreathingGuide';
import PhaseTracker from './components/PhaseTracker';
import { Heart } from 'lucide-react';
import BackgroundDefault from './assets/hospital_background2.jpg';
import CombatBackground from './assets/hospital_background.jpg';

const App = () => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const [matchStatus, setMatchStatus] = useState('');
  const [playingGame, setPlayingGame] = useState(false);
  const [chatting, setChatting] = useState(false);
  const [breathingExercice, setBreathingExercice] = useState(false);
  const [phaseTracker, setPhaseTracker] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const [displayMainPage, setDisplayMainPage] = useState(true);
  const [backgroundUrl, setBackgroundUrl] = useState(BackgroundDefault)

  const [isStarted, setIsStarted] = useState(false);
  const [hairColor, setHairColor] = useState('Red');
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [isEnd, setIsEnd] = useState(false);
  const [endResult, setEndResult] = useState('');
  const [isVisible, setIsVisible] = useState(false);
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
    setBackgroundUrl(BackgroundDefault);
  }

  const onRestart = () => {
    setIsEnd(false);
    setIsStarted(false);
  }

  const handleBurgerClick = () => {
    console.log("openMenu");
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:5000");

    // Listen for match found event
    socketInstance.on("match_found", (data) => {
      setMatchStatus('');
      
      if (data.activity === 'chat') {
        setChatting(true);
        setMatchId(data.matchId);
        setPlayingGame(false);
        setBreathingExercice(false);
        setIsVisible(false);
        setBackgroundUrl(BackgroundDefault);
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
    setAppFeatures();
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

  const setAppFeatures = () => {
    setDisplayMainPage(false);
  }

  const findMatch = (activity) => {
    setMatchStatus('Looking for a match...');
    console.log(activity);
    setBreathingExercice(false);
    setChatting(false);
    setPlayingGame(false);
    setIsVisible(false);
    setBackgroundUrl(BackgroundDefault);
    socket.emit('find_match', activity);
  };

  const breathingGuide = () => {
    setBreathingExercice(true);
    setChatting(false);
    setPlayingGame(false);
    setIsVisible(false);
    setMatchStatus('');
    setBackgroundUrl(BackgroundDefault);
  }

  const playGame = () => {
    setPlayingGame(true);
    setMatchStatus('');
    setChatting(false);
    setBreathingExercice(false);
    setIsVisible(false);
    setBackgroundUrl(CombatBackground)
  }

  const togglePhaseTracker = () => {
    console.log('toggle')
    setPhaseTracker(!phaseTracker);
    console.log(patientData);
  }

  return (
    <div className='screen-container'>
      <div className='menu'>
        <img src={isVisible ? WhiteMenu : BlackMenu} onClick={handleBurgerClick}></img>
      </div>
      <div className="left-container" 
      style={{
        display: isVisible ? 'block' : 'none', 
        position: 'fixed',  // Use fixed to keep the bar in a fixed position on the screen
        top: 0, 
        left: 0, 
        height: '100%', 
        width: '400px', // Adjust width as needed
        zIndex: 1000 // Ensure it's above other content
      }}>
        <header className="header">
          <h1 className="title">SerenED</h1>
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
              <DynamicSyringe patientData={patientData} togglePhaseTracker={togglePhaseTracker} />
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
                className="button play-game-button"
              >
                Play a Game
              </button>
              <button
                onClick={() => breathingGuide()}
                className="button breathing-exercice-button"
                
              >
                Breathing Exercices
              </button>
            </div>        
          </>
        )}
        </div>

      <div className="app-container" style={{ backgroundImage: `url(${backgroundUrl})`}}>
        <div 
          className='main-page-display' 
          style={{ 
            all: displayMainPage ? '' : 'unset'
          }}>
          <div>
            <div className="main-header" style={{ display: displayMainPage ? 'block' : 'none' }}>
              <div className="heart-logo" style={{ display: displayMainPage ? 'block' : 'none' }}>
                <Heart size={48} fill="#ff6b6b" stroke="#ff6b6b" />
              </div>
              <h1 className="title" style={{ display: displayMainPage ? 'block' : 'none' }}>SerenED</h1>
            </div>
          </div>
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
      {breathingExercice &&
        <BreathingGuide />
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
      {phaseTracker &&
        <PhaseTracker currentPhase={patientData.status.current_phase} />
      }
    </div>
    </div>
    </div>
  );
}

// pale pink #ffb3b3
// red #ff4b6b

export default App;