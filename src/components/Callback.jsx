import React, { useEffect, useState } from 'react';
import './Callback.css'; 

// --- MOCK DATA ---
const mockDataScenarios = [
  { moodDescription: "Energetic & Joyful", avgValence: 0.82, avgEnergy: 0.76 },
  { moodDescription: "Somber & Introspective", avgValence: 0.21, avgEnergy: 0.33 },
  { moodDescription: "Tense & Agitated", avgValence: 0.35, avgEnergy: 0.81 },
  { moodDescription: "Calm & Serene", avgValence: 0.75, avgEnergy: 0.25 }
];

const Callback = ({ onComplete }) => {
  const [status, setStatus] = useState('Authenticating...');

  useEffect(() => {

    const simulateAuthentication = () => {

      setTimeout(() => {
        setStatus('Fetching recent listening data...');
        
        setTimeout(() => {
          // *** DEMO LOGIC: 50% chance of success, 50% chance of failure ***
          if (Math.random() > 0.5) {
            // SUCCESS
            const randomScenario = mockDataScenarios[Math.floor(Math.random() * mockDataScenarios.length)];
            onComplete(randomScenario, null);
          } else {
            // FAILURE
            onComplete(null, "Spotify permissions were denied or the token expired. Please try again.");
          }
        }, 2000);

      }, 1500); 
    };

    simulateAuthentication();
  }, [onComplete]);

  return (
    <div className="callback-view">
      <div className="spinner"></div>
      <p className="status-text">{status}</p>
    </div>
  );
};

export default Callback;