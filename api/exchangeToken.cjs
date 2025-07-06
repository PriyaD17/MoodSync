

const SpotifyWebApi = require('spotify-web-api-node');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function analyzeSessionWithAI(tracks) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Google API Key is not configured on the server.");
  }
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  // --- ROBUST DATA FORMATTING ---
  // 1. Filter out any null tracks or tracks without a name.
  // 2. Use optional chaining (?.) to prevent crashes if an artist is missing.
  const formattedTracks = tracks
    .filter(item => item?.track?.name) 
    .map(item => `- ${item.track.artists[0]?.name || 'Unknown Artist'} - ${item.track.name}`)
    .join('\n');
  
  if (!formattedTracks) {
    // If all tracks were filtered out, we can't analyze anything.
    return {
      overallMood: "Silent Session",
      shortDescription: "It looks like you haven't played any tracks with recognizable names recently.",
      keywords: ["silent", "empty", "quiet"]
    };
  }
  
  // Design the prompt using the safely formatted track list
  const prompt = `
    You are an expert music analyst specializing in emotional sentiment.
    Based on the following list of recently played Spotify tracks, analyze the overall mood and feeling of the listening session.

    Track List:
    ${formattedTracks}

    Provide your analysis ONLY in a raw JSON object format, with no extra text or markdown.
    The JSON object must have these exact keys: "overallMood", "shortDescription", and "keywords".
    - "overallMood": A 2-3 word title for the mood (e.g., "Nostalgic & Reflective", "Upbeat Morning Energy").
    - "shortDescription": A one-sentence, engaging description of the vibe.
    - "keywords": An array of 3-5 relevant lowercase keyword strings (e.g., ["chill", "focus", "late night"]).
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(text);
    
    if (!analysis.overallMood || !analysis.shortDescription || !analysis.keywords) {
      throw new Error("AI response was missing required keys.");
    }
    return analysis;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

// --- Main Handler ---
// This part remains the same, but is included for completeness.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { code, codeVerifier } = req.body;
  if (!code || !codeVerifier) return res.status(400).json({ error: 'Missing code or verifier' });

  const clientId = process.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = `https://${process.env.VERCEL_URL}/callback`;

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokenData.error_description || 'Token exchange failed');

    const spotifyApi = new SpotifyWebApi({ clientId });
    spotifyApi.setAccessToken(tokenData.access_token);
    const recentTracks = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 20 });
    
    if (!recentTracks.body.items || recentTracks.body.items.length === 0) {
      throw new Error("No recent tracks found to analyze.");
    }
    
    const analysisResult = await analyzeSessionWithAI(recentTracks.body.items);
    
    res.status(200).json(analysisResult);

  } catch (err) {
    console.error("Backend Error in catch block:", err);
    res.status(500).json({ error: err.message });
  }
};