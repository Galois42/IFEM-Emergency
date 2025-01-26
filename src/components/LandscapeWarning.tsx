import React from 'react';
import './LandscapeWarning.css';

interface LandscapeWarningProps {
  isLandscape: boolean;
}

const LandscapeWarning: React.FC<LandscapeWarningProps> = ({ isLandscape }) => {
  return (
    <div>
      {!isLandscape && (
        <div className='warning' style={{ width:`${window.innerWidth}` }}>
          Please rotate your device to landscape mode for the best experience!
        </div>
      )}
    </div>
  );
};

export default LandscapeWarning;
