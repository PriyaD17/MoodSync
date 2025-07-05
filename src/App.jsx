import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import ResultsView from './components/ResultsView';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
  
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const mood = params.get('mood');
    const valence = params.get('valence');
    const energy = params.get('energy');

    if (error) {
      setAuthError(error);
    } else if (mood && valence && energy) {
      setAnalysisResult({
        moodDescription: mood,
        avgValence: parseFloat(valence),
        avgEnergy: parseFloat(energy),
      });
    }
    
  
    window.history.replaceState({}, document.title, "/");

  }, []);

  const handleTryAgain = () => {
    setAnalysisResult(null);
    setAuthError(null);
  };

  if (analysisResult) {
    return <ResultsView analysis={analysisResult} onTryAgain={handleTryAgain} />;
  }

  if (authError) {
    return (
      <ResultsView 
        analysis={{ moodDescription: "Authentication Failed", avgValence: 0, avgEnergy: 0 }} 
        error={authError}
        onTryAgain={handleTryAgain} 
      />
    );
  }

  return <LoginView />;
}

export default App;