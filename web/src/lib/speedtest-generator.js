import CryptoJS from 'crypto-js';

/**
 * SpeedTest Generator Class
 * Generates fake speedtest results using the speedtest.net API format
 */
export class SpeedTestGenerator {
  /**
   * Create a new SpeedTest instance
   * @param {Object} config - Configuration object
   * @param {string} config.ping - Base ping value (fixed for signature)
   * @param {number} config.uploadMbps - Upload speed in Mbps
   * @param {number} config.downloadMbps - Download speed in Mbps
   * @param {string} config.key - API key for signature generation
   * @param {number} config.uploadPing - Upload latency in ms
   * @param {number} config.downloadPing - Download latency in ms
   * @param {number} config.idleLatency - Idle latency in ms
   * @param {number} config.serverId - Server ID
   */
  constructor(config) {
    this.validateConfig(config);
    
    this.ping = config.ping;
    this.upload = String(parseFloat(config.uploadMbps) * 1000);
    this.download = String(parseFloat(config.downloadMbps) * 1000);
    this.key = config.key;
    this.uploadPing = parseInt(config.uploadPing);
    this.downloadPing = parseInt(config.downloadPing);
    this.idleLatency = parseInt(config.idleLatency);
    this.serverId = config.serverId;
    
    this.signature = this.generateSignature();
    this.guid = this.generateGuid();
  }

  /**
   * Validate configuration parameters
   * @param {Object} config - Configuration to validate
   * @throws {Error} If configuration is invalid
   */
  validateConfig(config) {
    const required = ['ping', 'uploadMbps', 'downloadMbps', 'key', 'uploadPing', 'downloadPing', 'idleLatency', 'serverId'];
    
    for (const field of required) {
      if (config[field] === undefined || config[field] === null || config[field] === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (isNaN(config.uploadMbps) || config.uploadMbps < 0 || config.uploadMbps > 9999) {
      throw new Error('Upload speed must be between 0 and 9999 Mbps');
    }

    if (isNaN(config.downloadMbps) || config.downloadMbps < 0 || config.downloadMbps > 9999) {
      throw new Error('Download speed must be between 0 and 9999 Mbps');
    }

    if (isNaN(config.uploadPing) || config.uploadPing < 0) {
      throw new Error('Upload ping must be a positive number');
    }

    if (isNaN(config.downloadPing) || config.downloadPing < 0) {
      throw new Error('Download ping must be a positive number');
    }

    if (isNaN(config.idleLatency) || config.idleLatency < 0) {
      throw new Error('Idle latency must be a positive number');
    }
  }

  /**
   * Generate MD5 signature for the speedtest data
   * @returns {string} MD5 hash signature
   */
  generateSignature() {
    const presignature = [this.ping, this.upload, this.download, this.key].join('-');
    return CryptoJS.MD5(presignature).toString();
  }

  /**
   * Generate a valid UUID v4
   * @returns {string} UUID string
   */
  generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }

  /**
   * Build the complete JSON payload for the speedtest API
   * @returns {Object} Complete speedtest data object
   */
  buildPayload() {
    return {
      app: {
        sdk: {
          commit: 'f6b050be7bf06ca243f95e60eafff740cc401b9a',
          version: '2.8.17',
        },
      },
      serverid: this.serverId,
      testmethod: 'wss,xhrs,xhrs',
      source: 'st4-js',
      configs: {
        remoteDebugging: false,
        maxDisplayServers: 20,
        requestWebLocation: true,
        shortTests: false,
        automaticStageProgression: false,
        eventSkipInterval: 2,
        latency: {
          maxServers: 10,
        },
        jsEngine: {
          saveContentType: 'application/json',
          saveType: 'st4-js',
        },
        stagesList: ['latency', 'download', 'upload', 'save'],
        loadedLatency: {
          enabled: true,
        },
        swf: {
          engine: '/engine.swf',
          express: '/expressInstall.swf',
        },
        vpnDetected: false,
        logErrorsToServer: false,
        connections: {
          isVpn: false,
          selectionMethod: 'auto',
          mode: 'multi',
        },
        experiments: {},
        latencyProtocol: 'ws',
        downloadProtocol: 'xhr',
        uploadProtocol: 'xhr',
        host: 'perf.keyyo.net',
        port: 8080,
        serverVersion: '2.11.0',
        serverBuild: '2023-11-29.2207.3251a05',
      },
      ping: this.ping,
      pings: [],
      jitter: 0,
      latency: {
        connectionProtocol: 'wss',
        tcp: {
          jitter: 0,
          rtt: {
            iqm: this.idleLatency,
            mean: this.idleLatency,
            median: this.idleLatency,
            min: this.idleLatency,
            max: this.idleLatency,
          },
          count: 0,
          samples: [],
        },
      },
      guid: this.guid,
      serverSelectionMethod: 'auto',
      uploadMeasurementMethod: 'remote',
      upload: this.upload,
      uploadSpeeds: {},
      download: this.download,
      downloadSpeeds: {},
      downloadLatency: {
        tcp: {
          jitter: 0,
          rtt: {
            iqm: this.downloadPing,
            mean: this.downloadPing,
            median: this.downloadPing,
            min: this.downloadPing,
            max: this.downloadPing,
          },
          count: 0,
          elapsed: 0,
          timestamp: 0,
        },
      },
      uploadLatency: {
        tcp: {
          jitter: 0,
          rtt: {
            iqm: this.uploadPing,
            mean: this.uploadPing,
            median: this.uploadPing,
            min: this.uploadPing,
            max: this.uploadPing,
          },
          count: 0,
          elapsed: 0,
          timestamp: 0,
        },
      },
      servers: {},
      connections: {},
      hash: this.signature,
      clientip: '1.1.1.1',
    };
  }

  /**
   * Submit the speedtest data to speedtest.net API
   * @returns {Promise<string|false>} Result ID or false if failed
   */
  async submit() {
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

      const payload = this.buildPayload();
      
      const apiUrl = `${window.location.origin}/api/speedtest`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
        mode: 'cors',
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Check if the response is an error array
      if (Array.isArray(result)) {
        throw new Error('Invalid response from speedtest.net API');
      }

      // Validate that we received a result ID
      if (!result.resultid) {
        throw new Error('No result ID received from API');
      }

      return result.resultid;
    } catch (error) {
      console.error('SpeedTest submission failed:', error);
      
      // Re-throw with more specific error messages
      if (error.name === 'TimeoutError') {
        throw new Error('Request timed out. Please try again.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      } else if (error.message.includes('HTTP error')) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw error;
    }
  }
}

/**
 * Create a speedtest result with the given parameters
 * @param {Object} params - Speedtest parameters
 * @returns {Promise<string>} Speedtest result URL
 */
export async function createSpeedTest(params) {
  const config = {
    ping: '10', // Fixed value for signature
    uploadMbps: params.uploadMbps,
    downloadMbps: params.downloadMbps,
    key: '817d699764d33f89c', // Fixed API key
    uploadPing: params.uploadPing,
    downloadPing: params.downloadPing,
    idleLatency: params.idleLatency,
    serverId: 27961, // Default server ID
  };

  const generator = new SpeedTestGenerator(config);
  const resultId = await generator.submit();
  
  if (!resultId) {
    throw new Error('Failed to generate speedtest result');
  }

  return `https://www.speedtest.net/result/${resultId}`;
}