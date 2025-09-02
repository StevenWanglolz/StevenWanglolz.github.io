// Login - Wireframe Version
document.addEventListener('DOMContentLoaded', function() {
  console.log('Login page loaded');
  
  // DOM Elements
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = loginBtn.querySelector('.btn-text');
  const btnLoader = loginBtn.querySelector('.btn-loader');
  const loginError = document.getElementById('loginError');
  const firstLoginTip = document.getElementById('firstLoginTip');
  const passwordExpiryTip = document.getElementById('passwordExpiryTip');
  
  // Initialize page
  initializePage();
  
  // Event Listeners
  loginForm.addEventListener('submit', handleLogin);
  togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
  
  // Initialize page
  function initializePage() {
    console.log('Initializing login page...');
    
    // Show tips based on conditions (simulated)
    showTips();
    
    // Focus on username input
    usernameInput.focus();
  }
  
  // Show relevant tips
  function showTips() {
    // Simulate first login check
    const isFirstLogin = Math.random() > 0.7; // 30% chance
    if (isFirstLogin) {
      firstLoginTip.style.display = 'flex';
    }
    
    // Simulate password expiry check
    const isPasswordExpired = Math.random() > 0.8; // 20% chance
    if (isPasswordExpired) {
      passwordExpiryTip.style.display = 'flex';
    }
  }
  
  // Toggle password visibility
  function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    // Update button icon
    togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
  }
  
  // Handle login form submission
  function handleLogin(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Hide any existing error
    hideError();
    
    // Basic validation
    if (!username || !password) {
      showError('請填寫所有必填欄位');
      return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoadingState(false);
      
      // For wireframe demo - always succeed
      handleLoginSuccess(username);
    }, 1000);
  }
  
  // Set loading state
  function setLoadingState(isLoading) {
    loginBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'block';
    btnLoader.style.display = isLoading ? 'block' : 'none';
  }
  
  // Handle successful login
  function handleLoginSuccess(username) {
    console.log('Login successful for:', username);
    
    // Store username if needed
    localStorage.setItem('currentUser', username);
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  }
  
  // Show error message
  function showError(message) {
    if (loginError) {
      loginError.querySelector('.alert-content').innerHTML = `<strong>錯誤：</strong>${message}`;
      loginError.style.display = 'flex';
    }
  }
  
  // Hide error message
  function hideError() {
    if (loginError) {
      loginError.style.display = 'none';
    }
  }
  
  // Add some interactive features
  addInteractiveFeatures();
  
  function addInteractiveFeatures() {
    // Auto-hide tips after 5 seconds
    setTimeout(() => {
      if (firstLoginTip) firstLoginTip.style.display = 'none';
      if (passwordExpiryTip) passwordExpiryTip.style.display = 'none';
    }, 5000);
    
    // Enter key navigation
    usernameInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        passwordInput.focus();
      }
    });
    
    passwordInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        loginBtn.click();
      }
    });
  }
  
  console.log('Login page initialization complete');
});
