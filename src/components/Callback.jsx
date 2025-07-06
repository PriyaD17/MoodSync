
import React, { useEffect } from 'react';
import './Callback.css'; 

const Callback = ({ onAuthComplete }) => {
  useEffect(() => {
    const authenticate = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        onAuthComplete(null, `Spotify returned an error: ${error}`);
        return;
      }

      const codeVerifier = localStorage.getItem('spotify_code_verifier');

      if (!code || !codeVerifier) {
        onAuthComplete(null, 'Authentication failed: code or verifier missing.');
        return;
      }

      try {
        const response = await fetch('/api/exchangeToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, codeVerifier }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to exchange token.');
        }

        onAuthComplete(data, null);

      } catch (err) {
        onAuthComplete(null, err.message);
      }
    };

    authenticate();
  }, [onAuthComplete]);

  return (
    <div className="callback-view">
      <div className="spinner"></div>
      <p className="status-text">Finalizing connection...</p>
    </div>
  );
};

export default Callback;