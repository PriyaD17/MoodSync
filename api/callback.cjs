// api/callback.cjs

const SpotifyWebApi = require('spotify-web-api-node');
const statistics = require('simple-statistics');

async function analyzeSession(api) {
  // This helper function remains the same
  const data = await api.getMyRecentlyPlayedTracks({ limit: 20 });
  if (!data.body.items || data.body.items.length === 0) {
    throw new Error('No recent tracks found.');
  }
  const trackIds = data.body.items.map(item => item.track.id);
  const featuresData = await api.getAudioFeaturesForTracks(trackIds);
  const audioFeatures = featuresData.body.audio_features.filter(f => f);
  if (audioFeatures.length === 0) {
    throw new Error('Could not analyze any tracks.');
  }
  const avgValence = statistics.mean(audioFeatures.map(f => f.valence));
  const avgEnergy = statistics.mean(audioFeatures.map(f => f.energy));
  let moodDescription = "Balanced & Moderate";
  if (avgEnergy > 0.6) {
    if (avgValence > 0.6) moodDescription = "Energetic & Joyful";
    else if (avgValence < 0.4) moodDescription = "Tense & Agitated";
    else moodDescription = "High-Energy & Driven";
  } else if (avgEnergy < 0.4) {
    if (avgValence > 0.6) moodDescription = "Calm & Serene";
    else if (avgValence < 0.4) moodDescription = "Somber & Introspective";
    else moodDescription = "Relaxed & Mellow";
  }
  return { mood: moodDescription, valence: avgValence.toFixed(2), energy: avgEnergy.toFixed(2) };
}

// Use module.exports instead of export default
module.exports = async function handler(req, res) {
  console.log("--- /api/callback function invoked ---");

  if (!process.env.VITE_SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.VERCEL_URL) {
    console.error("CRITICAL: Missing environment variables.");
    return res.status(500).send("Server configuration error.");
  }

  const { code, error } = req.query;
  const frontendUrl = `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;

  if (error) {
    console.error("Error received from Spotify:", error);
    return res.redirect(`${frontendUrl}?error=${encodeURIComponent('Spotify denied the request.')}`);
  }

  if (!code) {
    console.error("No code received from Spotify.");
    return res.redirect(`${frontendUrl}?error=${encodeURIComponent('Authentication code was missing.')}`);
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
    console.log("Analysis complete. Redirecting to frontend with result:", result);

    const query = new URLSearchParams(result).toString();
    res.redirect(`${frontendUrl}?${query}`);

  } catch (err) {
    console.error("!!! CRASH POINT !!! An error occurred in the try block.");
    console.error("Full Error:", err);
    if (err.body && err.body.error_description) {
        console.error("Spotify Error Description:", err.body.error_description);
    }
    const query = new URLSearchParams({ error: 'An internal error occurred during Spotify authentication.' }).toString();
    res.redirect(`${frontendUrl}?${query}`);
  }
};