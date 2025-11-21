# Firebase Configuration Guide

## Current Status

Your website is built and ready, but **Firebase is not yet configured**. This is why the admin panel's "Add Product" button isn't working.

## ⚠️ Important

The website **requires real Firebase credentials** to function. The current `firebaseConfig` in `js/firebase.js` contains placeholder values. You must replace these with real credentials from your Firebase project.

## Step-by-Step Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or select existing project)
3. Give your project a name: `Talentia` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"** and wait for it to finish

### Step 2: Get Your Firebase Credentials

1. In Firebase Console, click the **gear icon** ⚙️ (top left)
2. Select **"Project settings"**
3. Go to the **"General"** tab
4. Scroll down to **"Your apps"** section
5. Click **"Add app"** and select **"Web"** (</> icon)
6. Register the app with a name like `Talentia Website`
7. Copy the entire `firebaseConfig` object that appears
8. It will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDx...",
  authDomain: "talentia-xxxx.firebaseapp.com",
  projectId: "talentia-xxxx",
  storageBucket: "talentia-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### Step 3: Update Your Code

1. Open `js/firebase.js` in VS Code
2. Find the `firebaseConfig` object at the top (around line 5)
3. **Replace the placeholder values** with your real credentials from Step 2
4. Save the file

**Before (Placeholder):**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**After (Your Real Config):**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDx...",
  authDomain: "talentia-xxxx.firebaseapp.com",
  projectId: "talentia-xxxx",
  storageBucket: "talentia-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### Step 4: Create Firestore Database

1. In Firebase Console, click **"Firestore Database"** (left menu)
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select a region (closest to your users recommended)
5. Click **"Enable"**

### Step 5: Create Cloud Storage Bucket

1. In Firebase Console, click **"Storage"** (left menu)
2. Click **"Get started"**
3. Accept the default security rules (for now)
4. Select a region matching your Firestore region
5. Click **"Done"**

### Step 6: Set Firestore Security Rules

1. In Firebase Console, go to **"Firestore Database"**
2. Click the **"Rules"** tab
3. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to products
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow any write for now (remove this in production)
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

4. Click **"Publish"**

### Step 7: Test the Admin Panel

1. Open `admin.html` in your browser
2. Enter the password (default: `admin123`)
3. Try adding a product
4. Check browser console (F12 → Console tab) for debug messages
5. Look for green checkmarks: ✓ Firebase initialized successfully

## Troubleshooting

### "Firebase not initialized" Error

**Cause:** Placeholder credentials are still in use.

**Solution:** Follow Step 2-3 above to get real credentials.

### "Permission denied" Error

**Cause:** Security rules aren't set correctly.

**Solution:** Check Firestore Security Rules (Step 6).

### "CORS error" or "Network error"

**Cause:** Firebase SDK not loading or network issue.

**Solution:** 
1. Check browser console (F12 → Console)
2. Ensure you have internet connection
3. Check that Firebase CDN link is in HTML file

### "File size exceeds 5MB limit"

**Cause:** Image file is too large.

**Solution:** Use smaller images (under 5MB).

## Verifying Setup

When everything is configured correctly, you should see in browser console (F12 → Console tab):

```
✓ Firebase SDK detected
✓ Firebase initialized successfully
✓ Firestore ready
✓ Cloud Storage ready
```

## What's Next?

Once Firebase is configured:

1. **Test Locally** - Open `admin.html` and add a product
2. **Check Products Page** - Go to `products.html` to see your products in real-time
3. **Deploy to Vercel** - Follow instructions in `LAUNCH_CHECKLIST.md`

## Important Security Notes

⚠️ **For Production:**
- The current setup has very permissive security rules
- Before launching publicly, implement proper authentication
- Don't commit `firebaseConfig` with real credentials to public repositories
- Consider using environment variables for sensitive data

## Questions?

Check these files for more info:
- `FIRESTORE_GUIDE.md` - Database structure details
- `API_REFERENCE.md` - Function documentation
- `QUICK_START.md` - Quick reference guide

---

**Status:** Setup required before admin panel will work.

**Next action:** Update `js/firebase.js` with your real Firebase credentials → Test admin panel → Deploy to Vercel
