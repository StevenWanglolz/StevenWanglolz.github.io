// Authentication Service
class AuthService {
  constructor() {
    this.baseURL = this.getBaseURL();
    this.token = localStorage.getItem('authToken');
  }

  getBaseURL() {
    // Use localhost for development, or tunnel URL for public access
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    } else {
      // Use the tunnel URL for GitHub Pages
      return 'https://metal-crabs-hide.loca.lt';
    }
  }

  // Login user
  async login(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if response is ok and content type is JSON
      if (!response.ok) {
        if (response.status === 511) {
          return { 
            success: false, 
            error: 'Network authentication required. Please visit the tunnel URL first to authenticate.' 
          };
        }
        return { 
          success: false, 
          error: `Server error: ${response.status} ${response.statusText}` 
        };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { 
          success: false, 
          error: 'Server returned non-JSON response. Please check if the tunnel is properly authenticated.' 
        };
      }

      const data = await response.json();

      if (data.success) {
        this.token = data.token;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        return { 
          success: false, 
          error: 'Server returned HTML instead of JSON. Please authenticate with the tunnel first.' 
        };
      }
      return { success: false, error: 'Network error. Please check if the server is running.' };
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.token) {
        await fetch(`${this.baseURL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  }

  // Verify token
  async verifyToken() {
    if (!this.token) {
      return { success: false, error: 'No token found' };
    }

    try {
      const response = await fetch(`${this.baseURL}/api/verify`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 511) {
          return { 
            success: false, 
            error: 'Network authentication required. Please visit the tunnel URL first.' 
          };
        }
        this.logout();
        return { success: false, error: `Server error: ${response.status}` };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        this.logout();
        return { success: false, error: 'Server returned non-JSON response' };
      }

      const data = await response.json();

      if (data.success) {
        return { success: true, user: data.user };
      } else {
        // Token is invalid, clear it
        this.logout();
        return { success: false, error: 'Invalid token' };
      }
    } catch (error) {
      console.error('Token verification error:', error);
      this.logout();
      if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
        return { success: false, error: 'Server returned HTML instead of JSON' };
      }
      return { success: false, error: 'Network error' };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Make authenticated request
  async authenticatedRequest(url, options = {}) {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    };

    const config = { ...defaultOptions, ...options };
    config.headers = { ...defaultOptions.headers, ...config.headers };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (response.status === 401) {
        // Token expired, logout
        this.logout();
        throw new Error('Session expired');
      }

      return await response.json();
    } catch (error) {
      console.error('Authenticated request error:', error);
      throw error;
    }
  }
}

// Create global auth service instance
window.authService = new AuthService();
