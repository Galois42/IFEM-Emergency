import React, { useEffect, useState } from 'react';

interface EndPageProps {
  onExit: () => void;
  onRestart: () => void;
  result: string;
}

const EndPage: React.FC<EndPageProps> = ({ onExit, onRestart, result }) => {
    const [endTitle, setEndTitle] = useState<string>(result === 'Win' ? 'You Win!' : 'You Lost...');
    const [endMessage, setEndMessage] = useState<string>(result === 'Win' ? 'Congratulations!' : 'Better luck next time.');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        width: '70vw',
        backgroundColor: '#f8f8f8',
        color: 'black',
        borderRadius: '50px',
      }}
    >
      <h1>{endTitle}</h1>
      <div
        style={{
          marginBottom: '20px',
          fontSize: '24px',
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        {endMessage}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <button
          onClick={onExit}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff5733',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Exit
        </button>
        <button
          onClick={onRestart}
          style={{
            padding: '10px 20px',
            backgroundColor: '#33c3ff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default EndPage;
