import React, { useEffect, useState } from 'react';
import RedKnightWalk01 from '../assets/Knight_walk/red/Knight_walk_01.png';
import RedKnightWalk02 from '../assets/Knight_walk/red/Knight_walk_02.png';
import RedKnightWalk03 from '../assets/Knight_walk/red/Knight_walk_03.png';
import RedKnightWalk04 from '../assets/Knight_walk/red/Knight_walk_04.png';
import RedKnightWalk05 from '../assets/Knight_walk/red/Knight_walk_05.png';
import RedKnightWalk06 from '../assets/Knight_walk/red/Knight_walk_06.png';

import RedKnightAttack01 from '../assets/Knight_attack/red/Knight_attack_01.png';
import RedKnightAttack02 from '../assets/Knight_attack/red/Knight_attack_02.png';
import RedKnightAttack03 from '../assets/Knight_attack/red/Knight_attack_03.png';
import RedKnightAttack04 from '../assets/Knight_attack/red/Knight_attack_04.png';
import RedKnightAttack05 from '../assets/Knight_attack/red/Knight_attack_05.png';
import RedKnightAttack06 from '../assets/Knight_attack/red/Knight_attack_06.png';

import BlondKnightWalk01 from '../assets/Knight_walk/blond/Knight_walk_01.png';
import BlondKnightWalk02 from '../assets/Knight_walk/blond/Knight_walk_02.png';
import BlondKnightWalk03 from '../assets/Knight_walk/blond/Knight_walk_03.png';
import BlondKnightWalk04 from '../assets/Knight_walk/blond/Knight_walk_04.png';
import BlondKnightWalk05 from '../assets/Knight_walk/blond/Knight_walk_05.png';
import BlondKnightWalk06 from '../assets/Knight_walk/blond/Knight_walk_06.png';

import BlondKnightAttack01 from '../assets/Knight_attack/blond/Knight_attack_01.png';
import BlondKnightAttack02 from '../assets/Knight_attack/blond/Knight_attack_02.png';
import BlondKnightAttack03 from '../assets/Knight_attack/blond/Knight_attack_03.png';
import BlondKnightAttack04 from '../assets/Knight_attack/blond/Knight_attack_04.png';
import BlondKnightAttack05 from '../assets/Knight_attack/blond/Knight_attack_05.png';
import BlondKnightAttack06 from '../assets/Knight_attack/blond/Knight_attack_06.png';

import BlackKnightWalk01 from '../assets/Knight_walk/black/Knight_walk_01.png';
import BlackKnightWalk02 from '../assets/Knight_walk/black/Knight_walk_02.png';
import BlackKnightWalk03 from '../assets/Knight_walk/black/Knight_walk_03.png';
import BlackKnightWalk04 from '../assets/Knight_walk/black/Knight_walk_04.png';
import BlackKnightWalk05 from '../assets/Knight_walk/black/Knight_walk_05.png';
import BlackKnightWalk06 from '../assets/Knight_walk/black/Knight_walk_06.png';

import BlackKnightAttack01 from '../assets/Knight_attack/black/Knight_attack_01.png';
import BlackKnightAttack02 from '../assets/Knight_attack/black/Knight_attack_02.png';
import BlackKnightAttack03 from '../assets/Knight_attack/black/Knight_attack_03.png';
import BlackKnightAttack04 from '../assets/Knight_attack/black/Knight_attack_04.png';
import BlackKnightAttack05 from '../assets/Knight_attack/black/Knight_attack_05.png';
import BlackKnightAttack06 from '../assets/Knight_attack/black/Knight_attack_06.png';

import './Player.css';

const RedKnightFrames = [
  RedKnightWalk01, 
  RedKnightWalk02, 
  RedKnightWalk03, 
  RedKnightWalk04, 
  RedKnightWalk05, 
  RedKnightWalk06,
  RedKnightAttack01, 
  RedKnightAttack02, 
  RedKnightAttack03, 
  RedKnightAttack04, 
  RedKnightAttack05, 
  RedKnightAttack06,
];

const BlondKnightFrames = [
    BlondKnightWalk01, 
    BlondKnightWalk02, 
    BlondKnightWalk03, 
    BlondKnightWalk04, 
    BlondKnightWalk05, 
    BlondKnightWalk06,
    BlondKnightAttack01, 
    BlondKnightAttack02, 
    BlondKnightAttack03, 
    BlondKnightAttack04, 
    BlondKnightAttack05, 
    BlondKnightAttack06,
];

const BlackKnightFrames = [
    BlackKnightWalk01, 
    BlackKnightWalk02, 
    BlackKnightWalk03, 
    BlackKnightWalk04, 
    BlackKnightWalk05, 
    BlackKnightWalk06,
    BlackKnightAttack01, 
    BlackKnightAttack02, 
    BlackKnightAttack03, 
    BlackKnightAttack04, 
    BlackKnightAttack05, 
    BlackKnightAttack06,
];

// Define types for props
interface PlayerProps {
  hairColor: string;
  position: number;
  currentFrame: number;
  health: number;
  isFlipped: boolean;
}

const Player: React.FC<PlayerProps> = ({ hairColor, position, currentFrame, health, isFlipped }) => {
    const [knightFrames, setKnightFrames] = useState(RedKnightFrames);
    useEffect(() => {
        if (hairColor === 'Red') {
            setKnightFrames(RedKnightFrames);
        } else if (hairColor === 'Blond') {
            setKnightFrames(BlondKnightFrames);
        } else if (hairColor === 'Black') {
            setKnightFrames(BlackKnightFrames);
        }
    }, []);

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1000,
        }}
      >
        <span
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'black',
          }}
        >
          Health:
        </span>

        <div
          style={{
            position: 'relative',
            width: '200px',
            height: '20px',
            backgroundColor: '#ccc',
            border: '2px solid black',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${health}%`,
              height: '100%',
              backgroundColor: health > 50 ? 'green' : health > 20 ? 'orange' : 'red',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: `${position}px`,
          bottom: `${window.innerHeight / 4}px`,
          zIndex: 100,
        }}
      >
        <img 
            src={knightFrames[currentFrame]} 
            alt="Knight Frame" 
            className={isFlipped ? 'flipped' : 'default'} 
        />
      </div>
    </div>
  );
};

export default Player;
