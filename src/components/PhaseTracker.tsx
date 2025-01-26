import React, { useState } from "react";
import './PhaseTracker.css';

const phases = [
  { phase: 'registered', label: 'Initial registration' },
  { phase: 'triaged', label: 'Triage assessment' },
  { phase: 'investigations_pending', label: 'Ordering Tests/imaging' },
  { phase: 'treatment', label: 'Receiving treatment' },
  { phase: 'admitted', label: 'Being admitted to hospital' },
  { phase: 'discharged', label: 'Discharge process' },
];

interface PhaseTrackerProps {
    currentPhase: string;
}

const PhaseTracker: React.FC<PhaseTrackerProps> = ({ currentPhase }) => {
//   const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0); // To track the current phase

  return (
    <div className="phase-tracker-container">
      {phases.map((phase, index) => {
        const isActive = phase.phase === currentPhase;

        return (
          <div
            key={phase.phase}
            className={`phase-circle ${isActive ? 'active' : ''}`}
            style={{
              transform: isActive ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 0.3s ease-in-out',
              zIndex: 10000
            }}
          >
            <p className="phase-label">{phase.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PhaseTracker;
