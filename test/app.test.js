const { describe, it, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../app');

/**
 * Starts the Express app on an ephemeral port and returns
 * the running server and its base URL.
 */
function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://localhost:${port}` });
    });
  });
}

/**
 * Simple HTTP GET helper using Node built-in http module.
 */
function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

describe('App Endpoints', () => {
  let server;
  let baseUrl;

  it('should start the server', async () => {
    const result = await startServer();
    server = result.server;
    baseUrl = result.baseUrl;
  });

  it('GET / should return the version string', async () => {
    const res = await get(`${baseUrl}/`);
    assert.strictEqual(res.statusCode, 200);
    assert.match(res.body, /App Version: v\d+\.\d+\.\d+/);
    assert.ok(res.body.includes('v1.0.2'), 'Should contain v1.0.2');
    assert.ok(res.body.includes('Author: Arivu'), 'Should contain Author: Arivu_King');
    assert.ok(res.body.includes('Location: Houston'), 'Should contain Location: Houston');
  });

  it('GET /health should return ok status', async () => {
    const res = await get(`${baseUrl}/health`);
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.status, 'ok');
    assert.ok(body.version, 'Should include version field');
  });

  after(() => {
    if (server) server.close();
  });
});
