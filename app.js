const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Application version — updated on each release
const APP_VERSION = 'v1.0.2';
const APP_ENV = process.env.APP_ENV || 'UAT';

// Main route — serves the version identifier, environment, author, and location
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.send(`<div style="font-size: 24px; font-family: sans-serif; line-height: 1.6;">App Version: ${APP_VERSION}<br>Environment: ${APP_ENV}<br>Author: Arivu<br>Location: Houston</div>`);
});

// Health check endpoint — used by Kubernetes probes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: APP_VERSION, environment: APP_ENV });
});

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} — ${APP_VERSION}`);
  });
}

module.exports = app;
