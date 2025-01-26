import React from 'react';
import './GameControls.css';
import attack from '../assets/attack.png';
import heal from '../assets/heal.png';
import left from '../assets/left.png';
import right from '../assets/right.png';

interface GameControlsProps {
  onAttack: () => void;
  onHeal: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onAttack, onHeal, onMoveLeft, onMoveRight }) => {
  return (
    <div className="game-controls">
      <div className="move-controls left">
        <button onClick={onMoveLeft} className="black-button">
          <img src={left} alt="Move Left" className="button-icon" />
        </button>
        <button onClick={onMoveRight} className="black-button">
          <img src={right} alt="Move Right" className="button-icon" />
        </button>
      </div>

      <div className="action-controls right">
        <button onClick={onAttack} className="black-button">
          <img src={attack} alt="Attack" className="button-icon" />
        </button>
        <button onClick={onHeal} className="black-button">
          <img src={heal} alt="Heal" className="button-icon" />
        </button>
      </div>
    </div>
  );
};

export default GameControls;
