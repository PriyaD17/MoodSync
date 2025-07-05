import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import ResultsView from './components/ResultsView';
import Callback from './components/Callback';

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const onAnalysisComplete = (result, error) => {
    if (error) {
      setAuthError(error);
      setAnalysisResult(null);
    } else {
      setAnalysisResult(result);
      setAuthError(null);
    }
  
    window.history.pushState({}, '', '/');
    setRoute('/');
  };

  const handleTryAgain = () => {
    setAnalysisResult(null);
    setAuthError(null);
    setRoute('/'); 
  
  };

  
  if (route === '/callback') {
    return <Callback onComplete={onAnalysisComplete} />;
  }
  
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