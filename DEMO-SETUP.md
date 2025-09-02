# Demo Setup Guide

## 🔐 Demo Authentication

This is a **demo version** with basic frontend-only authentication. No backend server required!

### Demo Login Credentials:
- **Access Code**: Changes daily (check browser console or use credential generator)
- **Admin Access**: 
  - Username: `admin`
  - Password: Changes daily (generated dynamically)
  
- **Demo User Access**:
  - Username: `demo` 
  - Password: Changes daily (generated dynamically)

### How to Get Today's Credentials:
1. Visit your demo site
2. Open browser console (F12)
3. Run the credential generator script (see DEMO-CREDENTIALS.md)
4. Use the generated access code and passwords

## 🚀 How to Deploy

### Option 1: GitHub Pages (Current Setup)
1. Your site is already deployed at: `https://stevenwanglolz.github.io/`
2. Anyone with the demo credentials can access it
3. Perfect for showing to clients/stakeholders

### Option 2: Private Demo
If you want to restrict access further:

1. **Add a simple access code** (see below)
2. **Use GitHub private repository** (requires GitHub Pro)
3. **Deploy to a private server** with additional protection

## 🛡️ Security Features (Demo Version)

✅ **Frontend Authentication** - Basic login protection
✅ **Session Management** - 24-hour session timeout
✅ **Account Lockout** - 5 failed attempts = 15-minute lockout
✅ **Password Protection** - Strong demo passwords
✅ **Role-based Access** - Admin vs User permissions

## 🔧 For Production Use

When you're ready to go live with real users:

1. **Set up a backend server** (use the provided `server-config.js`)
2. **Use a real database** (PostgreSQL, MongoDB)
3. **Implement proper password hashing** (bcrypt)
4. **Add HTTPS/SSL certificates**
5. **Set up monitoring and logging**

## 📝 Demo Limitations

- Passwords are stored in browser localStorage (not secure for production)
- No real database backend
- No email verification
- No password reset functionality
- No audit logging

## 🎯 Perfect For:
- Client demonstrations
- Stakeholder presentations  
- Internal testing
- Proof of concept
- Portfolio showcase

## ⚠️ Not Suitable For:
- Production use with real users
- Handling sensitive data
- High-security environments
- Public access without restrictions
