// ===== PRODUCTS.JS - Products Page Logic =====

let productsUnsubscribe = null;

document.addEventListener('DOMContentLoaded', function() {
  initializeProductsPage();
});

/**
 * Initialize products page
 */
function initializeProductsPage() {
  if (!db) {
    console.error('Firebase not initialized');
    showMessage('Error loading Firebase. Please check configuration.', 'error');
    return;
  }

  // Listen to real-time product updates
  loadProductsRealtime();
}

/**
 * Load products with real-time listener
 */
function loadProductsRealtime() {
  const loadingEl = document.getElementById('loadingProducts');
  const containerEl = document.getElementById('productsContainer');
  const emptyEl = document.getElementById('emptyState');

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

        // Hide loading
        if (loadingEl) loadingEl.style.display = 'none';

        if (products.length === 0) {
          // Show empty state
          if (emptyEl) emptyEl.style.display = 'block';
          if (containerEl) containerEl.style.display = 'none';
        } else {
          // Show products
          if (emptyEl) emptyEl.style.display = 'none';
          if (containerEl) {
            containerEl.style.display = 'grid';
            renderProducts(products);
          }
        }

        console.log(`✓ Loaded ${products.length} products`);
      },
      (error) => {
        console.error('Error loading products:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        showMessage('Error loading products. Please refresh.', 'error');
      }
    );
}

/**
 * Render products to the grid
 * @param {Array} products - Array of product objects
 */
function renderProducts(products) {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  // Clear container
  container.innerHTML = '';

  // Render each product
  products.forEach((product, index) => {
    const productCard = createProductCard(product, index);
    container.appendChild(productCard);
  });

  // Trigger animations
  initializeAnimations();
}

/**
 * Create product card element
 * @param {Object} product - Product object
 * @param {number} index - Array index for animation delay
 * @returns {HTMLElement} - Product card element
 */
function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-animate', (index % 8) + 1);

  const imageUrl = product.imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';

  card.innerHTML = `
    <div class="product-image">
      <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23333%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2220%22%3EImage Not Found%3C/text%3E%3C/svg%3E'">
    </div>
    <div class="product-info">
      <h3 class="product-name">${escapeHtml(product.name)}</h3>
      <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
      <p class="product-description">${escapeHtml(product.description)}</p>
      <div class="product-actions">
        <button class="btn btn-primary" onclick="openWhatsAppChat({name: '${escapeHtml(product.name)}', price: ${product.price}, description: '${escapeHtml(product.description.substring(0, 50))}...'})">
          WhatsApp
        </button>
        <button class="btn btn-secondary" onclick="shareProduct('${escapeHtml(product.name)}', '${escapeHtml(imageUrl)}', ${product.price})">
          Share
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Open WhatsApp chat with product details
 * @param {Object} product - Product object
 */
function openWhatsAppChat(product) {
  const message = encodeURIComponent(
    `Hello! I'm interested in this product from Talentia:\n\n` +
    `*${product.name}*\n` +
    `Price: $${product.price}\n` +
    `${product.description}\n\n` +
    `Can you provide more details and discuss availability?`
  );
  
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Share product
 * @param {string} name - Product name
 * @param {string} imageUrl - Product image URL
 * @param {number} price - Product price
 */
function shareProduct(name, imageUrl, price) {
  const text = `Check out this amazing product from Talentia: ${name} for $${price}`;
  
  if (navigator.share) {
    navigator.share({
      title: name,
      text: text,
      url: window.location.href
    }).catch(err => console.log('Share cancelled:', err));
  } else {
    // Fallback: copy share text to clipboard
    const shareText = `${text}\n${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      showMessage('Product link copied to clipboard!', 'success');
    });
  }
}

/**
 * Search products
 * @param {string} query - Search query
 */
function searchProducts(query) {
  const cards = document.querySelectorAll('.product-card');
  const queryLower = query.toLowerCase();

  cards.forEach(card => {
    const name = card.querySelector('.product-name').textContent.toLowerCase();
    const description = card.querySelector('.product-description').textContent.toLowerCase();
    
    if (name.includes(queryLower) || description.includes(queryLower)) {
      card.style.display = '';
      card.style.animation = 'fadeInUp 0.5s ease-out';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Filter products by price range
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 */
function filterByPrice(min, max) {
  const cards = document.querySelectorAll('.product-card');
  
  cards.forEach(card => {
    const priceText = card.querySelector('.product-price').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    
    if (price >= min && price <= max) {
      card.style.display = '';
      card.style.animation = 'fadeInUp 0.5s ease-out';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Sort products
 * @param {string} sortBy - 'name', 'price-low', 'price-high', 'newest'
 */
function sortProducts(sortBy) {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  const cards = Array.from(container.querySelectorAll('.product-card'));

  cards.sort((a, b) => {
    const getPrice = (card) => parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
    const getName = (card) => card.querySelector('.product-name').textContent;

    switch (sortBy) {
      case 'name':
        return getName(a).localeCompare(getName(b));
      case 'price-low':
        return getPrice(a) - getPrice(b);
      case 'price-high':
        return getPrice(b) - getPrice(a);
      case 'newest':
      default:
        return 0;
    }
  });

  // Re-render sorted products
  container.innerHTML = '';
  cards.forEach(card => {
    container.appendChild(card);
  });
}

// Cleanup listener on page unload
window.addEventListener('beforeunload', function() {
  if (productsUnsubscribe) {
    productsUnsubscribe();
  }
});

console.log('✓ Products.js loaded successfully');
