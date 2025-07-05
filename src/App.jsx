import React, { useState } from 'react';
import LoginView from './components/LoginView';
import ResultsView from './components/ResultsView';

const mockDataScenarios = [
  { moodDescription: "Energetic & Joyful", avgValence: 0.82, avgEnergy: 0.76 },
  { moodDescription: "Somber & Introspective", avgValence: 0.21, avgEnergy: 0.33 },
  { moodDescription: "Tense & Agitated", avgValence: 0.35, avgEnergy: 0.81 },
  { moodDescription: "Calm & Serene", avgValence: 0.75, avgEnergy: 0.25 }
];

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    

    setTimeout(() => {
  
      const randomScenario = mockDataScenarios[Math.floor(Math.random() * mockDataScenarios.length)];
      setAnalysisResult(randomScenario);
      setIsLoading(false);
    }, 1500);
  };

  const handleTryAgain = () => {
   
    handleLogin();
  };
  
  return (
    <div className="App">
      {!analysisResult ? (
        <LoginView onLogin={Object.assign(handleLogin, { loading: isLoading })} />
      ) : (
        <ResultsView analysis={analysisResult} onTryAgain={handleTryAgain} />
      )}
    </div>
  );
}

export default App;