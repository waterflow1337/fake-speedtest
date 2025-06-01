const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the web/dist directory
app.use(express.static(path.join(__dirname, 'web', 'dist')));

// Proxy endpoint for speedtest API
app.post('/api/speedtest', async (req, res) => {
  try {
    const headers = {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json;charset=UTF-8',
      'origin': 'https://www.speedtest.net',
      'referer': 'https://www.speedtest.net/',
      'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    };

    const response = await fetch('https://www.speedtest.net/api/results.php', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid response from speedtest.net' });
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request' });
  }
});

// Serve the React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Website: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/speedtest`);
});