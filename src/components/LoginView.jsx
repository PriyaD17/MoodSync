import React from 'react';
import './LoginView.css';

const LoginView = () => {
  
  const handleLoginClick = () => {
    window.history.pushState({}, '', '/callback');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="login-view">
      <div className="logo">Moodsync</div>
      <p className="tagline">Understand the mood of your music.</p>
      <button className="login-button" onClick={handleLoginClick}>
        <svg role="img" height="24" width="24" viewBox="0 0 24" className="spotify-icon">{/* SVG path here */}</svg>
        Connect with Spotify
      </button>
    </div>
  );
};

export default LoginView;