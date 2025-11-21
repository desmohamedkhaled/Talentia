# Firestore Database Structure Guide

## 📊 Collection: `products`

This is the main collection that stores all product data.

### Document Structure

Each product is a document in the `products` collection with the following fields:

```
Collection: products
└── Document: {auto-generated ID}
    ├── name (string) - Product name
    ├── price (number) - Product price
    ├── description (string) - Product description
    ├── imageUrl (string) - Firebase Storage URL
    ├── createdAt (timestamp) - Creation date
    └── updatedAt (timestamp) - Last update date
```

### Example Document

**Document ID:** `abc123def456`

```json
{
  "name": "Premium Steel Bracelet",
  "price": 149.99,
  "description": "Exquisite handcrafted stainless steel bracelet with 24K gold plating. Features a secure closure and hypoallergenic design. Perfect for daily wear or special occasions.",
  "imageUrl": "https://firebasestorage.googleapis.com/v0/b/talentia-project.appspot.com/o/products%2F1705326600000_bracelet.jpg?alt=media&token=abc123",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

---

## 📝 Sample Product Data

Here are 5 sample products you can add via the admin panel:

### Product 1: Steel Ring
```json
{
  "name": "Luxury Steel Ring",
  "price": 79.99,
  "description": "Sophisticated stainless steel ring with elegant design. Resistant to scratches and corrosion. Available in multiple sizes."
}
```

### Product 2: Necklace
```json
{
  "name": "Premium Chain Necklace",
  "price": 199.99,
  "description": "Stunning 24K gold-plated stainless steel chain necklace. Hypoallergenic and lightweight. Perfect statement piece."
}
```

### Product 3: Earrings
```json
{
  "name": "Elegant Steel Earrings",
  "price": 59.99,
  "description": "Minimalist stainless steel earrings with gold accents. Comfortable for all-day wear. Comes with secure backing."
}
```

### Product 4: Bracelet
```json
{
  "name": "Premium Steel Bracelet",
  "price": 149.99,
  "description": "Handcrafted stainless steel bracelet with luxury finish. Features adjustable sizing. Gift-ready packaging included."
}
```

### Product 5: Watch
```json
{
  "name": "Steel Luxury Watch",
  "price": 299.99,
  "description": "Precision stainless steel watch with sapphire crystal. Water-resistant to 50m. Swiss-inspired movement."
}
```

---

## 🔄 CRUD Operations Reference

### CREATE (Add Product)

**Via Admin Panel:**
1. Go to `/admin.html`
2. Login with password
3. Fill form → Upload image → Click "Add Product"

**Via Firebase Console:**
1. Firestore → products collection
2. Add Document → Fill fields → Save

**Via Code:**
```javascript
await addProductToFirestore({
  name: "Product Name",
  price: 99.99,
  description: "Description here",
  imageUrl: "https://..." // Firebase Storage URL
});
```

### READ (Get Products)

**All Products:**
```javascript
const products = await getAllProducts();
console.log(products);
```

**Real-time Listener:**
```javascript
const unsubscribe = listenToProducts((products) => {
  console.log("Products updated:", products);
});
```

### UPDATE (Edit Product)

**Via Admin Panel:**
1. Go to `/admin.html`
2. Find product → Click "Edit"
3. Change fields → Click "Save Changes"

**Via Code:**
```javascript
await updateProductInFirestore('document-id', {
  name: "New Name",
  price: 149.99,
  description: "New description"
});
```

### DELETE (Remove Product)

**Via Admin Panel:**
1. Go to `/admin.html`
2. Find product → Click "Delete"
3. Confirm deletion

**Via Code:**
```javascript
await deleteProductFromFirestore('document-id');
```

---

## 🖼️ Cloud Storage Structure

Images are stored in Firebase Storage with this path structure:

```
Storage Bucket: talentia-project.appspot.com
└── products/
    ├── 1705326600000_bracelet.jpg
    ├── 1705326601000_ring.jpg
    ├── 1705326602000_necklace.jpg
    └── ...
```

**Naming Convention:** `{timestamp}_{filename}`

**Download URL Format:**
```
https://firebasestorage.googleapis.com/v0/b/{bucket}/o/products%2F{filename}?alt=media&token={token}
```

---

## 📋 Database Indexing

Firestore automatically creates indexes for commonly used queries.

**Existing Indexes:**
- `createdAt` (descending) - For sorting products by creation date

**Optional Indexes for Performance:**
If you plan to add filtering (price range, category), create indexes:

```
Collection: products
Fields to Index:
  - price (ascending)
  - category (ascending)
  - createdAt (descending)
```

---

## 🔒 Security Rules

**Development (Test Mode):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Production:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document=**} {
      allow read: if true;
      allow write, delete: if false; // Admin only via back-end
    }
  }
}
```

---

## 💾 Backup Strategy

### Manual Backup
1. Firebase Console → Firestore → ...menu → Export Collection
2. Choose export location (Cloud Storage)
3. Download JSON file

### Scheduled Backup (Advanced)
Use Cloud Functions to auto-backup:
```bash
firebase functions:deploy backupProducts
```

---

## 📊 Query Examples

### Get All Products (Sorted by Date)
```javascript
db.collection('products')
  .orderBy('createdAt', 'desc')
  .get()
```

### Get Products by Price Range
```javascript
db.collection('products')
  .where('price', '>=', 100)
  .where('price', '<=', 500)
  .get()
```

### Get Single Product
```javascript
db.collection('products')
  .doc('product-id')
  .get()
```

### Real-time Listener
```javascript
db.collection('products')
  .orderBy('createdAt', 'desc')
  .onSnapshot((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.data());
    });
  })
```

---

## 🚀 Performance Tips

1. **Pagination** - For large collections, add pagination
2. **Indexing** - Create composite indexes for complex queries
3. **Caching** - Use browser cache for images
4. **Compression** - Compress images before upload

---

## 📈 Scaling

**Small Store (< 1000 products):**
- Current structure works fine
- No optimization needed

**Medium Store (1000-10000 products):**
- Add category subcollection
- Implement pagination
- Consider denormalization

**Large Store (> 10000 products):**
- Use Cloud Firestore sharding
- Implement database replication
- Consider Cloud SQL

---

## 🆘 Common Issues

### Document Not Appearing
- Verify `createdAt` field is set
- Check Firestore security rules
- Refresh page or clear cache

### Image URL Not Working
- Verify Cloud Storage is enabled
- Check file permissions
- Ensure image size < 5MB

### Slow Queries
- Add Firestore indexes
- Limit returned fields
- Use pagination

---

## 📚 Reference

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Cloud Storage Documentation](https://firebase.google.com/docs/storage)
- [Data Model Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

**Last Updated:** January 2025  
**Version:** 1.0
