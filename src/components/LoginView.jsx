import React from 'react';
import './LoginView.css';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID; 
const REDIRECT_URI = "https://your-vercel-app-name.vercel.app/callback"; 
const SCOPES = ['user-read-recently-played'];

const SPOTIFY_AUTHORIZE_URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES.join('%20')}&redirect_uri=${REDIRECT_URI}`;

const LoginView = () => {
  return (
    <div className="login-view">
      <div className="logo">Moodsync</div>
      <p className="tagline">Understand the mood of your music.</p>
      <a className="login-button" href={SPOTIFY_AUTHORIZE_URL}>
        <svg role="img" height="24" width="24" viewBox="0 0 24" className="spotify-icon">{/* SVG path here */}</svg>
        Connect with Spotify
      </a>
      {!CLIENT_ID && <p className="error-message" style={{marginTop: '20px'}}>Warning: VITE_SPOTIFY_CLIENT_ID is not set!</p>}
    </div>
  );
};

export default LoginView;