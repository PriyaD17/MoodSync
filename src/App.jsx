// 
// src/App.jsx --- FINAL DEBUGGER VERSION
import React, { useState} from 'react';
import LoginView from './components/LoginView';
import ResultsView from './components/ResultsView';
import Callback from './components/Callback';

function App() {
  const [page, setPage] = useState(window.location.pathname);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [authError, setAuthError] = useState(null);

  const handleAuthComplete = (result, error) => {
    if (error) {
      // Set a very clear, unmissable error message
      setAuthError(`Backend Error: ${error}`);
    } else {
      setAnalysisResult(result);
    }
    // Go back to the home page to display the outcome
    window.history.pushState({}, '', '/');
    setPage('/');
  };
  
  const handleTryAgain = () => {
    // Clear everything and go back to the login view
    setAnalysisResult(null);
    setAuthError(null);
    window.location.href = '/'; // Force a full page reload to the login screen
  };
  
  // The Router Logic
  if (page === '/callback') {
    return <Callback onAuthComplete={handleAuthComplete} />;
  }

  // If there's an error, show it FIRST and make it obvious
  if (authError) {
    return (
      <ResultsView 
        analysis={{ overallMood: "Error", keywords: [] }} 
        error={authError} 
        onTryAgain={handleTryAgain} 
      />
    );
  }

  if (analysisResult) {
    return <ResultsView analysis={analysisResult} onTryAgain={handleTryAgain} />;
  }
  
  // Default to the login view
  return <LoginView />;
}

export default App;