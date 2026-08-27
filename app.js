const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Application version — updated on each release
const APP_VERSION = 'v1.0.2';

// Main route — serves the version identifier, author, and location
app.get('/', (req, res) => {
  res.send(`<div style="font-size: 54px; font-family: sans-serif; line-height: 1.6;">App Version: ${APP_VERSION}<br>Author: Arivu_king<br>Location: Houston</div>`);
});

// Health check endpoint — used by Kubernetes probes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: APP_VERSION });
});

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} — ${APP_VERSION}`);
  });
}

module.exports = app;
