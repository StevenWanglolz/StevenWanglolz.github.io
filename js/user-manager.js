// User Management System - Secure Version
class UserManager {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.getCurrentUser();
    this.loginAttempts = this.loadLoginAttempts();
  }

  // Load users from localStorage (in production, this would be from a secure API)
  loadUsers() {
    try {
      const users = localStorage.getItem('secureUsers');
      return users ? JSON.parse(users) : this.getDefaultUsers();
    } catch (error) {
      console.error('Error loading users:', error);
      return this.getDefaultUsers();
    }
  }

  // Default users for demo (in production, these would be in a secure database)
  getDefaultUsers() {
    const defaultUsers = [
      {
        id: 'admin',
        username: 'admin',
        email: 'admin@dolce.com',
        password: this.hashPassword('admin123!'), // Hashed password
        role: 'admin',
        permissions: ['read', 'write', 'admin', 'user_management'],
        createdAt: Date.now(),
        lastLogin: null,
        isActive: true
      },
      {
        id: 'user1',
        username: 'user1',
        email: 'user1@dolce.com',
        password: this.hashPassword('user123!'),
        role: 'user',
        permissions: ['read', 'write'],
        createdAt: Date.now(),
        lastLogin: null,
        isActive: true
      }
    ];

    this.saveUsers(defaultUsers);
    return defaultUsers;
  }

  // Simple password hashing (in production, use bcrypt or similar)
  hashPassword(password) {
    // This is a simple hash for demo purposes
    // In production, use proper password hashing like bcrypt
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: [
        password.length < minLength ? `密碼長度至少 ${minLength} 個字符` : null,
        !hasUpperCase ? '密碼必須包含大寫字母' : null,
        !hasLowerCase ? '密碼必須包含小寫字母' : null,
        !hasNumbers ? '密碼必須包含數字' : null,
        !hasSpecialChar ? '密碼必須包含特殊字符' : null
      ].filter(Boolean)
    };
  }

  // Authenticate user
  authenticate(username, password) {
    // Check login attempts
    if (this.isAccountLocked(username)) {
      throw new Error('帳戶已被鎖定，請稍後再試');
    }

    const user = this.users.find(u => u.username === username && u.isActive);
    if (!user) {
      this.recordFailedAttempt(username);
      throw new Error('用戶名或密碼錯誤');
    }

    const hashedPassword = this.hashPassword(password);
    if (user.password !== hashedPassword) {
      this.recordFailedAttempt(username);
      throw new Error('用戶名或密碼錯誤');
    }

    // Successful login
    this.clearFailedAttempts(username);
    user.lastLogin = Date.now();
    this.saveUsers(this.users);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };
  }

  // Check if account is locked
  isAccountLocked(username) {
    const attempts = this.loginAttempts[username];
    if (!attempts) return false;

    const now = Date.now();
    const lockoutDuration = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;

    if (attempts.count >= maxAttempts && (now - attempts.lastAttempt) < lockoutDuration) {
      return true;
    }

    // Clear old attempts
    if ((now - attempts.lastAttempt) > lockoutDuration) {
      delete this.loginAttempts[username];
      this.saveLoginAttempts();
    }

    return false;
  }

  // Record failed login attempt
  recordFailedAttempt(username) {
    if (!this.loginAttempts[username]) {
      this.loginAttempts[username] = { count: 0, lastAttempt: 0 };
    }

    this.loginAttempts[username].count++;
    this.loginAttempts[username].lastAttempt = Date.now();
    this.saveLoginAttempts();
  }

  // Clear failed attempts
  clearFailedAttempts(username) {
    delete this.loginAttempts[username];
    this.saveLoginAttempts();
  }

  // Load login attempts
  loadLoginAttempts() {
    try {
      const attempts = localStorage.getItem('loginAttempts');
      return attempts ? JSON.parse(attempts) : {};
    } catch (error) {
      console.error('Error loading login attempts:', error);
      return {};
    }
  }

  // Save login attempts
  saveLoginAttempts() {
    localStorage.setItem('loginAttempts', JSON.stringify(this.loginAttempts));
  }

  // Save users
  saveUsers(users) {
    localStorage.setItem('secureUsers', JSON.stringify(users));
  }

  // Get current user
  getCurrentUser() {
    try {
      const sessionData = sessionStorage.getItem('userSession');
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData);
      return this.users.find(u => u.username === session.username);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user has permission
  hasPermission(permission) {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }

  // Check if user is admin
  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  // Create new user (admin only)
  createUser(userData) {
    if (!this.isAdmin()) {
      throw new Error('只有管理員可以創建用戶');
    }

    const validation = this.validatePassword(userData.password);
    if (!validation.isValid) {
      throw new Error('密碼不符合要求: ' + validation.errors.join(', '));
    }

    const newUser = {
      id: 'user_' + Date.now(),
      username: userData.username,
      email: userData.email,
      password: this.hashPassword(userData.password),
      role: userData.role || 'user',
      permissions: userData.permissions || ['read'],
      createdAt: Date.now(),
      lastLogin: null,
      isActive: true
    };

    this.users.push(newUser);
    this.saveUsers(this.users);
    return newUser;
  }

  // Update user (admin only)
  updateUser(userId, updates) {
    if (!this.isAdmin()) {
      throw new Error('只有管理員可以更新用戶');
    }

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('用戶不存在');
    }

    // Don't allow updating password through this method
    const { password, ...safeUpdates } = updates;
    this.users[userIndex] = { ...this.users[userIndex], ...safeUpdates };
    this.saveUsers(this.users);
    return this.users[userIndex];
  }

  // Delete user (admin only)
  deleteUser(userId) {
    if (!this.isAdmin()) {
      throw new Error('只有管理員可以刪除用戶');
    }

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('用戶不存在');
    }

    this.users.splice(userIndex, 1);
    this.saveUsers(this.users);
    return true;
  }

  // Get all users (admin only)
  getAllUsers() {
    if (!this.isAdmin()) {
      throw new Error('只有管理員可以查看所有用戶');
    }

    return this.users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
  }
}

// Create global user manager instance
window.userManager = new UserManager();
