import React from 'react';
import SpeedTestForm from './components/SpeedTestForm';
import './styles/globals.css';

/**
 * Main App Component
 * Clean, professional fake speedtest generator
 */
export default function App() {
  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="main-card">
          {/* Header Section */}
          <header className="text-center mb-8">
            <h1 className="heading-primary">
              🚀 Fake Speedtest Generator
            </h1>
            <p className="heading-secondary">
              Generate custom speedtest results with realistic data
            </p>
          </header>

          {/* Main Form */}
          <main>
            <SpeedTestForm />
          </main>

          {/* Footer Section */}
          <footer className="text-center mt-8">
            <p className="text-muted">
              💡 Perfect for testing, demos, and educational purposes
            </p>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              All results are generated using realistic speedtest.net format
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}