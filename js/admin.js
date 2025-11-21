// ===== ADMIN.JS - Admin Panel Logic =====

const ADMIN_PASSWORD = 'admin123'; // Change this in production!
let isAdminLoggedIn = false;
let editingProductId = null;
let productsUnsubscribe = null;

document.addEventListener('DOMContentLoaded', function() {
  initializeAdmin();
});

/**
 * Initialize admin panel
 */
function initializeAdmin() {
  // Check Firebase status and display if needed
  checkFirebaseStatus();
  
  // Check if user is logged in
  const sessionStorage = sessionStorage.getItem('adminLoggedIn');
  if (sessionStorage === 'true') {
    isAdminLoggedIn = true;
    showAdminPanel();
  }

  // Setup event listeners
  setupAdminEventListeners();
}

/**
 * Check if Firebase is properly initialized
 */
function checkFirebaseStatus() {
  const statusDiv = document.getElementById('firebaseStatus');
  const statusMessage = document.getElementById('statusMessage');
  
  if (!statusDiv || !statusMessage) return;
  
  if (!db) {
    statusDiv.style.display = 'block';
    statusMessage.innerHTML = '⚠️ <strong>Firebase not configured</strong><br>Please follow the <a href="FIREBASE_SETUP_GUIDE.md" style="color: var(--gold); text-decoration: underline;">Firebase Setup Guide</a> to configure your credentials in <code style="background: #000; padding: 2px 4px;">js/firebase.js</code>';
    console.warn('Firebase database not initialized');
  } else if (!firebaseReady) {
    statusDiv.style.display = 'block';
    statusMessage.innerHTML = '⚠️ <strong>Firebase initializing</strong><br>Please wait a moment...';
    console.log('Firebase initializing...');
  } else {
    statusDiv.style.display = 'none';
    console.log('✓ Firebase ready');
  }
}

/**
 * Check admin password
 */
function checkAdminPassword(event) {
  event.preventDefault();
  
  const password = document.getElementById('adminPassword').value;
  
  if (password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true;
    sessionStorage.setItem('adminLoggedIn', 'true');
    document.getElementById('adminPassword').value = '';
    showAdminPanel();
  } else {
    showMessage('Incorrect password. Please try again.', 'error');
    document.getElementById('adminPassword').value = '';
  }
}

/**
 * Show admin panel
 */
function showAdminPanel() {
  const loginScreen = document.getElementById('loginScreen');
  const adminPanel = document.getElementById('adminPanel');
  
  if (loginScreen) loginScreen.style.display = 'none';
  if (adminPanel) adminPanel.style.display = 'block';
  
  // Load products
  loadProductsList();
}

/**
 * Logout admin
 */
function logoutAdmin() {
  if (confirm('Are you sure you want to logout?')) {
    isAdminLoggedIn = false;
    sessionStorage.removeItem('adminLoggedIn');
    
    // Cleanup listener
    if (productsUnsubscribe) {
      productsUnsubscribe();
    }
    
    location.reload();
  }
}

/**
 * Setup admin event listeners
 */
function setupAdminEventListeners() {
  // Image preview for add form
  const imageInput = document.getElementById('productImage');
  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      previewImage(e.target.files[0], 'addProduct');
    });
  }

  // Image preview for edit form
  const editImageInput = document.getElementById('editProductImage');
  if (editImageInput) {
    editImageInput.addEventListener('change', function(e) {
      previewImage(e.target.files[0], 'editProduct');
    });
  }
}

/**
 * Preview image before upload
 */
function previewImage(file, formType) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById(
      formType === 'addProduct' ? 'imagePreview' : 'editImagePreview'
    );
    const previewImg = document.getElementById(
      formType === 'addProduct' ? 'previewImg' : 'editPreviewImg'
    );
    
    if (preview && previewImg) {
      preview.style.display = 'block';
      previewImg.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
}

/**
 * Handle add product form submission
 */
