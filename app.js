const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Application version — updated on each release
const APP_VERSION = 'v1.0.0';

// Main route — serves the version identifier
app.get('/', (req, res) => {
  res.send(`App Version: ${APP_VERSION}`);
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
