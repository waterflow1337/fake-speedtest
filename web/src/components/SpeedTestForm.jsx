import React, { useState } from 'react';
import { createSpeedTest } from '../lib/speedtest-generator';

/**
 * Form component for creating fake speedtest results
 */
export default function SpeedTestForm() {
  const [formData, setFormData] = useState({
    uploadMbps: '',
    downloadMbps: '',
    uploadPing: '',
    downloadPing: '',
    idleLatency: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  /**
   * Handle input field changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const { uploadMbps, downloadMbps, uploadPing, downloadPing, idleLatency } = formData;
    
    if (!uploadMbps || !downloadMbps || !uploadPing || !downloadPing || !idleLatency) {
      throw new Error('All fields are required');
    }

    if (isNaN(uploadMbps) || uploadMbps <= 0 || uploadMbps > 9999) {
      throw new Error('Upload speed must be between 0.01 and 9999 Mbps');
    }

    if (isNaN(downloadMbps) || downloadMbps <= 0 || downloadMbps > 9999) {
      throw new Error('Download speed must be between 0.01 and 9999 Mbps');
    }

    if (isNaN(uploadPing) || uploadPing < 0 || uploadPing > 10000) {
      throw new Error('Upload latency must be between 0 and 10000 ms');
    }

    if (isNaN(downloadPing) || downloadPing < 0 || downloadPing > 10000) {
      throw new Error('Download latency must be between 0 and 10000 ms');
    }

    if (isNaN(idleLatency) || idleLatency < 0 || idleLatency > 10000) {
      throw new Error('Idle latency must be between 0 and 10000 ms');
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      validateForm();
      
      const resultUrl = await createSpeedTest({
        uploadMbps: parseFloat(formData.uploadMbps),
        downloadMbps: parseFloat(formData.downloadMbps),
        uploadPing: parseInt(formData.uploadPing),
        downloadPing: parseInt(formData.downloadPing),
        idleLatency: parseInt(formData.idleLatency)
      });
      
      setResult(resultUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copy result URL to clipboard
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      // Simple feedback - you could replace with a toast notification
      const button = document.querySelector('.copy-button');
      const originalText = button.textContent;
      button.textContent = '✅ Copied!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = result;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      uploadMbps: '',
      downloadMbps: '',
      uploadPing: '',
      downloadPing: '',
      idleLatency: ''
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="glass-card">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="uploadMbps" className="form-label">
            📤 Upload Speed (Mbps)
          </label>
          <input
            type="number"
            id="uploadMbps"
            name="uploadMbps"
            value={formData.uploadMbps}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 100.5"
            min="0.01"
            max="9999"
            step="0.01"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="downloadMbps" className="form-label">
            📥 Download Speed (Mbps)
          </label>
          <input
            type="number"
            id="downloadMbps"
            name="downloadMbps"
            value={formData.downloadMbps}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 500.75"
            min="0.01"
            max="9999"
            step="0.01"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="uploadPing" className="form-label">
            ⬆️ Upload Latency (ms)
          </label>
          <input
            type="number"
            id="uploadPing"
            name="uploadPing"
            value={formData.uploadPing}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 15"
            min="0"
            max="10000"
            step="1"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="downloadPing" className="form-label">
            ⬇️ Download Latency (ms)
          </label>
          <input
            type="number"
            id="downloadPing"
            name="downloadPing"
            value={formData.downloadPing}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 12"
            min="0"
            max="10000"
            step="1"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="idleLatency" className="form-label">
            ⏱️ Idle Latency (ms)
          </label>
          <input
            type="number"
            id="idleLatency"
            name="idleLatency"
            value={formData.idleLatency}
            onChange={handleInputChange}
            className="form-input"
            placeholder="e.g., 8"
            min="0"
            max="10000"
            step="1"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Generating your result...
            </>
          ) : (
            '✨ Generate Fake Speedtest'
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="message message-error">
          ❌ {error}
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="message message-success">
          <div className="success-label">
            🎉 Your speedtest result is ready!
          </div>
          <div className="result-container">
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer"
              className="result-link"
            >
              {result}
            </a>
            <button
              type="button"
              onClick={copyToClipboard}
              className="btn btn-secondary copy-button"
            >
              📋 Copy
            </button>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary"
            style={{ marginTop: '0.75rem', width: '100%' }}
          >
            🔄 Create Another
          </button>
        </div>
      )}
    </div>
  );
}