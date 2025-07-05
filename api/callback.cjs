// api/callback.cjs --- ULTIMATE TRACER VERSION

module.exports = function handler(req, res) {
    // Get the current timestamp
    const timestamp = new Date().toISOString();
  
    // Get the ?code= from the URL that Spotify provides
    const authorizationCode = req.query.code || 'No "code" was found in the URL.';
  
    // Send a success page that cannot fail.
    res.status(200).send(`
      <html style="font-family: monospace; background: #121212; color: #1DB954; padding: 20px;">
        <body>
          <h1>✅ /api/callback Endpoint Reached!</h1>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
          <p><strong>Result:</strong> If you are seeing this page, it means your Vercel routing and your Spotify Redirect URI are CORRECTLY configured to hit this file.</p>
          <p><strong>Next Step:</strong> The problem was with the previous code's logic (likely an environment variable issue). We can now fix that.</p>
          <hr>
          <h2>Data from Spotify:</h2>
          <p><strong>Authorization Code:</strong> <strong style="color: white; background: #333; padding: 5px;">${authorizationCode}</strong></p>
        </body>
      </html>
    `);
  };