import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import ResultsView from './components/ResultsView';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('mood')) {
      setAnalysisResult({
        overallMood: params.get('mood'),
        shortDescription: params.get('desc'),
        keywords: params.get('keywords').split(','),
      });
      window.history.replaceState({}, document.title, "/");
    } else if (params.has('error')) {
      setAuthError(params.get('error'));
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleTryAgain = () => {
    setAnalysisResult(null);
    setAuthError(null);
  };

  if (analysisResult) {
    return <ResultsView analysis={analysisResult} onTryAgain={handleTryAgain} />;
  }
  if (authError) {
    return <ResultsView analysis={{}} error={authError} onTryAgain={handleTryAgain} />;
  }
  return <LoginView />;
}

export default App;