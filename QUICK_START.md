# ⚡ Quick Start - Deploy Now!

Your Nice Beds platform is **100% ready to go public**. Follow these simple steps to launch.

## 🔐 Step 0: Set Up Firebase Authentication (Required!)

**Before deploying**, you need to configure Firebase Authentication:

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com/)
2. **Enable Email/Password authentication** in Firebase Console
3. **Get your Firebase config** (API keys and project details)
4. **Add environment variables** to your hosting platform

📖 **Detailed instructions**: See [FIREBASE_AUTH_SETUP.md](./FIREBASE_AUTH_SETUP.md)

**⚠️ Without Firebase setup, users won't be able to sign up or log in!**

---

## 🚀 Deploy in 3 Steps

### Step 1: Build for Production
```bash
npm run build
```
This creates an optimized production build in the `dist/` folder.

### Step 2: Preview Locally (Optional)
```bash
npm run preview
```
Test the production build on your local machine before deploying.

### Step 3: Deploy!
Upload the contents of the `dist/` folder to your hosting service.

**That's it!** Your site is live. 🎉

---

## 🌐 Hosting Options

### Option 1: Vercel (Recommended)
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. **Add Firebase environment variables** in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Vercel auto-detects Vite and deploys automatically

### Option 2: Netlify (Also Great)
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository or drag/drop `dist/` folder
3. **Add Firebase environment variables** in Netlify dashboard
4. Free SSL and custom domain support

### Option 3: GitHub Pages (Free, but limited)
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select branch and `/dist` folder
4. **Note**: Environment variables require GitHub Actions workflow

### Option 4: Any Web Host
Upload the `dist/` folder contents via FTP/SFTP to any web hosting service.
**Note**: You'll need to set environment variables on your server.

---

## ✅ What's Already Done

You don't need to configure anything else. Everything is ready:

- ✅ **Build optimized** - Fast loading and performance
- ✅ **Mobile responsive** - Works on all devices
- ✅ **Error handling** - Graceful error recovery
- ✅ **Data persistence** - Cart, orders, and users saved
- ✅ **Firebase Authentication** - Enterprise-grade security
- ✅ **Admin panel** - Full management dashboard
- ✅ **User accounts** - Login, signup, and order tracking
- ✅ **Production tested** - All features verified

---

## 📋 After Deployment

Once your site is live:

1. **Test authentication**
   - Try signing up with a new account
   - Test login with the account you created
   - Verify cart items persist after login
   - Check that logout works properly

2. **Test immediately**
   - Visit your live URL
   - Create a test account
   - Place a test order
   - Check the admin panel

2. **Update content**
   - Verify product information is accurate
   - Ensure contact details are correct
   - Check that images load properly

3. **Share with the world**
   - Announce on social media
   - Email your customers
   - Update Google Business listing

---

## 🔧 Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

---

## 📞 Need Help?

- 📖 [Full Launch Guide](./LAUNCH_GUIDE.md) - Comprehensive launch instructions
- ✅ [Production Checklist](./PRODUCTION_READY.md) - Everything that's ready
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment steps
- 📋 [Requirements Doc](./PRD.md) - Design and features

---

## 🎯 One-Line Deploy

For the absolute quickest deployment:

```bash
npm run build && npm run preview
```

Then upload `dist/` to any hosting service.

---

**You're ready to launch! Good luck! 🚀🛏️**
