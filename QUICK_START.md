# 🚀 TALENTIA - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Get Firebase Credentials (2 min)

1. Go to https://console.firebase.google.com
2. Create a new project called "Talentia"
3. Click Settings (⚙️) → Project Settings
4. Scroll to "Your apps" → Click Web icon (</> )
5. Register app → Copy the config object

### Step 2: Add Firebase Credentials (1 min)

1. Open `js/firebase.js`
2. Paste your Firebase config (replace placeholder)
3. Save file

### Step 3: Enable Firebase Features (1 min)

In Firebase Console:
- **Firestore Database**: Create database → Start in test mode
- **Cloud Storage**: Get started → Start in test mode

### Step 4: Test Locally (1 min)

```bash
# Run local server
python -m http.server 8000

# Open browser
http://localhost:8000
```

**Test Steps:**
1. ✅ Visit homepage - should load beautifully
2. ✅ Go to /admin.html - login with `admin123`
3. ✅ Add a test product with image
4. ✅ Go to /products.html - see product appear instantly
5. ✅ Edit/Delete product - updates real-time

---

## 🌐 Deploy to Vercel (3 min)

### Option A: GitHub + Vercel (Easiest)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Talentia website"
git push origin main

# 2. Go to vercel.com
# 3. Import → Select your GitHub repo
# 4. Deploy!
# 5. Add Firebase credentials in Vercel Settings
```

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
# Follow prompts and you're live!
```

---

## 📝 File Structure

```
TALENTIA/
├── index.html              ← Home page
├── products.html           ← Products page  
├── admin.html              ← Admin panel
├── css/style.css           ← All styles
├── js/
│   ├── firebase.js         ← Firebase setup
│   ├── main.js             ← Global functions
│   ├── products.js         ← Products page logic
│   └── admin.js            ← Admin logic
└── README.md               ← Full documentation
```

---

## 🎯 Key Features

| Feature | Status |
|---------|--------|
| Luxury Gold-Black Design | ✅ |
| Hero Section | ✅ |
| Products Page | ✅ |
| Real-Time Firebase Sync | ✅ |
| Admin Panel (CRUD) | ✅ |
| Image Upload | ✅ |
| WhatsApp Integration | ✅ |
| Responsive Design | ✅ |
| Production Ready | ✅ |

---

## 🔐 Admin Panel

**URL:** `/admin.html`  
**Password:** `admin123` (change before production!)

**Features:**
- ✅ Add products with image upload
- ✅ Edit product details
- ✅ Delete products
- ✅ Real-time sync to products page
- ✅ Image management via Firebase Storage

---

## 🎨 Customization

### Change Admin Password
Edit `js/admin.js` line 10:
```javascript
const ADMIN_PASSWORD = 'your-new-password';
```

### Change Colors
Edit `css/style.css` at top:
```css
:root {
  --gold: #D4AF37;           /* Main gold color */
  --primary-bg: #0B0B0B;     /* Background */
  --text-primary: #FAF7F2;   /* Text color */
}
```

### Change WhatsApp Number
Update in `index.html` and `products.html`

---

## 🐛 Troubleshooting

### "Firebase not initialized"
→ Check `js/firebase.js` has correct credentials

### "Products not loading"
→ Verify Firestore database is created and enabled

### "Image upload fails"
→ Verify Cloud Storage is enabled and max 5MB

### "Admin login doesn't work"
→ Check password is correct (default: `admin123`)

---

## 📚 Full Documentation

See `README.md` for complete setup guide, Firebase security rules, database structure, and advanced customization.

---

## ✨ Next Steps

1. ✅ Add your Firebase credentials
2. ✅ Test locally
3. ✅ Add some products via admin panel
4. ✅ Deploy to Vercel
5. ✅ Change admin password
6. ✅ Set up Firebase security rules for production
7. ✅ Add your WhatsApp number
8. ✅ Customize colors and branding

---

## 📞 Need Help?

- Firebase Docs: https://firebase.google.com/docs
- Vercel Docs: https://vercel.com/docs
- Browser Console: Press F12 for error messages

---

**You're all set! 🎉 Your luxury e-commerce website is ready to go live.**
