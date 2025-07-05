

const SpotifyWebApi = require('spotify-web-api-node');
// const statistics = require('simple-statistics');

// ... (keep the analyzeSession function exactly as it was) ...
async function analyzeSession(api) {
  // ...
}


export default async function handler(req, res) {
  console.log("--- /api/callback function invoked ---");

  // Check for required environment variables
  if (!process.env.VITE_SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.VERCEL_URL) {
    console.error("CRITICAL: Missing environment variables.");
    return res.status(500).send("Server configuration error.");
  }

  const { code, error } = req.query;
  const frontendUrl = `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;

  if (error) {
    console.error("Error received from Spotify:", error);
    const query = new URLSearchParams({ error: 'Spotify denied the request.' }).toString();
    return res.redirect(`${frontendUrl}?${query}`);
  }

  if (!code) {
    console.error("No code received from Spotify.");
    const query = new URLSearchParams({ error: 'Authentication code was missing.' }).toString();
    return res.redirect(`${frontendUrl}?${query}`);
  }
  
  console.log("Received authorization code successfully.");

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `${frontendUrl}/api/callback`,
  });

  try {
    console.log("Attempting to exchange code for tokens...");
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log("Successfully exchanged code for tokens.");

    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    console.log("Access token has been set.");

    const result = await analyzeSession(spotifyApi);
    console.log("Analysis complete. Result:", result);

    const query = new URLSearchParams(result).toString();
    res.redirect(`${frontendUrl}?${query}`);

  } catch (err) {
    console.error("!!! CRASH POINT !!! An error occurred in the try block.");
    console.error("Full Error:", err);
    
    // Log the specific Spotify API error message if available
    if (err.body && err.body.error_description) {
        console.error("Spotify Error Description:", err.body.error_description);
    }
    
    const query = new URLSearchParams({ error: 'An internal error occurred during Spotify authentication.' }).toString();
    res.redirect(`${frontendUrl}?${query}`);
  }
}