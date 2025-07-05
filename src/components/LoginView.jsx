import React from 'react';
import './LoginView.css'; 

const LoginView = ({ onLogin }) => {
  return (
    <div className="login-view">
      <div className="logo">Moodsync</div>
      <p className="tagline">Understand the mood of your music.</p>
      <button className="login-button" onClick={onLogin}>
        <svg role="img" height="24" width="24" viewBox="0 0 24 24" className="spotify-icon"><path fill="currentColor" d="M12 2.768C6.34 2.768 1.768 7.34 1.768 13c0 5.66 4.572 10.232 10.232 10.232 5.66 0 10.232-4.572 10.232-10.232S17.66 2.768 12 2.768zM8.412 17.436c-.24 0-.396-.156-.396-.36 0-.204.156-.36.396-.36.24 0 .396.156.396.36 0 .204-.156.36-.396.36zm1.704-2.832c-.276 0-.432-.192-.432-.42 0-.228.156-.42.432-.42.276 0 .432.192.432.42 0 .228-.156.42-.432.42zm1.476-2.208c-.3 0-.48-.216-.48-.48s.18-.48.48-.48.48.216.48.48-.18.48-.48.48zm2.52-4.224c-1.02.012-2.136.216-3.12.552-.3.108-.42.012-.42-.264v-1.14c0-.3.12-.396.384-.288 1.152.42 2.508.648 3.84.636 3.396-.036 5.928-2.316 5.928-5.184 0-2.04-1.2-3.48-3.324-3.48-2.34 0-3.864 1.632-3.864 3.96 0 .3.132.42.396.42h1.176c.264 0 .396-.132.396-.396 0-1.632.912-2.736 2.292-2.736 1.176 0 1.944.864 1.944 2.16 0 2.256-2.004 3.864-4.8 3.744z"></path></svg>
        {onLogin.loading ? 'Analyzing...' : 'Connect with Spotify'}
      </button>
    </div>
  );
};

export default LoginView;