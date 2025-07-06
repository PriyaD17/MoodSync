// api/login.cjs
const SpotifyWebApi = require('spotify-web-api-node');
const scopes = ['user-read-recently-played'];

module.exports = function handler(_, res) {
  const redirectUri = `https://${process.env.VERCEL_URL}/callback`;
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: redirectUri,
  });
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
};