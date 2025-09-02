// Authentication Service
class AuthService {
  constructor() {
    this.baseURL = this.getBaseURL();
    this.token = localStorage.getItem('authToken');
  }

  getBaseURL() {
    // Always use localhost for backend server
    // You'll need to run the backend server locally
    return 'http://localhost:3000';
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
