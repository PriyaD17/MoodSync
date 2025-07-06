import React from 'react';
import './LoginView.css';

const LoginView = () => {
  return (
    <div className="login-view">
      <div className="logo">Moodsync</div>
      <p className="tagline">Understand the mood of your music.</p>
      <a className="login-button" href="/api/callback">
        <svg role="img" height="24" width="24" viewBox="0 0 24" className="spotify-icon">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm5.431 17.431a.75.75 0 01-1.031.275c-2.828-1.731-6.391-2.119-10.631-1.15a.75.75 0 11-.344-1.463c4.5-1.062 8.406-.631 11.469 1.275a.75.75 0 01.275 1.063zm1.375-3.375a.75.75 0 01-1.031.275c-3.25-2-8.188-2.594-11.906-1.406a.75.75 0 11-.5-1.406c4.125-1.469 9.5-.844 13.094 1.594a.75.75 0 01.344 1.031zm.344-3.375a.75.75 0 01-1.031.344c-3.719-2.25-9.594-2.469-13.594-1.344a.75.75 0 11-.5-1.406c4.469-1.25 10.844-1 14.906 1.594a.75.75 0 01.219 1.031z"></path>
        </svg>
        Connect with Spotify
      </a>
    </div>
  );
};

export default LoginView;