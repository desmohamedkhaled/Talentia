// ===== MAIN.JS - Global Scripts =====

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeAnimations();
  setupSmoothScroll();
});

/**
 * Initialize fade-in animations for elements
 */
function initializeAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  elements.forEach(element => {
    // Element already has animation from CSS
  });

  // Animate on scroll
  observeElements();
}

/**
 * Intersection Observer for scroll animations
 */
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in class
  document.querySelectorAll('.product-card, .feature-item, .footer-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });
}

/**
 * Smooth scroll behavior
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Show message notification
 * @param {string} message - Message text
 * @param {string} type - 'success', 'error', or 'info'
 * @param {number} duration - Duration in milliseconds (0 = permanent)
 */
function showMessage(message, type = 'info', duration = 3000) {
  const messageContainer = document.getElementById('messageContainer') || createMessageContainer();
  
  const messageEl = document.createElement('div');
  messageEl.className = `message ${type}`;
  messageEl.textContent = message;
  messageEl.style.animation = 'slideDown 0.3s ease-out';
  
  messageContainer.appendChild(messageEl);
  
  if (duration > 0) {
    setTimeout(() => {
      messageEl.style.animation = 'slideDown 0.3s ease-out reverse';
      setTimeout(() => messageEl.remove(), 300);
    }, duration);
  }
}

/**
 * Create message container if it doesn't exist
 */
function createMessageContainer() {
  let container = document.getElementById('messageContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'messageContainer';
    container.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 1500;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Clear all messages
 */
function clearMessages() {
  const container = document.getElementById('messageContainer');
  if (container) {
    container.innerHTML = '';
  }
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format date nicely
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Validate email
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Get URL parameter
 */
function getUrlParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Add loading state to button
 */
function setButtonLoading(button, isLoading = true) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<span class="loading" style="display: inline-block; width: 16px; height: 16px; margin-right: 8px; vertical-align: middle;"></span>Loading...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
  }
}

/**
 * Reset button to normal state
 */
function resetButton(button, text = 'Submit') {
  button.disabled = false;
  button.textContent = text;
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showMessage('Copied to clipboard!', 'success', 2000);
  }).catch(() => {
    showMessage('Failed to copy', 'error');
  });
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Add product to WhatsApp
 */
function addToWhatsApp(productName, price) {
  const message = encodeURIComponent(
    `Hi! I'm interested in the "${productName}" from Talentia.\n\n` +
    `Price: $${price}\n\n` +
    `Can you provide more details and availability?`
  );
  
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

// ===== EVENT LISTENERS =====

// Handle escape key to close modals
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => modal.classList.remove('active'));
  }
});

// Close modal when clicking outside content
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
  }
});

console.log('✓ Main.js loaded successfully');
