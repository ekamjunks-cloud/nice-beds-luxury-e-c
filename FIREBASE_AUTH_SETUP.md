# Firebase Authentication Setup Guide

This application now uses **Firebase Authentication** for secure user authentication. Firebase provides enterprise-grade security, automatic scaling, and built-in protection against common security vulnerabilities.

## Why Firebase Authentication?

✅ **Enterprise Security**: Battle-tested authentication system used by millions of apps  
✅ **No Password Storage**: Passwords are never stored in your database  
✅ **Automatic Scaling**: Handles any number of users without infrastructure changes  
✅ **Built-in Protection**: Protection against brute force attacks, credential stuffing, etc.  
✅ **Easy Integration**: Works seamlessly with your existing app  
✅ **Free Tier**: Generous free tier for most applications  

## Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter your project name (e.g., "Nice Beds")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click **"Create project"**

### 2. Enable Email/Password Authentication

1. In your Firebase project, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

### 3. Register Your Web App

1. In Firebase Console, click the **⚙️ (gear icon)** next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **"</> Web"** icon to add a web app
5. Enter an app nickname (e.g., "Nice Beds Web")
6. **Do NOT** check "Also set up Firebase Hosting" (unless you want to use Firebase Hosting)
7. Click **"Register app"**

### 4. Get Your Firebase Configuration

After registering your app, Firebase will show you a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 5. Add Configuration to Your App

#### For Local Development

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Copy the values from your Firebase config and add them to `.env`:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Important**: Add `.env` to your `.gitignore` file so you don't commit secrets!

#### For Production (Vercel/Netlify/etc.)

1. Go to your hosting provider's dashboard
2. Find the **Environment Variables** section
3. Add each variable from above:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 6. Configure Authorized Domains

To prevent unauthorized use of your Firebase project:

1. In Firebase Console, go to **Authentication**
2. Click the **"Settings"** tab
3. Scroll to **"Authorized domains"**
4. Add your production domain(s) (e.g., `nicebeds.co.uk`, `www.nicebeds.co.uk`)
5. `localhost` is already authorized for development

## Security Best Practices

### 1. Set Up Password Requirements

Firebase automatically enforces minimum password length (6 characters), but we've added additional validation:

- ✅ Minimum 8 characters
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number

### 2. Enable Email Verification (Optional but Recommended)

```typescript
import { sendEmailVerification } from 'firebase/auth'

// After user signs up
await sendEmailVerification(userCredential.user)
```

### 3. Set Up Password Reset

Password reset is automatically handled by Firebase:

```typescript
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'

await sendPasswordResetEmail(auth, email)
```

### 4. Configure Security Rules

In Firebase Console:
1. Go to **Authentication** > **Settings** > **Advanced**
2. Configure:
   - **Session duration**: Set according to your needs
   - **Password policy**: Enforce strong passwords
   - **Account enumeration protection**: Enable to prevent email discovery

## Features

### ✅ What's Included

- **Email/Password Signup**: Users can create accounts with email and password
- **Email/Password Login**: Secure authentication
- **Logout**: Proper session management
- **Anonymous Cart Migration**: Cart items persist after signup/login
- **Wishlist Migration**: Wishlist items persist after signup/login
- **Session Persistence**: Users stay logged in across page refreshes
- **Error Handling**: User-friendly error messages for all auth scenarios

### 🔜 Optional Enhancements (Not Implemented Yet)

- Email verification
- Password reset via email
- Social login (Google, Facebook, etc.)
- Multi-factor authentication (MFA)
- Phone authentication

## How It Works

### User Signup Flow

1. User fills out signup form (name, email, password, optional phone)
2. Frontend validates password strength
3. Firebase creates the user account securely
4. User profile is updated with display name
5. Anonymous cart/wishlist items are migrated to the user account
6. User is automatically logged in

### User Login Flow

1. User enters email and password
2. Firebase verifies credentials
3. If valid, user session is created
4. Anonymous cart/wishlist items are migrated to the user account
5. User can now track orders and see their saved data

### Session Management

- Firebase handles session tokens automatically
- Sessions persist across page refreshes using `onAuthStateChanged`
- Sessions are stored securely in browser storage
- Logout properly clears all session data

## Troubleshooting

### "Network error" on signup/login
- Check your internet connection
- Verify Firebase credentials in `.env` are correct
- Check Firebase Console for any service outages

### "Too many requests" error
- Firebase has rate limiting for security
- Wait a few minutes and try again
- Consider implementing exponential backoff for retry logic

### Users not staying logged in
- Check browser settings - cookies/local storage must be enabled
- Verify `onAuthStateChanged` listener is set up correctly
- Check for any errors in browser console

### Email already exists
- User has already signed up with that email
- Direct them to the login page
- Implement "forgot password" functionality if needed

## Migration from Old Auth System

The old authentication system used local KV storage for user credentials. Firebase replaces this entirely:

**Old System (Removed)**:
- Passwords stored with bcrypt hashing
- User data in KV storage
- Manual session management

**New System (Current)**:
- No password storage (Firebase handles it)
- User authentication via Firebase
- Automatic session management
- Enhanced security features

**What This Means for Existing Users**:
- Existing user accounts in KV storage won't work anymore
- Users will need to create new accounts with Firebase
- Consider implementing a migration script if you have existing users

## Cost Considerations

Firebase Authentication is **free** for most use cases:

- **Free Tier**: 50,000 monthly active users
- **Phone Authentication**: $0.01 per verification (first 10k/month free)
- **Email/Password**: Completely free, unlimited

For a small to medium ecommerce site, you'll likely never exceed the free tier.

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs/auth)
- [Firebase Support](https://firebase.google.com/support)

For app-specific issues:
- Check the browser console for errors
- Review the Firebase Console for authentication logs
- Check your environment variables are set correctly
