# Talentia - Developer API Reference

## 📚 JavaScript Functions Reference

Complete documentation of all available functions in the Talentia project.

---

## 🔥 Firebase Functions (`js/firebase.js`)

### Image Management

#### `uploadImage(file, folder = 'products')`

Upload an image to Firebase Storage.

**Parameters:**
- `file` (File) - Image file to upload
- `folder` (string) - Storage folder path (default: 'products')

**Returns:** Promise<string> - Download URL of uploaded image

**Throws:** Error if file validation fails

**Example:**
```javascript
const imageFile = document.getElementById('imageInput').files[0];
try {
  const imageUrl = await uploadImage(imageFile, 'products');
  console.log('Uploaded:', imageUrl);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

**File Validation:**
- Max size: 5MB
- Supported types: JPG, PNG, WebP

---

#### `deleteImage(imageUrl)`

Delete an image from Firebase Storage.

**Parameters:**
- `imageUrl` (string) - Download URL of the image to delete

**Returns:** Promise<void>

**Example:**
```javascript
await deleteImage('https://firebasestorage.googleapis.com/...');
```

**Note:** Non-critical operation - errors are caught silently

---

### Firestore CRUD Operations

#### `addProductToFirestore(productData)`

Add a new product to Firestore.

**Parameters:**
- `productData` (Object) - Product data
  - `name` (string) - Product name
  - `price` (number) - Product price
  - `description` (string) - Product description
  - `imageUrl` (string) - Firebase Storage URL

**Returns:** Promise<string> - Document ID

**Example:**
```javascript
const docId = await addProductToFirestore({
  name: 'Premium Bracelet',
  price: 149.99,
  description: 'Luxury handcrafted bracelet',
  imageUrl: 'https://...'
});
console.log('Product added with ID:', docId);
```

---

#### `updateProductInFirestore(productId, updateData)`

Update an existing product in Firestore.

**Parameters:**
- `productId` (string) - Product document ID
- `updateData` (Object) - Fields to update
  - Any product fields (name, price, description, imageUrl)

**Returns:** Promise<void>

**Example:**
```javascript
await updateProductInFirestore('doc-id', {
  name: 'Updated Name',
  price: 199.99,
  description: 'Updated description'
});
```

---

#### `deleteProductFromFirestore(productId)`

Delete a product from Firestore.

**Parameters:**
- `productId` (string) - Product document ID

**Returns:** Promise<void>

**Example:**
```javascript
await deleteProductFromFirestore('doc-id');
```

---

#### `getAllProducts()`

Get all products from Firestore.

**Parameters:** None

**Returns:** Promise<Array> - Array of products with IDs

**Example:**
```javascript
const products = await getAllProducts();
products.forEach(product => {
  console.log(product.name, product.price);
});
```

---

#### `listenToProducts(callback)`

Set up real-time listener for product updates.

**Parameters:**
- `callback` (Function) - Called when products update
  - Receives: Array of products

**Returns:** Function - Unsubscribe function

**Example:**
```javascript
const unsubscribe = listenToProducts((products) => {
  console.log('Products updated:', products.length);
  // Update UI
});

// Later, to stop listening:
unsubscribe();
```

---

### Utility Functions

#### `formatPrice(price)`

Format price as currency.

**Parameters:**
- `price` (number) - Price value

**Returns:** string - Formatted price (e.g., "$99.99")

**Example:**
```javascript
console.log(formatPrice(149.99)); // "$149.99"
```

---

#### `formatDate(dateString)`

Format ISO date string to readable format.

**Parameters:**
- `dateString` (string) - ISO date string

**Returns:** string - Formatted date (e.g., "Jan 15, 2025")

**Example:**
```javascript
console.log(formatDate('2025-01-15T10:30:00Z'));
// "Jan 15, 2025"
```

---

#### `openWhatsAppChat(product)`

Open WhatsApp chat with product details.

**Parameters:**
- `product` (Object) - Product object
  - `name` (string) - Product name
  - `price` (number) - Product price
  - `description` (string) - Product description

**Returns:** void

**Example:**
```javascript
openWhatsAppChat({
  name: 'Premium Bracelet',
  price: 149.99,
  description: 'Luxury bracelet...'
});
```

---

## 🎯 Main Functions (`js/main.js`)

### UI & Messages

#### `showMessage(message, type = 'info', duration = 3000)`

Display a notification message.

**Parameters:**
- `message` (string) - Message text
- `type` (string) - 'success', 'error', or 'info' (default: 'info')
- `duration` (number) - Display duration in ms (0 = permanent)

**Returns:** void

**Example:**
```javascript
showMessage('Product added successfully!', 'success', 3000);
showMessage('Error loading products', 'error');
showMessage('Loading...', 'info', 0); // Permanent until cleared
```

---

#### `clearMessages()`

Clear all notification messages.

**Parameters:** None

**Returns:** void

**Example:**
```javascript
clearMessages();
```

---

### Button & Form Helpers

#### `setButtonLoading(button, isLoading = true)`

Add loading state to button.

**Parameters:**
- `button` (HTMLElement) - Button element
- `isLoading` (boolean) - True to show loading, false to reset

**Returns:** void

**Example:**
```javascript
const btn = document.querySelector('button');
setButtonLoading(btn, true);
// ... do work ...
resetButton(btn, 'Submit');
```

---

#### `resetButton(button, text = 'Submit')`

Reset button to normal state.

**Parameters:**
- `button` (HTMLElement) - Button element
- `text` (string) - Button text (default: 'Submit')

**Returns:** void

---

### Utilities

#### `debounce(func, wait)`

Debounce function (useful for search, resize, etc).

**Parameters:**
- `func` (Function) - Function to debounce
- `wait` (number) - Wait time in milliseconds

**Returns:** Function - Debounced function

**Example:**
```javascript
const debouncedSearch = debounce((query) => {
  searchProducts(query);
}, 300);

