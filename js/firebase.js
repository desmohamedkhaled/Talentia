// ===== FIREBASE INITIALIZATION =====
// IMPORTANT: Replace these with your Firebase project credentials
// Get these from: https://console.firebase.google.com/project/YOUR_PROJECT/settings/general

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db;
let storage;
let firebaseReady = false;

// Check if Firebase SDK is loaded
if (typeof firebase === 'undefined') {
  console.error('✗ Firebase SDK not loaded. Make sure Firebase CDN is included in HTML before this script.');
} else {
  console.log('✓ Firebase SDK detected');
  
  try {
    // Check if config has been updated from placeholder values
    if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
      console.warn('⚠ Firebase config still has placeholder values. Please update with real credentials.');
      console.warn('Instructions:');
      console.warn('1. Go to https://console.firebase.google.com/');
      console.warn('2. Create a new project or select existing');
      console.warn('3. Copy your project settings');
      console.warn('4. Paste values into firebaseConfig above');
    }
    
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    firebaseReady = true;
    console.log('✓ Firebase initialized successfully');
    console.log('✓ Firestore ready');
    console.log('✓ Cloud Storage ready');
  } catch (error) {
    console.error('✗ Firebase initialization error:', error.message);
    console.error('Error details:', error);
    if (error.code === 'app/duplicate-app') {
      console.warn('Note: Firebase app already initialized (possibly by another script)');
      // Try to get existing instance
      try {
        db = firebase.firestore();
        storage = firebase.storage();
        firebaseReady = true;
      } catch (e) {
        console.error('Could not get existing Firebase instance:', e);
      }
    }
  }
}

// ===== FIREBASE STORAGE HELPER FUNCTIONS =====

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} folder - Storage folder path (e.g., 'products')
 * @returns {Promise<string>} - Download URL of uploaded image
 */
async function uploadImage(file, folder = 'products') {
  try {
    // Validate file
    if (!file) throw new Error('No file provided');
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please use JPG, PNG, or WebP');
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}_${file.name.replace(/\s+/g, '_')}`;

    // Upload to Storage
    const storageRef = firebase.storage().ref(filename);
    const uploadTask = storageRef.put(file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          // Get download URL
          const downloadURL = await storageRef.getDownloadURL();
          console.log('✓ Image uploaded successfully:', downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Image upload error:', error.message);
    throw error;
  }
}

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - Download URL of the image to delete
 */
async function deleteImage(imageUrl) {
  try {
    if (!imageUrl) return;
    
    // Extract path from URL
    const regex = /\/o\/(.*?)\?/;
    const match = imageUrl.match(regex);
    
    if (match && match[1]) {
      const filepath = decodeURIComponent(match[1]);
      const fileRef = firebase.storage().ref(filepath);
      await fileRef.delete();
      console.log('✓ Image deleted successfully');
    }
  } catch (error) {
    console.error('Image deletion error:', error.message);
    // Don't throw - deletion is non-critical
  }
}

// ===== FIRESTORE HELPER FUNCTIONS =====

/**
 * Add a new product to Firestore
 * @param {Object} productData - Product object {name, price, description, imageUrl}
 * @returns {Promise<string>} - Document ID
 */
async function addProductToFirestore(productData) {
  try {
    const docRef = await db.collection('products').add({
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log('✓ Product added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

/**
 * Update existing product in Firestore
 * @param {string} productId - Product document ID
 * @param {Object} updateData - Data to update
 */
async function updateProductInFirestore(productId, updateData) {
  try {
    await db.collection('products').doc(productId).update({
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    console.log('✓ Product updated:', productId);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Delete product from Firestore
 * @param {string} productId - Product document ID
 */
async function deleteProductFromFirestore(productId) {
  try {
    await db.collection('products').doc(productId).delete();
    console.log('✓ Product deleted:', productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Get all products from Firestore
 * @returns {Promise<Array>} - Array of products with IDs
 */
async function getAllProducts() {
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Listen to real-time product updates
 * @param {Function} callback - Function to call when data changes
 * @returns {Function} - Unsubscribe function
 */
function listenToProducts(callback) {
  return db.collection('products')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const products = [];
        snapshot.forEach(doc => {
          products.push({ id: doc.id, ...doc.data() });
        });
        callback(products);
      },
      (error) => {
        console.error('Error listening to products:', error);
        callback([]);
      }
    );
}

// ===== UTILITY FUNCTIONS =====

/**
 * Format price with currency
 * @param {number} price - Price value
 * @returns {string} - Formatted price
 */
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

/**
 * Format date
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ===== WHATSAPP MESSAGE HELPER =====

/**
 * Generate WhatsApp message and open chat
 * @param {Object} product - Product object
 */
function openWhatsAppChat(product) {
  const message = encodeURIComponent(
    `Hi! I'm interested in the "${product.name}" from Talentia.\n\n` +
    `Price: $${product.price}\n` +
    `Description: ${product.description}\n\n` +
    `Can you provide more details and availability?`
  );
  
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
}
