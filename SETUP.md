# 🚀 Backend Authentication Setup

## ✅ **SECURE SOLUTION - Backend Authentication!**

Your demo now uses a **secure backend server** with predefined credentials. No one can access it without the correct username and password!

## 🔐 **Default Credentials:**

- **Admin**: `admin` / `AdminPass2024!`
- **Demo User**: `demo` / `DemoPass2024!`

⚠️ **IMPORTANT**: Change these credentials in `server.js` before production!

## 🚀 **Quick Start:**

### **1. Install Dependencies:**
```bash
npm install
```

### **2. Start the Server:**
```bash
npm start
```

### **3. Access Your Demo:**
- **Local**: `http://localhost:3000`
- **Login**: Use the credentials above

## 🔧 **Development Mode:**
```bash
npm run dev
```
This will auto-restart the server when you make changes.

## 🔐 **Security Features:**

✅ **Backend Authentication** - Secure server-side validation
✅ **JWT Tokens** - Secure session management
✅ **Password Hashing** - Bcrypt encryption
✅ **Predefined Users** - No random access
✅ **Token Verification** - Automatic session validation
✅ **Secure Logout** - Proper session cleanup

## 📝 **File Structure:**

```
├── server.js              # Main backend server
├── package.json           # Dependencies
├── js/
│   ├── auth-service.js    # Frontend authentication
│   ├── login.js          # Login page logic
│   └── dashboard.js      # Dashboard logic
├── html/                 # HTML pages
├── css/                  # Stylesheets
└── SETUP.md             # This file
```

## 🛠️ **Customization:**

### **Change Credentials:**
Edit `server.js` and update the `users` array:
```javascript
const users = [
  {
    id: 1,
    username: 'your-username',
    password: '$2b$10$...', // Use bcrypt to hash your password
    role: 'admin',
    permissions: ['read', 'write', 'admin', 'user_management']
  }
];
```

### **Add New Users:**
Add more users to the `users` array in `server.js`.

### **Change JWT Secret:**
Set the `JWT_SECRET` environment variable or change it in `server.js`.

## 🌐 **Deployment:**

### **Local Development:**
- Server runs on `http://localhost:3000`
- Frontend served from the same server

### **Production Deployment:**
1. Deploy `server.js` to your hosting service
2. Update the `baseURL` in `js/auth-service.js`
3. Set environment variables for production

## 🎯 **Perfect For:**
- Secure demos
- Client presentations
- Internal testing
- Portfolio showcase
- Controlled access

## 🔒 **Security Benefits:**
- No public access without credentials
- Server-side validation
- Secure password storage
- JWT token authentication
- Automatic session management
