// Simple Frontend Authentication (No Backend Required)
class SimpleAuth {
  constructor() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        password: 'AdminPass2024!',
        role: 'admin',
        permissions: ['read', 'write', 'admin', 'user_management']
      },
      {
        id: 2,
        username: 'demo',
        password: 'DemoPass2024!',
        role: 'user',
        permissions: ['read', 'write']
      }
    ];
    
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  // Simple password hashing (for demo purposes)
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  // Login user
  async login(username, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Simple password check (in production, use proper hashing)
    if (user.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Create session
    this.currentUser = { ...user };
    delete this.currentUser.password; // Remove password from user object
    this.isAuthenticated = true;
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    return { success: true, user: this.currentUser };
  }

  // Logout user
  async logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    return { success: true };
  }

  // Verify authentication
  async verifyToken() {
    const storedUser = localStorage.getItem('currentUser');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedUser && storedAuth === 'true') {
      this.currentUser = JSON.parse(storedUser);
      this.isAuthenticated = true;
      return { success: true, user: this.currentUser };
    }
    
    return { success: false, error: 'Not authenticated' };
  }

  // Check if authenticated
  isUserAuthenticated() {
    return this.isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';
  }

  // Get current user
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}

// Create global auth instance
window.authService = new SimpleAuth();