input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

---

#### `throttle(func, limit)`

Throttle function (useful for scroll events).

**Parameters:**
- `func` (Function) - Function to throttle
- `limit` (number) - Time limit in milliseconds

**Returns:** Function - Throttled function

**Example:**
```javascript
const throttledScroll = throttle(() => {
  console.log('Scrolled');
}, 1000);

window.addEventListener('scroll', throttledScroll);
```

---

#### `copyToClipboard(text)`

Copy text to clipboard.

**Parameters:**
- `text` (string) - Text to copy

**Returns:** Promise<void>

**Example:**
```javascript
await copyToClipboard('Product link');
showMessage('Copied!', 'success');
```

---

#### `validateEmail(email)`

Validate email format.

**Parameters:**
- `email` (string) - Email to validate

**Returns:** boolean

**Example:**
```javascript
if (validateEmail(userEmail)) {
  console.log('Valid email');
}
```

---

#### `getUrlParameter(name)`

Get URL query parameter value.

**Parameters:**
- `name` (string) - Parameter name

**Returns:** string | null

**Example:**
```javascript
const productId = getUrlParameter('id');
// From: ?id=abc123
```

---

## 📦 Products Page Functions (`js/products.js`)

### Product Display

#### `loadProductsRealtime()`

Load products with real-time listener.

**Parameters:** None

**Returns:** void

**Behavior:**
- Sets up Firebase listener
- Shows loading state
- Hides loading when data arrives
- Shows empty state if no products
- Re-renders on any changes

---

#### `renderProducts(products)`

Render products to grid.

**Parameters:**
- `products` (Array) - Array of product objects

**Returns:** void

**Example:**
```javascript
const products = await getAllProducts();
renderProducts(products);
```

---

#### `openWhatsAppChat(product)`

Open WhatsApp with product details.

**Parameters:**
- `product` (Object) - Product data

**Returns:** void

---

#### `shareProduct(name, imageUrl, price)`

Share product via native share or clipboard.

**Parameters:**
- `name` (string) - Product name
- `imageUrl` (string) - Product image URL
- `price` (number) - Product price

**Returns:** void

---

### Search & Filter

#### `searchProducts(query)`

Search products by name or description.

**Parameters:**
- `query` (string) - Search query

**Returns:** void

**Example:**
```javascript
searchProducts('bracelet');
// Hides products not matching query
```

---

#### `filterByPrice(min, max)`

Filter products by price range.

**Parameters:**
- `min` (number) - Minimum price
- `max` (number) - Maximum price

**Returns:** void

**Example:**
```javascript
filterByPrice(50, 200);
// Shows only products between $50-$200
```

---

#### `sortProducts(sortBy)`

Sort products by criteria.

**Parameters:**
- `sortBy` (string) - 'name', 'price-low', 'price-high', 'newest'

**Returns:** void

**Example:**
```javascript
sortProducts('price-high'); // Most expensive first
```

---

## 🛠️ Admin Functions (`js/admin.js`)

### Authentication

#### `checkAdminPassword(event)`

Check admin password (form submission).

**Parameters:**
- `event` (Event) - Form submit event

**Returns:** void

**Behavior:**
- Validates password against stored value
- Shows error if incorrect
- Shows admin panel if correct

---

#### `logoutAdmin()`

Logout admin and redirect to login.

**Parameters:** None

**Returns:** void

**Behavior:**
- Clears session
- Unsubscribes from listeners
- Reloads page

---

### Product Management

#### `handleAddProduct(event)`

Handle add product form submission.

**Parameters:**
- `event` (Event) - Form submit event

**Returns:** Promise<void>

**Process:**
1. Validates form
2. Uploads image to Storage
3. Saves product to Firestore
4. Shows success message
5. Resets form

---

#### `handleEditProduct(event)`

Handle edit product form submission.

**Parameters:**
- `event` (Event) - Form submit event

**Returns:** Promise<void>

**Process:**
1. Validates form
2. Uploads new image if provided
3. Deletes old image if replaced
4. Updates Firestore document
5. Shows success message
6. Closes modal

---

#### `deleteProduct(productId, productName, imageUrl)`

Delete product with confirmation.

