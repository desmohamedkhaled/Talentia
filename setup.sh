#!/bin/bash
# TALENTIA - Implementation & Launch Script
# This file documents the complete setup process

echo "================================"
echo "TALENTIA - Complete Setup Guide"
echo "================================"
echo ""

# Step 1: Firebase Setup
echo "STEP 1: FIREBASE SETUP"
echo "1. Visit: https://console.firebase.google.com"
echo "2. Create new project: 'Talentia'"
echo "3. Enable Firestore Database (test mode)"
echo "4. Enable Cloud Storage (test mode)"
echo "5. Get Firebase credentials from Settings"
echo "6. Copy config to js/firebase.js"
echo ""

# Step 2: Local Testing
echo "STEP 2: LOCAL TESTING"
echo "Run one of these commands:"
echo "  • python -m http.server 8000"
echo "  • npx http-server"
echo "  • Use VS Code Live Server extension"
echo ""
echo "Then visit: http://localhost:8000"
echo ""

# Step 3: Test Admin Panel
echo "STEP 3: TEST ADMIN PANEL"
echo "1. Click 'Admin' button in navbar"
echo "2. Login with password: admin123"
echo "3. Add a test product with image"
echo "4. Verify it appears on products page"
echo ""

# Step 4: Customization
echo "STEP 4: CUSTOMIZATION"
echo "Update these files:"
echo "  • Change admin password: js/admin.js (line 10)"
echo "  • Change colors: css/style.css (lines 9-15)"
echo "  • Update company name: all .html files"
echo "  • Add WhatsApp number: index.html footer"
echo ""

# Step 5: Deployment
echo "STEP 5: DEPLOYMENT TO VERCEL"
echo ""
echo "Option A: GitHub + Vercel"
echo "  1. git init"
echo "  2. git add ."
echo "  3. git commit -m 'Talentia website'"
echo "  4. git push origin main"
echo "  5. Go to vercel.com → Import project"
echo ""
echo "Option B: Vercel CLI"
echo "  1. npm install -g vercel"
echo "  2. vercel login"
echo "  3. vercel"
echo ""

# Step 6: Security
echo "STEP 6: SECURITY CHECKLIST"
echo "Before production:"
echo "  ☐ Change admin password"
echo "  ☐ Set Firebase security rules"
echo "  ☐ Update contact information"
echo "  ☐ Test on real devices"
echo "  ☐ Check all links work"
echo "  ☐ Verify images load"
echo ""

# Step 7: Monitoring
echo "STEP 7: AFTER LAUNCH"
echo "  • Monitor Firebase usage"
echo "  • Backup products monthly"
echo "  • Add new products regularly"
echo "  • Monitor website analytics"
echo "  • Check for broken links"
echo ""

echo "================================"
echo "Setup Complete! Ready to Launch!"
echo "================================"
echo ""
echo "Next: Read START_HERE.md for 5-minute quick start"
