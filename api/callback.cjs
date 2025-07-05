

const SpotifyWebApi = require('spotify-web-api-node');

module.exports = async function handler(req, res) {
  // --- Construct all variables for debugging ---
  const vercelUrl = process.env.VERCEL_URL;
  const frontendUrl = `https://${vercelUrl}`;
  const redirectUri = `${frontendUrl}/api/callback`;
  const clientId = process.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Check if this exists

  const { code, error: queryError } = req.query;

  // --- Start of the actual function logic ---
  if (queryError) {
    res.status(400).send(`<h1>Error from Spotify</h1><p>Spotify returned an error directly: ${queryError}</p>`);
    return;
  }
  
  const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri,
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    // If it succeeds, it will show this message
    res.status(200).send(`<h1>Success!</h1><p>Token exchange worked. This means your setup is correct. You can now switch back to the normal callback code.</p><pre>${JSON.stringify(data.body, null, 2)}</pre>`);

  } catch (err) {
    // --- THIS IS THE IMPORTANT PART ---
    // If it fails, it will print this detailed debug screen.
    console.error("DEBUGGING ERROR:", err); // Still log it for Vercel
    
    res.status(500).send(`
      <html>
        <head><title>Backend Debug</title></head>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1>Oops! The Backend Crashed.</h1>
          <p>This is a debug page. Here is the exact error information:</p>
          
          <h2>Error Message:</h2>
          <p style="color: red; font-weight: bold;">${err.message || 'No error message available.'}</p>
          
          <h2>Spotify's Response (if any):</h2>
          <pre style="background: #eee; padding: 10px; border-radius: 5px;">${JSON.stringify(err.body, null, 2) || 'No response body from Spotify.'}</pre>
          
          <hr>
          
          <h2>Values Used in the API Call:</h2>
          <ul>
            <li><strong>Redirect URI Sent:</strong> <code>${redirectUri}</code></li>
            <li><strong>Client ID Used:</strong> <code>${clientId}</code></li>
            <li><strong>Client Secret Used:</strong> <code>${clientSecret ? '****** (Exists)' : '!!!! NOT FOUND !!!!'}</code></li>
          </ul>

          <hr>

          <h2>What to Do Next:</h2>
          <ol>
            <li><strong>Compare the "Redirect URI Sent" value above with the one in your Spotify Dashboard.</strong> They must match 100%, character for character. No trailing slashes.</li>
            <li>If you see "invalid_client" in Spotify's Response, it means your Client ID or Client Secret is wrong in your Vercel Environment Variables.</li>
            <li>If you see "invalid_grant", it often means the authorization code was already used or expired. Try again in a new Incognito Window.</li>
          </ol>
        </body>
      </html>
    `);
  }
};