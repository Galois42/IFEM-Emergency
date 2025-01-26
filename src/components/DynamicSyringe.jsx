import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const DynamicSyringe = ({ patientData }) => {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [liquidWobble, setLiquidWobble] = useState(0);
  const [currentWaitTime, setCurrentWaitTime] = useState(0);

  const ESTIMATED_WAIT_TIMES = {
    1: 30,     // Immediate (15 min)
    2: 60,     // Emergency (30 min)
    3: 120,     // Urgent (60 min)
    4: 240,    // Semi-urgent (120 min)
    5: 480     // Non-urgent (240 min)
  };

  useEffect(() => {
    if (patientData) {
      setCurrentWaitTime(patientData.time_elapsed);
      const timer = setInterval(() => {
        setCurrentWaitTime(prev => prev + 1/60);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [patientData?.time_elapsed]);

  const calculateFillPercentage = useCallback(() => {
    if (!patientData) return 0;
    const maxWait = ESTIMATED_WAIT_TIMES[patientData.triage_category] || 60;
    const waitPercent = (currentWaitTime / maxWait) * 100;
    return Math.min(waitPercent, 100);
  }, [patientData, currentWaitTime]);

  useEffect(() => {
    if (patientData) {
      const newFill = calculateFillPercentage();
      setFillPercentage(newFill);
      setLiquidWobble(prev => prev + 1);
    }
  }, [currentWaitTime, calculateFillPercentage]);

  const getFluidColor = () => {
    if (!patientData) return '#60A5FA';
    
    const estimatedWait = ESTIMATED_WAIT_TIMES[patientData.triage_category];
    if (currentWaitTime > estimatedWait) {
      return '#EF4444'; // Red when over estimated time
    }

    const phase = patientData?.status?.current_phase;
    switch (phase) {
      case 'registered': return '#60A5FA';
      case 'triaged': return '#818CF8';
      case 'investigations_pending': return '#F59E0B';
      case 'treatment': return '#10B981';
      case 'discharged': return '#6EE7B7';
      case 'admitted': return '#EC4899';
      default: return '#60A5FA';
    }
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes * 60) % 60);
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    } else {
      return `${mins}m ${secs}s`;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.current_phase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const fluidHeight = 200 - (fillPercentage * 1.6);
  const plungerHeight = fluidHeight - 20;

  const getWavePath = () => {
    const amplitude = Math.min(fillPercentage / 10, 5);
    const frequency = liquidWobble / 2;
    
    return `
      M102,198 
      C150,${198 + amplitude * Math.sin(frequency)} 
        250,${198 - amplitude * Math.sin(frequency)} 
        298,198 
      L298,${fluidHeight} 
      C250,${fluidHeight + amplitude * Math.sin(frequency)} 
        150,${fluidHeight - amplitude * Math.sin(frequency)} 
        102,${fluidHeight} Z
    `;
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8">
      <div className="relative">
        <svg viewBox="0 0 400 250" className="w-full h-full">
          <path
            d="M100,200 L300,200 L300,50 C300,45 295,40 290,40 L110,40 C105,40 100,45 100,50 Z"
            fill="#f0f0f0"
            stroke="#666"
            strokeWidth="2"
          />
          
          <path
            d={getWavePath()}
            fill={getFluidColor()}
            className="transition-colors duration-1000"
            opacity="0.8"
          >
            <animate
              attributeName="d"
              dur="3s"
              repeatCount="indefinite"
              values={`
                ${getWavePath()};
                ${getWavePath().replace(/198/g, '196').replace(/fluidHeight/g, String(fluidHeight + 2))};
                ${getWavePath()}
              `}
            />
          </path>
          
          <g 
            transform={`translate(0,${plungerHeight})`} 
            className="transition-transform duration-1000 ease-in-out"
          >
            <rect x="95" y="0" width="210" height="10" fill="#999" rx="2" />
            <rect x="190" y="-20" width="20" height="40" fill="#777" />
          </g>
          
          <path
            d="M290,40 L310,20 L315,15 L320,20 L300,40"
            fill="#ccc"
            stroke="#999"
            strokeWidth="1"
          />
        </svg>

        <div className="absolute bottom-0 left-0 right-0 text-center text-gray-200">
          <p className="text-lg font-semibold mb-1">
            {formatStatus(patientData?.status)}
          </p>
          <p className="text-sm">
            Wait Time: {formatTime(currentWaitTime)}
            {` / Est. ${ESTIMATED_WAIT_TIMES[patientData?.triage_category]} min`}
          </p>
          <p className="text-xs">
            Queue Position: {patientData?.queue_position?.global || '-'}
            {patientData?.queue_position?.category && 
              ` (Category ${patientData.queue_position.category})`}
          </p>
          {currentWaitTime > ESTIMATED_WAIT_TIMES[patientData?.triage_category] && (
            <p className="text-red-500 text-xs mt-1">
              ⚠️ Wait time exceeded estimate
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

DynamicSyringe.propTypes = {
  patientData: PropTypes.shape({
    triage_category: PropTypes.number,
    time_elapsed: PropTypes.number,
    status: PropTypes.shape({
      current_phase: PropTypes.string,
      investigations: PropTypes.object
    }),
    queue_position: PropTypes.shape({
      category: PropTypes.number,
      global: PropTypes.number
    })
  })
};

export default DynamicSyringe;