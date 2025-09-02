# 🚀 Hybrid Authentication Setup (GitHub Pages + Local Backend)

## ✅ **SECURE SOLUTION - Frontend on GitHub Pages + Backend on Local Server!**

Your demo uses **GitHub Pages for the frontend** and a **local backend server for authentication**. This gives you the best of both worlds!

## 🔐 **Default Credentials:**

- **Admin**: `admin` / `AdminPass2024!`
- **Demo User**: `demo` / `DemoPass2024!`

⚠️ **IMPORTANT**: Change these credentials in `server.js` before production!

## 🚀 **Quick Start:**

### **1. Install Dependencies:**

```bash
npm install
```

### **2. Start the Backend Server:**

```bash
npm start
```

### **3. Access Your Demo:**

- **Frontend**: `https://stevenwanglolz.github.io/` (GitHub Pages)
- **Backend**: `http://localhost:3000` (Your local server)
- **Login**: Use the credentials above

### **4. How It Works:**

1. **Frontend** runs on GitHub Pages (publicly accessible)
2. **Backend** runs on your local machine (private authentication)
3. **Authentication** happens via API calls to your local server
4. **Only you** can run the backend server, so only you control access

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

### **Current Setup (Recommended):**

- **Frontend**: Deployed on GitHub Pages (automatic)
- **Backend**: Run locally on your machine
- **Access Control**: Only you can start the backend server

### **For Demo Sharing:**

1. **Start your backend server** (`npm start`)
2. **Share your GitHub Pages URL** with demo audience
3. **They can access the frontend** but can't log in without your backend running
4. **You control access** by starting/stopping your local server

### **Production Deployment (Optional):**

1. Deploy `server.js` to a hosting service (Heroku, Railway, etc.)
2. Update the `baseURL` in `js/auth-service.js` to point to your deployed backend
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
