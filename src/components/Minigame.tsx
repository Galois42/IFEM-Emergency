import React, { useEffect, useRef, useState } from 'react';
import Player from './Player';
import Enemy from './Enemy';
import GameControls from './GameControls';
import './Minigame.css'

interface PlayerState {
  health: number;
  hairColor: string;
  position: number;
  currentFrame: number;
  isAttacking: boolean;
  isFlipped: boolean;
}

interface EnemyState {
  health: number;
  isDamaged: boolean;
  position: number;
}

interface MiniGameProps {
  hairColor: string;
  onEnd: (result: string) => void;
}

const MiniGame: React.FC<MiniGameProps> = ({ hairColor, onEnd }) => {
  const [player, setPlayer] = useState<PlayerState>({ health: 100, hairColor: hairColor, position: -100, currentFrame: 0, isAttacking: false, isFlipped: false });
  const [enemy, setEnemy] = useState<EnemyState>({ health: 100, isDamaged: false, position: window.innerWidth <= 900 ? window.innerWidth / 6 * 4 : window.innerWidth / 2 });
  const [attackIngFrame, setAttackingFrame] = useState<number>(0);


    useEffect(() => {
      const interval = setInterval(() => {
        if (player.isAttacking) {
          setPlayer((prevState) => ({
            ...prevState,
            currentFrame: 6 + attackIngFrame,
          }));
          setAttackingFrame(attackIngFrame+1);
          if (attackIngFrame === 5) {
            setPlayer((prevState) => ({
              ...prevState,
              isAttacking: false
            }));
            setAttackingFrame(0)
          }
        } else {
          setPlayer((prevState) => ({
            ...prevState,
            currentFrame: (prevState.currentFrame + 1) % 6,
          }));
        }
        
      }, 150);
  
      return () => clearInterval(interval);
    }, [player.isAttacking, attackIngFrame]);

  const handleOnEnd = (result: string) => {
    setPlayer({ health: 100, hairColor: hairColor, position: -100, currentFrame: 0, isAttacking: false, isFlipped: false });
    setEnemy({ health: 100, isDamaged: false, position: window.innerWidth <= 900 ? window.innerWidth / 6 * 4 : window.innerWidth / 2 });
    onEnd(result);
  }

  const handleAttack = () => {
    if (enemy.health - 10 <= 0) {
        handleOnEnd('Win');
    } 
    setPlayer((prevState) => ({
      ...prevState,
      isAttacking: true
    }));
    if (enemy.position > player.position && enemy.position - player.position <= 350 ||
        enemy.position <= player.position && player.position - enemy.position <= 50) {
      setTimeout(() => {
        setEnemy((prevState) => ({
          ...prevState,
          isDamaged: true,
          health: prevState.health - 10,
        }));

        setTimeout(() => {
          let newPos = 0;
          if (enemy.position >= 300) {
            newPos = Math.floor(Math.random() * (300 - 0 + 1)) + 0;
          } else {
            newPos = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
          }
          setEnemy((prevState) => ({
            ...prevState,
            isDamaged: false,
            position: newPos
          }));
        }, 300);
      }, 300);
    }
  };

  const handleHeal = () => {
    if (player.health + 10 <= 100) {
      setPlayer((prevState) => ({
        ...prevState,
        health: prevState.health + 10
      }));
    }
    
  };

  const handleMoveLeft = () => {
    console.log("move left");
    if (enemy.position >= player.position && Math.abs(enemy.position - (player.position - 50)) >= 90 && Math.abs(enemy.position - (player.position - 50)) <= 200) {
        if (player.health - 3 <= 0) {
            handleOnEnd('Lost');
        }
        setPlayer((prevState) => ({
          ...prevState,
          health: prevState.health - 3
        }));
      }
    if (player.position - 50 >= -100) {
      setPlayer((prevState) => ({
        ...prevState,
        position: prevState.position - 50,
        isFlipped: true
      }));
    }
  };
  
  const handleMoveRight = () => {
    console.log('move right');
    if (enemy.position >= player.position && Math.abs(enemy.position - (player.position + 50)) >= 90 && Math.abs(enemy.position - (player.position + 50)) <= 200) {
        if (player.health - 3 <= 0) {
            handleOnEnd('Lost');
        }
        setPlayer((prevState) => ({
          ...prevState,
          health: prevState.health - 5
        }));
      }
    if (player.position + 50 <= window.innerWidth - 512) {
      setPlayer((prevState) => ({
        ...prevState,
        position: prevState.position + 50,
        isFlipped: false
      }));
    }
  };
  
  return (
      <div className="minigame-container">
        <>
          <Player
            hairColor={hairColor}
            position={player.position}
            currentFrame={player.currentFrame}
            health={player.health}
            isFlipped={player.isFlipped}
          />
          <Enemy isDamaged={enemy.isDamaged} health={enemy.health} position={enemy.position} />
          <GameControls
            onAttack={handleAttack}
            onHeal={handleHeal}
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
          />
        </>
      </div>
  );
};

export default MiniGame;
