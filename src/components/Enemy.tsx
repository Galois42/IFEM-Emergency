import React from 'react';
import enemyAnimation from '../assets/enemy_animation.gif';

interface EnemyProps {
  isDamaged: boolean;
  health: number;
  position: number;
}

const Enemy: React.FC<EnemyProps> = ({ isDamaged, health, position }) => {
  return (
    <div className="enemy-container">
      <div
        style={{
          position: 'absolute',
          bottom: `${(window.innerHeight / 6) + 175}px`,
          left: position,
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

      <img
        src={enemyAnimation}
        alt="Enemy Animation"
        style={{
          position: 'absolute',
          bottom: `${window.innerHeight / 6}px`,
          left: position,
          width: '200px',
          height: '200px',
          filter: isDamaged
            ? 'invert(1) sepia(1) saturate(5) hue-rotate(-50deg)'
            : 'none',
          transition: 'filter 0.3s ease',
        }}
      />
    </div>
  );
};

export default Enemy;
