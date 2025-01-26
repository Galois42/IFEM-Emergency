import React, { useEffect, useState } from 'react';

interface EndPageProps {
  onExit: () => void;
  onRestart: () => void;
  result: string;
}

const EndPage: React.FC<EndPageProps> = ({ onExit, onRestart, result }) => {
    const [endTitle, setEndTitle] = useState<string>('');
    const [endMessage, setEndMessage] = useState<string>('');

    useEffect(() => {
        if (result === 'Win') {
            setEndTitle('You Win!');
            setEndMessage('Congratulations!');
        } else if (result === 'Lost') {
            setEndTitle('You Lost...');
            setEndMessage('Better luck next time.');
        }
    }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        color: '#333',
      }}
    >
      <h1>{endTitle}</h1>
      <div
        style={{
          marginBottom: '20px',
          fontSize: '24px',
          color: 'green',
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
