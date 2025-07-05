

const SpotifyWebApi = require('spotify-web-api-node');

const scopes = ['user-read-recently-played'];

export default function handler(_, res) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: `${process.env.VERCEL_URL}/api/callback`,
  });

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
}