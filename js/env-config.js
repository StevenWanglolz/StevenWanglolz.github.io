// Environment Configuration - Secure Version
// This file should be loaded before any API calls

class EnvironmentConfig {
  constructor() {
    this.config = {
      // API Configuration
      api: {
        baseURL: this.getAPIBaseURL(),
        timeout: 30000, // 30 seconds
        retryAttempts: 3
      },
      
      // Security Configuration
      security: {
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        passwordMinLength: 8,
        requireSpecialChars: true
      },
      
      // Rate Limiting
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        burstLimit: 10
      },
      
      // Feature Flags
      features: {
        enableImageGeneration: true,
        enableTextGeneration: true,
        enableSampling: true,
        enableUserManagement: true,
        enableLogging: true
      }
    };
  }

  getAPIBaseURL() {
    // Environment-specific API URLs
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    } else if (hostname.includes('github.io')) {
      // GitHub Pages - you'll need to set up your own API server
      return 'https://your-api-server.com/api';
    } else {
      // Production
      return 'https://api.yourdomain.com';
    }
  }

  // Get configuration value
  get(key) {
    return this.getNestedValue(this.config, key);
  }

  // Get nested configuration value
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Check if feature is enabled
  isFeatureEnabled(feature) {
    return this.config.features[feature] === true;
  }

  // Validate environment
  validate() {
    const required = ['api.baseURL'];
    const missing = required.filter(key => !this.get(key));
    
    if (missing.length > 0) {
      console.error('Missing required configuration:', missing);
      return false;
    }
    
    return true;
  }
}

// Create global environment configuration
window.envConfig = new EnvironmentConfig();

// Validate configuration on load
if (!window.envConfig.validate()) {
  console.error('Environment configuration validation failed');
}
