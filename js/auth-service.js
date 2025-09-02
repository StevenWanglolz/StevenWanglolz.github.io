// Simple Authentication Service - Frontend Only
class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Simple login with just empty field validation
  async login(username, password) {
    // Basic validation - just check if fields are not empty
    if (!username || !password) {
      return { 
        success: false, 
        error: '請填寫所有必填欄位' 
      };
    }

    // Simulate a brief loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For demo purposes, accept any non-empty username/password
    this.token = `demo_token_${Date.now()}`;
    localStorage.setItem('authToken', this.token);
    localStorage.setItem('currentUser', JSON.stringify({
      id: username,
      username: username,
      role: username === 'admin' ? 'admin' : 'user'
    }));

    return { 
      success: true, 
      user: { 
        id: username, 
        username: username, 
        role: username === 'admin' ? 'admin' : 'user' 
      } 
    };
  }

  // Simple logout
  async logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  // Simple token verification
  async verifyToken() {
    if (!this.token) {
      return { success: false, error: 'No token found' };
    }

    const user = localStorage.getItem('currentUser');
    if (user) {
      return { success: true, user: JSON.parse(user) };
    } else {
      this.logout();
      return { success: false, error: 'Invalid token' };
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

  // Simple mock request (no actual network calls)
  async authenticatedRequest(url, options = {}) {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    // Return mock data for demo purposes
    return { 
      success: true, 
      message: 'Demo data loaded successfully',
      data: { url, timestamp: new Date().toISOString() }
    };
  }
}

// Create global auth service instance
window.authService = new AuthService();
