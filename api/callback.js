

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


export default async function handler(req, res) {
  const { code } = req.query;
  const frontendUrl = `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;
  
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Secret is not prefixed with VITE_
    redirectUri: `${frontendUrl}/api/callback`,
  });

  try {
    
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    const result = await analyzeSession(spotifyApi);

    const query = new URLSearchParams(result).toString();
    res.redirect(`${frontendUrl}?${query}`);

  } catch (err) {
    console.error('Spotify Callback Error:', err);
    const query = new URLSearchParams({ error: 'Authentication failed. Please try again.' }).toString();
    res.redirect(`${frontendUrl}?${query}`);
  }
}