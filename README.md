# Fake Speedtest Generator

**🌐 Live Site: [https://fakespeedtest.com](https://fakespeedtest.com)**

Generate custom fake speedtest results using the speedtest.net API format.

## Tech Stack

- React 18
- Vite 6.x
- TailwindCSS
- Express.js (proxy server)
- speedtest.net API

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fake-speedtest-generator.git
   cd fake-speedtest-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd web && npm install && cd ..
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open browser**
   ```
   http://localhost:3001
   ```

## Project Structure

```
fake-speedtest-generator/
├── web/                           # React application
│   ├── public/
│   │   ├── favicon.ico           # Favicon
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── SpeedTestForm.jsx # Form component
│   │   ├── lib/
│   │   │   └── speedtest-generator.js # Speedtest logic
│   │   ├── styles/
│   │   │   └── globals.css       # Styles
│   │   ├── App.jsx              # Main component
│   │   └── main.jsx             # Entry point
│   ├── package.json             # Web dependencies
│   ├── vite.config.js           # Vite config
│   ├── tailwind.config.js       # Tailwind config
│   └── postcss.config.js        # PostCSS config
├── proxy-server.js              # Express proxy server
├── package.json                 # Server dependencies
├── main.py                      # Original Python script
├── speedtest.py                 # Original Python module
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## Usage

1. Enter upload and download speeds (0.01-9999 Mbps)
2. Set latency values (0-10000 ms)
3. Click generate to create speedtest result
4. Copy the generated speedtest.net URL

## Configuration

Edit `src/lib/speedtest-generator.js` to change the server:

```javascript
const config = {
  serverId: 27961, // Change server ID
};
```

## Development

### Web app only (with hot reload)
```bash
cd web
npm run dev
```

### Server only (with nodemon)
```bash
npm run dev
```

### Full application
```bash
npm start
```

## Deploy

The application includes both frontend and backend, so deploy to platforms that support Node.js:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- VPS with Node.js

Set `PORT` environment variable for production.

## Troubleshooting

**Build errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TailwindCSS issues:**
```bash
npm install -D @tailwindcss/postcss
```

## Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) file.

## Disclaimer

For educational and testing purposes only. Use responsibly.