async function handleAddProduct(event) {
  event.preventDefault();

  if (!isAdminLoggedIn) {
    showMessage('Please login first', 'error');
    return;
  }

  if (!db) {
    showMessage('Firebase not initialized. Please refresh the page.', 'error');
    console.error('Firebase db not initialized');
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  setButtonLoading(submitBtn);

  try {
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value.trim();
    const imageFile = document.getElementById('productImage').files[0];

    // Validation
    if (!name || name.length === 0) {
      throw new Error('Product name is required');
    }

    if (!price || isNaN(price)) {
      throw new Error('Valid price is required');
    }

    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (!description || description.length === 0) {
      throw new Error('Product description is required');
    }

    if (!imageFile) {
      throw new Error('Product image is required');
    }

    showMessage('Uploading image...', 'info');

    // Upload image
    const imageUrl = await uploadImage(imageFile, 'products');
    console.log('Image uploaded:', imageUrl);

    showMessage('Saving product to database...', 'info');

    // Add product to Firestore
    const docId = await addProductToFirestore({
      name,
      price,
      description,
      imageUrl
    });
    console.log('Product saved with ID:', docId);

    showMessage('Product added successfully!', 'success');

    // Reset form
    event.target.reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';

  } catch (error) {
    console.error('Error adding product:', error);
    showMessage(`Error: ${error.message}`, 'error');
  } finally {
    resetButton(submitBtn, 'Add Product');
  }
}

/**
 * Load and display products list
 */
function loadProductsList() {
  if (!db) {
    showMessage('Firebase not initialized', 'error');
    return;
  }

  const container = document.getElementById('productsListContainer');
  if (!container) return;

  // Set up real-time listener
  productsUnsubscribe = db.collection('products')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const products = [];
        snapshot.forEach(doc => {
          products.push({
            id: doc.id,
            ...doc.data()
          });
        });

        renderProductsList(products);
      },
      (error) => {
        console.error('Error loading products:', error);
        container.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
            <p>Error loading products</p>
          </div>
        `;
        showMessage('Error loading products', 'error');
      }
    );
}

/**
 * Render products in admin list
 */
function renderProductsList(products) {
  const container = document.getElementById('productsListContainer');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
        <p>No products yet. Add your first product using the form.</p>
      </div>
    `;
    return;
  }

  let html = '<div class="products-list">';

  products.forEach(product => {
    const createdDate = formatDate(product.createdAt);
    
    html += `
      <div class="product-item">
        <div class="product-item-info">
          <h4>${escapeHtml(product.name)}</h4>
          <p>Price: <strong style="color: var(--gold);">$${parseFloat(product.price).toFixed(2)}</strong></p>
          <p style="font-size: 0.85rem; margin-top: 0.3rem;">Added: ${createdDate}</p>
        </div>
        <div class="product-item-actions">
          <button class="btn btn-secondary" onclick="openEditModal('${product.id}', '${escapeHtml(product.name)}', ${product.price}, '${escapeHtml(product.description)}', '${escapeHtml(product.imageUrl)}')">
            Edit
          </button>
          <button class="btn btn-danger" onclick="deleteProduct('${product.id}', '${escapeHtml(product.name)}', '${escapeHtml(product.imageUrl)}')">
            Delete
          </button>
        </div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

/**
 * Open edit modal
 */
function openEditModal(productId, name, price, description, imageUrl) {
  editingProductId = productId;

  document.getElementById('editProductId').value = productId;
  document.getElementById('editProductName').value = name;
  document.getElementById('editProductPrice').value = price;
  document.getElementById('editProductDescription').value = description;

  // Show current image
  const editImagePreview = document.getElementById('editImagePreview');
  const editPreviewImg = document.getElementById('editPreviewImg');
  if (editImagePreview && editPreviewImg) {
    editImagePreview.style.display = 'block';
    editPreviewImg.src = imageUrl;
  }

  // Clear file input
  document.getElementById('editProductImage').value = '';

  // Show modal
  const modal = document.getElementById('editModal');
  if (modal) modal.classList.add('active');
}

/**
 * Close edit modal
 */
function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) modal.classList.remove('active');
  editingProductId = null;
  document.getElementById('editImagePreview').style.display = 'none';
}

/**
 * Handle edit product form submission
 */
async function handleEditProduct(event) {
  event.preventDefault();

  if (!isAdminLoggedIn) {
    showMessage('Please login first', 'error');
    return;
  }

  if (!editingProductId) {
    showMessage('No product selected', 'error');
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  setButtonLoading(submitBtn);

  try {
    const name = document.getElementById('editProductName').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const description = document.getElementById('editProductDescription').value.trim();
    const imageFile = document.getElementById('editProductImage').files[0];

    // Validation
    if (!name || !price || !description) {
      throw new Error('Please fill in all fields');
    }

    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    const updateData = { name, price, description };

    // Handle image upload if new image selected
    if (imageFile) {
      showMessage('Uploading new image...', 'info');
      
      // Get current image URL to delete old one
      const currentProduct = await db.collection('products').doc(editingProductId).get();
      const oldImageUrl = currentProduct.data().imageUrl;

      // Upload new image
      const newImageUrl = await uploadImage(imageFile, 'products');
      updateData.imageUrl = newImageUrl;

      // Delete old image
      if (oldImageUrl) {
        await deleteImage(oldImageUrl);
      }
    }

    showMessage('Updating product...', 'info');

    // Update in Firestore
    await updateProductInFirestore(editingProductId, updateData);

    showMessage('Product updated successfully!', 'success');
    closeEditModal();

  } catch (error) {
    console.error('Error updating product:', error);
    showMessage(`Error: ${error.message}`, 'error');
  } finally {
    resetButton(submitBtn, 'Save Changes');
  }
}

/**
 * Delete product with confirmation
 */
async function deleteProduct(productId, productName, imageUrl) {
  if (!isAdminLoggedIn) {
    showMessage('Please login first', 'error');
    return;
  }

  const confirmed = confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`);
  if (!confirmed) return;

  try {
    showMessage('Deleting product...', 'info');

    // Delete image from storage
    if (imageUrl) {
      await deleteImage(imageUrl);
    }

    // Delete from Firestore
    await deleteProductFromFirestore(productId);

    showMessage('Product deleted successfully!', 'success');

  } catch (error) {
    console.error('Error deleting product:', error);
    showMessage(`Error: ${error.message}`, 'error');
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Export products as JSON
 */
function exportProductsAsJSON() {
  const products = document.querySelectorAll('.product-item');
  if (products.length === 0) {
    showMessage('No products to export', 'error');
    return;
  }

  db.collection('products').get().then(snapshot => {
    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `talentia-products-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showMessage('Products exported successfully!', 'success');
  });
}

/**
 * Bulk delete products
 */
async function bulkDeleteProducts() {
  const confirmed = confirm('This will delete ALL products. Are you absolutely sure?');
  if (!confirmed) return;

  const doubleConfirmed = confirm('This action cannot be undone. Type "DELETE ALL" in the next prompt to confirm.');
  if (!doubleConfirmed) return;

  const userInput = prompt('Type "DELETE ALL" to confirm:');
  if (userInput !== 'DELETE ALL') {
    showMessage('Bulk delete cancelled', 'info');
    return;
  }

  try {
    showMessage('Deleting all products...', 'info');

    const snapshot = await db.collection('products').get();
    const batch = db.batch();

    snapshot.forEach(doc => {
      // Delete image if exists
      const imageUrl = doc.data().imageUrl;
      if (imageUrl) {
        deleteImage(imageUrl);
      }
      batch.delete(doc.ref);
    });

    await batch.commit();
    showMessage('All products deleted successfully!', 'success');

  } catch (error) {
    console.error('Error in bulk delete:', error);
    showMessage(`Error: ${error.message}`, 'error');
  }
}

/**
 * Get admin statistics
 */
async function getAdminStats() {
  try {
    const snapshot = await db.collection('products').get();
    const products = [];
    let totalValue = 0;

    snapshot.forEach(doc => {
      const product = doc.data();
      products.push(product);
      totalValue += parseFloat(product.price) || 0;
    });

    const stats = {
      totalProducts: products.length,
      totalInventoryValue: totalValue.toFixed(2),
      averagePrice: products.length > 0 ? (totalValue / products.length).toFixed(2) : 0
    };

    console.log('Admin Stats:', stats);
    return stats;

  } catch (error) {
    console.error('Error getting stats:', error);
    return null;
  }
}

// Cleanup listener on page unload
window.addEventListener('beforeunload', function() {
  if (productsUnsubscribe) {
    productsUnsubscribe();
  }
});

console.log('✓ Admin.js loaded successfully');
