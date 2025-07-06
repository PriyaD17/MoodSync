
import React, { useState } from 'react';
import LoginView from './components/LoginView';
import ResultsView from './components/ResultsView';
import Callback from './components/Callback';

function App() {
  const [page, setPage] = useState(window.location.pathname);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [authError, setAuthError] = useState(null);

  const handleAuthComplete = (result, error) => {
    if (error) {
      setAuthError(error);
    } else {
      setAnalysisResult(result);
    }
    window.history.pushState({}, '', '/');
    setPage('/');
  };
  
  const handleTryAgain = () => {
    setAnalysisResult(null);
    setAuthError(null);
  };
  
  // Basic router
  let Component;
  switch (page) {
    case '/callback':
      Component = <Callback onAuthComplete={handleAuthComplete} />;
      break;
    default:
      if (analysisResult) {
        Component = <ResultsView analysis={analysisResult} onTryAgain={handleTryAgain} />;
      } else if (authError) {
        Component = <ResultsView analysis={{}} error={authError} onTryAgain={handleTryAgain} />;
      } else {
        Component = <LoginView />;
      }
      break;
  }

  return <div className="App">{Component}</div>;
}

export default App;