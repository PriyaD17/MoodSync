// src/components/ResultsView.jsx
import React from 'react';
import './ResultsView.css'; // We will add new styles to this file

const ResultsView = ({ analysis, error, onTryAgain }) => {
  return (
    <div className="results-view">
      <div className="card">
        <h1>{error ? "Oops!" : "Your AI-Powered Mood Analysis"}</h1>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <p>Overall Mood</p>
            <strong>{analysis.overallMood}</strong>
            
            <p className="description">{analysis.shortDescription}</p>

            <div className="keywords-container">
              {analysis.keywords.map((keyword, index) => (
                <span key={index} className="keyword-pill">{keyword}</span>
              ))}
            </div>
          </>
        )}
        <button className="try-again-button" onClick={onTryAgain}>
          {error ? "Try Again" : "Analyze Again"}
        </button>
      </div>
    </div>
  );
};

export default ResultsView;