// API Configuration - Secure Version
class APIConfig {
  constructor() {
    this.baseURL = this.getBaseURL();
    this.rateLimit = {
      maxRequests: 100,
      timeWindow: 60000, // 1 minute
      requests: []
    };
  }

  getBaseURL() {
    // Use environment-specific URLs
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api'; // Local development
    } else {
      return 'https://your-api-domain.com/api'; // Production - replace with your actual API domain
    }
  }

  // Rate limiting
  checkRateLimit() {
    const now = Date.now();
    // Remove old requests outside the time window
    this.rateLimit.requests = this.rateLimit.requests.filter(
      time => now - time < this.rateLimit.timeWindow
    );

    if (this.rateLimit.requests.length >= this.rateLimit.maxRequests) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    this.rateLimit.requests.push(now);
    return true;
  }

  // Secure API request
  async makeRequest(endpoint, options = {}) {
    // Check authentication
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    // Check rate limit
    this.checkRateLimit();

    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    try {
      const sessionData = sessionStorage.getItem('userSession');
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      return session.isAuthenticated === true;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  }

  // OpenAI API integration
  async generateText(prompt, options = {}) {
    const requestData = {
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7
    };

    return await this.makeRequest('/openai/generate-text', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  }

  async generateImage(prompt, options = {}) {
    const requestData = {
      prompt: prompt,
      n: options.count || 1,
      size: options.size || '512x512',
      response_format: 'url'
    };

    return await this.makeRequest('/openai/generate-image', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  }
}

// Create global API instance
window.apiConfig = new APIConfig();