**Parameters:**
- `productId` (string) - Product document ID
- `productName` (string) - Product name (for confirmation)
- `imageUrl` (string) - Product image URL

**Returns:** Promise<void>

**Process:**
1. Shows confirmation dialog
2. Deletes image from Storage
3. Deletes document from Firestore
4. Shows success message

---

### Modal Management

#### `openEditModal(productId, name, price, description, imageUrl)`

Open edit product modal.

**Parameters:**
- `productId` (string) - Product ID
- `name` (string) - Product name
- `price` (number) - Product price
- `description` (string) - Product description
- `imageUrl` (string) - Product image URL

**Returns:** void

---

#### `closeEditModal()`

Close edit product modal.

**Parameters:** None

**Returns:** void

---

### Utilities

#### `previewImage(file, formType)`

Preview image before upload.

**Parameters:**
- `file` (File) - Image file
- `formType` (string) - 'addProduct' or 'editProduct'

**Returns:** void

---

#### `exportProductsAsJSON()`

Export all products as JSON file.

**Parameters:** None

**Returns:** Promise<void>

**Downloads:** `talentia-products-YYYY-MM-DD.json`

---

#### `getAdminStats()`

Get admin statistics.

**Parameters:** None

**Returns:** Promise<Object>

**Returns:**
```javascript
{
  totalProducts: 15,
  totalInventoryValue: "2999.99",
  averagePrice: "199.99"
}
```

---

## 🎨 CSS Classes

### Layout
- `.container` - Max width container
- `.admin-container` - Admin page container
- `.admin-content` - Two-column admin layout

### Buttons
- `.btn` - Base button style
- `.btn-primary` - Gold button
- `.btn-secondary` - Border button
- `.btn-danger` - Red delete button
- `.admin-btn` - Top navigation button

### Forms
- `.form-group` - Form field container
- `input`, `textarea`, `select` - Form elements

### Messages
- `.message` - Base message
- `.message.success` - Green success message
- `.message.error` - Red error message
- `.message.info` - Blue info message

### Products
- `.product-card` - Product card container
- `.product-image` - Product image wrapper
- `.product-info` - Product details
- `.product-name` - Product title
- `.product-price` - Product price
- `.product-description` - Product description
- `.product-actions` - Action buttons

### Grid
- `.products-grid` - Product grid container
- `.products-list` - Admin products list

---

## 🔄 Event Flow

### Adding Product
1. User fills form → Submit
2. `handleAddProduct()` called
3. `uploadImage()` uploads to Storage
4. `addProductToFirestore()` saves to DB
5. Real-time listener triggers
6. `renderProducts()` updates display

### Editing Product
1. User clicks Edit
2. `openEditModal()` opens modal
3. Form pre-fills with data
4. User submits → `handleEditProduct()`
5. `updateProductInFirestore()` updates DB
6. Real-time listener triggers
7. Display updates automatically

### Deleting Product
1. User clicks Delete
2. `deleteProduct()` with confirmation
3. `deleteImage()` removes from Storage
4. `deleteProductFromFirestore()` deletes from DB
5. Real-time listener triggers
6. Display updates automatically

---

## 🐛 Error Handling

### Try-Catch Pattern

All async functions use try-catch:

```javascript
try {
  // Do operation
  const result = await someAsyncFunction();
  showMessage('Success!', 'success');
} catch (error) {
  console.error('Error:', error);
  showMessage(`Error: ${error.message}`, 'error');
}
```

### Validation

All inputs are validated before processing:

```javascript
if (!name || !price || !description) {
  throw new Error('Please fill in all fields');
}

if (price < 0) {
  throw new Error('Price cannot be negative');
}
```

---

## 📊 Data Types

### Product Object

```typescript
interface Product {
  id: string;              // Document ID
  name: string;            // Product name
  price: number;           // Price in USD
  description: string;     // Product description
  imageUrl: string;        // Firebase Storage URL
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}
```

### Admin Stats Object

```typescript
interface AdminStats {
  totalProducts: number;
  totalInventoryValue: string;  // Formatted as "$X,XXX.XX"
  averagePrice: string;          // Formatted as "$XXX.XX"
}
```

---

## 🔐 Security Notes

- All Firebase credentials are public (safe to expose)
- Admin password is in client-side code (change before production)
- Implement proper Firebase Auth for production
- Enable security rules before going live

---

## 📈 Performance Tips

- Use `debounce()` for search input
- Use `throttle()` for scroll events
- Keep image size < 5MB for faster uploads
- Add pagination for large product lists
- Use `listenToProducts()` for real-time instead of polling

---

## 🆘 Common Patterns

### Real-time Product List

```javascript
let unsubscribe;

function setupProductListener() {
  unsubscribe = listenToProducts((products) => {
    renderProducts(products);
  });
}

function cleanup() {
  if (unsubscribe) unsubscribe();
}
```

### Form Submission with Loading

```javascript
async function handleSubmit(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button');
  
  setButtonLoading(btn);
  try {
    // Do work
    showMessage('Success!', 'success');
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
  } finally {
    resetButton(btn);
  }
}
```

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Complete Reference
