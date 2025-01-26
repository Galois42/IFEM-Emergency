import React, { useState, useEffect, useRef } from "react";
import './BreathingGuide.css';
import meditationMusic from '../assets/meditation_music.mp3';

const BreathingGuide: React.FC = () => {
  const [phase, setPhase] = useState<"Breathe In" | "Hold" | "Breathe Out">("Breathe In");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timer = [
    'Breathe In', '2', '3', '4', 
    'Hold', '2', '3', '4', '5', '6', '7', 
    'Breathe Out', '2', '3', '4', '5', '6', '7', '8'
    ];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
        if (time + 1 === 4) {
            setPhase('Hold');
        } else if (time + 1 === 11) {
            setPhase('Breathe Out') 
        } else if (time + 1 === 19) {
            setPhase('Breathe In');
        }
      setTime((time + 1) % 19);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, isRunning]);

  const handleStartStop = () => {
    if (isRunning) {
      setTime(0);
      setPhase("Breathe In");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="breathing-container">
      <h1 className="breathing-title">Guided Breathing</h1>
      <div
        className={`breathing-circle`}
        style={{
          transform: `scale(${
            phase === "Breathe In"
              ? 1.5 + (time / 4) * 0.5
              : phase === "Hold"
              ? 2
              : 2 - (time / 20) * 0.5
          })`,
          transition: "transform 1s ease-in-out",
        }}
      >
        <p className="breathing-timer">{timer[time]}</p>
      </div>
      <p className="breathing-instruction">{phase}</p>
      <button className="start-button" onClick={handleStartStop}>
        {isRunning ? "Stop Meditation" : "Start Meditation"}
      </button>
      <audio ref={audioRef} src={meditationMusic} loop />
    </div>
  );
};

export default BreathingGuide;
