// Demo Protection System
class DemoProtection {
  constructor() {
    this.accessCode = this.generateAccessCode(); // Dynamic access code
    this.maxAttempts = 3;
    this.lockoutTime = 5 * 60 * 1000; // 5 minutes
    this.attempts = this.loadAttempts();
  }

  // Generate dynamic access code that changes daily
  generateAccessCode() {
    const secret = 'Dolce2024';
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const combined = secret + today;
    
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    // Convert to uppercase alphanumeric code
    const base = Math.abs(hash).toString(36).toUpperCase();
    return base.slice(0, 8);
  }

  // Display today's credentials in console (for demo purposes)
  displayCredentials() {
    const accessCode = this.accessCode;
    const secret = 'Dolce2024';
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    function generatePassword(user) {
      const combined = secret + today + user;
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      const base = Math.abs(hash).toString(36);
      return base.slice(0, 8) + '!';
    }
    
    console.log('🔐 Today\'s Demo Credentials:');
    console.log('Access Code:', accessCode);
    console.log('Admin Password:', generatePassword('admin'));
    console.log('Demo Password:', generatePassword('demo'));
    console.log('Date:', new Date().toISOString().slice(0, 10));
  }

  // Check if access code is required
  isAccessCodeRequired() {
    const lastAccess = localStorage.getItem('demoAccessGranted');
    if (!lastAccess) return true;
    
    const accessTime = parseInt(lastAccess);
    const now = Date.now();
    const accessValidFor = 24 * 60 * 60 * 1000; // 24 hours
    
    return (now - accessTime) > accessValidFor;
  }

  // Validate access code
  validateAccessCode(code) {
    if (this.isLockedOut()) {
      throw new Error('Too many failed attempts. Please try again later.');
    }

    if (code === this.accessCode) {
      this.grantAccess();
      return true;
    } else {
      this.recordFailedAttempt();
      throw new Error('Invalid access code');
    }
  }

  // Grant access
  grantAccess() {
    localStorage.setItem('demoAccessGranted', Date.now().toString());
    this.clearAttempts();
  }

  // Check if locked out
  isLockedOut() {
    if (!this.attempts.lastAttempt) return false;
    
    const now = Date.now();
    const timeSinceLastAttempt = now - this.attempts.lastAttempt;
    
    if (this.attempts.count >= this.maxAttempts && timeSinceLastAttempt < this.lockoutTime) {
      return true;
    }
    
    // Clear old attempts
    if (timeSinceLastAttempt > this.lockoutTime) {
      this.clearAttempts();
    }
    
    return false;
  }

  // Record failed attempt
  recordFailedAttempt() {
    this.attempts.count = (this.attempts.count || 0) + 1;
    this.attempts.lastAttempt = Date.now();
    this.saveAttempts();
  }

  // Clear attempts
  clearAttempts() {
    this.attempts = { count: 0, lastAttempt: null };
    this.saveAttempts();
  }

  // Load attempts from localStorage
  loadAttempts() {
    try {
      const attempts = localStorage.getItem('demoAccessAttempts');
      return attempts ? JSON.parse(attempts) : { count: 0, lastAttempt: null };
    } catch (error) {
      return { count: 0, lastAttempt: null };
    }
  }

  // Save attempts to localStorage
  saveAttempts() {
    localStorage.setItem('demoAccessAttempts', JSON.stringify(this.attempts));
  }

  // Show access code prompt
  showAccessPrompt() {
    return new Promise((resolve, reject) => {
      const modal = document.createElement('div');
      modal.className = 'access-modal-overlay';
      modal.innerHTML = `
        <div class="access-modal">
          <div class="access-modal-header">
            <h3>🔐 Demo Access Required</h3>
            <p>This is a private demo. Please enter the access code to continue.</p>
          </div>
          <div class="access-modal-body">
            <input type="password" id="accessCodeInput" placeholder="Enter access code" />
            <div id="accessError" class="access-error" style="display: none;"></div>
          </div>
          <div class="access-modal-footer">
            <button id="accessSubmitBtn" class="btn btn-primary">Access Demo</button>
          </div>
        </div>
      `;

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .access-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        .access-modal {
          background: white;
          border-radius: 8px;
          padding: 30px;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }
        .access-modal-header h3 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .access-modal-header p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 14px;
        }
        .access-modal-body input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .access-modal-body input:focus {
          outline: none;
          border-color: #007bff;
        }
        .access-error {
          color: #dc3545;
          font-size: 14px;
          margin-top: 10px;
        }
        .access-modal-footer {
          margin-top: 20px;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .btn-primary {
          background: #007bff;
          color: white;
        }
        .btn-primary:hover {
          background: #0056b3;
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(modal);

      const input = modal.querySelector('#accessCodeInput');
      const submitBtn = modal.querySelector('#accessSubmitBtn');
      const errorDiv = modal.querySelector('#accessError');

      const handleSubmit = () => {
        const code = input.value.trim();
        try {
          if (window.demoProtection.validateAccessCode(code)) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
            resolve(true);
          }
        } catch (error) {
          errorDiv.textContent = error.message;
          errorDiv.style.display = 'block';
          input.value = '';
          input.focus();
        }
      };

      submitBtn.addEventListener('click', handleSubmit);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      });

      input.focus();
    });
  }
}

// Create global demo protection instance
window.demoProtection = new DemoProtection();
