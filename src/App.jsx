import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState('');
  const [matchStatus, setMatchStatus] = useState('');

  useEffect(() => {
    socket.on('match_found', (data) => {
      setMatchStatus(`Match found! Starting ${data.activity}`);
    });

    return () => socket.off('match_found');
  }, []);

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/patient/${patientId}`);
      const data = await response.json();
      setPatientData(data);
      socket.emit('register', data);
    } catch (err) {
      setError('Error fetching patient data');
    }
  };

  const findMatch = (activity) => {
    setMatchStatus('Looking for a match...');
    socket.emit('find_match', activity);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">ED Companion</h1>
      </header>

      {!patientData ? (
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
            Submit
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="input-container">
          <div style={{marginBottom: '20px'}}>
            <p>Triage Category: {patientData.triage_category}</p>
            <p>Wait Time: {patientData.time_elapsed} minutes</p>
            <p>Status: {patientData.status.current_phase}</p>
          </div>
          
          <div className="activity-grid">
            <button
              onClick={() => findMatch('chat')}
              className="button"
              style={{backgroundColor: '#0066cc'}}
            >
              Find Chat Partner
            </button>
            <button
              onClick={() => findMatch('game')}
              className="button"
              style={{backgroundColor: '#00cc66'}}
            >
              Play a Game
            </button>
            <button
              onClick={() => findMatch('music')}
              className="button"
              style={{backgroundColor: '#cc00cc'}}
            >
              Music Suggestions
            </button>
          </div>

          {matchStatus && (
            <p style={{textAlign: 'center', marginTop: '20px'}}>{matchStatus}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;