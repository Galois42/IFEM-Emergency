import React, { useEffect, useState } from 'react';
import RedKnightWalk01 from '../assets/Knight_walk/red/Knight_walk_01.png';
import RedKnightWalk02 from '../assets/Knight_walk/red/Knight_walk_02.png';
import RedKnightWalk03 from '../assets/Knight_walk/red/Knight_walk_03.png';
import RedKnightWalk04 from '../assets/Knight_walk/red/Knight_walk_04.png';
import RedKnightWalk05 from '../assets/Knight_walk/red/Knight_walk_05.png';
import RedKnightWalk06 from '../assets/Knight_walk/red/Knight_walk_06.png';

import BlondKnightWalk01 from '../assets/Knight_walk/blond/Knight_walk_01.png';
import BlondKnightWalk02 from '../assets/Knight_walk/blond/Knight_walk_02.png';
import BlondKnightWalk03 from '../assets/Knight_walk/blond/Knight_walk_03.png';
import BlondKnightWalk04 from '../assets/Knight_walk/blond/Knight_walk_04.png';
import BlondKnightWalk05 from '../assets/Knight_walk/blond/Knight_walk_05.png';
import BlondKnightWalk06 from '../assets/Knight_walk/blond/Knight_walk_06.png';

import BlackKnightWalk01 from '../assets/Knight_walk/black/Knight_walk_01.png';
import BlackKnightWalk02 from '../assets/Knight_walk/black/Knight_walk_02.png';
import BlackKnightWalk03 from '../assets/Knight_walk/black/Knight_walk_03.png';
import BlackKnightWalk04 from '../assets/Knight_walk/black/Knight_walk_04.png';
import BlackKnightWalk05 from '../assets/Knight_walk/black/Knight_walk_05.png';
import BlackKnightWalk06 from '../assets/Knight_walk/black/Knight_walk_06.png';

import './Player.css';

const RedKnightFrames = [
  RedKnightWalk01, 
  RedKnightWalk02, 
  RedKnightWalk03, 
  RedKnightWalk04, 
  RedKnightWalk05, 
  RedKnightWalk06,
];

const BlondKnightFrames = [
  BlondKnightWalk01, 
  BlondKnightWalk02, 
  BlondKnightWalk03, 
  BlondKnightWalk04, 
  BlondKnightWalk05, 
  BlondKnightWalk06,
];

const BlackKnightFrames = [
  BlackKnightWalk01, 
  BlackKnightWalk02, 
  BlackKnightWalk03, 
  BlackKnightWalk04, 
  BlackKnightWalk05, 
  BlackKnightWalk06,
];

interface ChooseCharacterProps {
    onStartGame: (hairColor: string) => void;
}

const ChooseCharacter: React.FC<ChooseCharacterProps> = ({ onStartGame }) => {
    const [KnightFrames, setKnightFrames] = useState(RedKnightFrames);
    const [hairColor, setHairColor] = useState<string>('Red');
    const [currentFrame, setCurrentFrame] = useState<number>(0);
  
    const handleHairColorChange = (knightFrame: React.SetStateAction<string[]>, color: string) => {
      setKnightFrames(knightFrame);
      setHairColor(color);
    };

    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentFrame((currentFrame + 1) % 6);
        }, 150);
    
      return () => clearInterval(interval);
    }, [currentFrame]);
  
    return (
      <div className="player-container" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            <div>
                <img 
                  src={RedKnightWalk01} 
                  alt="Red Hair" 
                  style={{ cursor: 'pointer', width: '256px', height: '128px' }}
                  onClick={() => handleHairColorChange(RedKnightFrames, 'Red')} 
                />
                <img 
                  src={BlondKnightWalk01} 
                  alt="Blond Hair" 
                  style={{ cursor: 'pointer', width: '256px', height: '128px' }}
                  onClick={() => handleHairColorChange(BlondKnightFrames, 'Blond')} 
                />
                <img 
                  src={BlackKnightWalk01} 
                  alt="Black Hair" 
                  style={{ cursor: 'pointer', width: '256px', height: '128px' }}
                  onClick={() => handleHairColorChange(BlackKnightFrames, 'Black')} 
                />
            </div>
          
            <div style={{ position: 'relative', zIndex: 100 }}>
                <img src={KnightFrames[currentFrame]} alt="Knight Frame" />
            </div>
        </div>
  
        <button style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 200 }} onClick={() => onStartGame(hairColor)}>
          Start Game
        </button>
      </div>
    );
  };

export default ChooseCharacter;
