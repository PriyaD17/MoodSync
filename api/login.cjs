

const SpotifyWebApi = require('spotify-web-api-node');

const scopes = ['user-read-recently-played'];

module.exports = function handler(_, res) {
  if (!process.env.VITE_SPOTIFY_CLIENT_ID || !process.env.VERCEL_URL) {
    console.error("Login Error: Missing environment variables.");
    return res.status(500).send("Server configuration error.");
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: `https://${process.env.VERCEL_URL}/api/callback`,
  });

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
};