// api/callback.cjs

const SpotifyWebApi = require('spotify-web-api-node');
const statistics = require('simple-statistics');

async function analyzeSession(api) {
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

module.exports = async function handler(req, res) {
  console.log("--- /api/callback invoked ---");

  const vercelUrl = process.env.VERCEL_URL;
  const frontendUrl = `https://${vercelUrl}`;
  const redirectUri = `${frontendUrl}/api/callback`;
  
  if (!process.env.VITE_SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !vercelUrl) {
    console.error("CRITICAL: Missing environment variables.");
    return res.status(500).send("Server configuration error. Admin has been notified.");
  }

  const { code, error } = req.query;

  if (error) {
    console.error("Error received directly from Spotify:", error);
    return res.redirect(`${frontendUrl}?error=${encodeURIComponent('Spotify denied the request.')}`);
  }
  
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: redirectUri,
  });

  try {
    console.log("Exchanging code for tokens with redirect URI:", redirectUri);
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log("Token exchange successful.");

    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    
    const result = await analyzeSession(spotifyApi);
    console.log("Analysis complete. Redirecting with result:", result);
    
    const query = new URLSearchParams(result).toString();
    res.redirect(`${frontendUrl}?${query}`);

  } catch (err) {
    console.error("!!! CRASH POINT !!!");
    if (err.body) {
      console.error("Spotify API Error Body:", err.body);
    } else {
      console.error("Full Error Object:", err);
    }
    const errorMessage = err.body?.error_description || 'An internal error occurred.';
    const query = new URLSearchParams({ error: errorMessage }).toString();
    res.redirect(`${frontendUrl}?${query}`);
  }
};