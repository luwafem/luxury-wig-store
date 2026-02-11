import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp,
  writeBatch,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged // Added this import
} from 'firebase/auth';
import { siteConfig } from '../config/siteConfig';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || siteConfig.firebase.apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || siteConfig.firebase.authDomain,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || siteConfig.firebase.projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || siteConfig.firebase.storageBucket,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || siteConfig.firebase.messagingSenderId,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || siteConfig.firebase.appId,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Collections
export const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  PROMO_CODES: 'promoCodes',
  USERS: 'users',
  CONTENT: 'content',
  ANALYTICS: 'analytics',
};

// Enhanced Product Services
// Enhanced Product Services
export const productService = {
  async getAllProducts(filters = {}) {
    try {
      let q = collection(db, COLLECTIONS.PRODUCTS);
      const constraints = [];
      
      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }
      
      if (filters.isFeatured) {
        constraints.push(where('isFeatured', '==', true));
      }
      
      if (filters.isBestSeller) {
        constraints.push(where('isBestSeller', '==', true));
      }
      
      if (filters.minPrice || filters.maxPrice) {
        if (filters.minPrice) constraints.push(where('price', '>=', filters.minPrice));
        if (filters.maxPrice) constraints.push(where('price', '<=', filters.maxPrice));
      }
      
      if (constraints.length > 0) {
        constraints.push(orderBy('createdAt', 'desc'));
        q = query(q, ...constraints);
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },
  
  // Get featured products (for home page)
  async getFeaturedProducts(limit = 8) {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('isFeatured', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      if (limit) {
        // Note: Firestore doesn't support limit with orderBy on different fields
        // We'll fetch all and limit in memory for now
        const snapshot = await getDocs(q);
        const products = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .slice(0, limit);
        return products;
      } else {
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (error) {
      console.error('Error getting featured products:', error);
      // Fallback: get all products and filter locally
      const allProducts = await this.getAllProducts();
      return allProducts
        .filter(product => product.isFeatured === true)
        .slice(0, limit || 8);
    }
  },
  
  // Get best selling products (for home page)
  async getBestSellers(limit = 8) {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('isBestSeller', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      if (limit) {
        const snapshot = await getDocs(q);
        const products = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .slice(0, limit);
        return products;
      } else {
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (error) {
      console.error('Error getting best sellers:', error);
      // Fallback: get all products and filter locally
      const allProducts = await this.getAllProducts();
      return allProducts
        .filter(product => product.isBestSeller === true)
        .slice(0, limit || 8);
    }
  },
  
  // Get products on sale
  async getProductsOnSale(limit = 8) {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('originalPrice', '>', 0),
        where('price', '<', where('originalPrice')),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Calculate discount percentage
      products = products.map(product => ({
        ...product,
        discountPercent: Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      }));
      
      return limit ? products.slice(0, limit) : products;
    } catch (error) {
      console.error('Error getting products on sale:', error);
      return [];
    }
  },
  
  // Get products by category
  async getProductsByCategory(category, limit = 12) {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      return limit ? products.slice(0, limit) : products;
    } catch (error) {
      console.error(`Error getting products for category ${category}:`, error);
      return [];
    }
  },
  
  async getProductById(id) {
    try {
      const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },
  
  async saveProduct(productData, id = null) {
    try {
      const now = Timestamp.now();
      const product = {
        ...productData,
        price: Number(productData.price),
        originalPrice: Number(productData.originalPrice) || 0,
        stockQuantity: Number(productData.stockQuantity),
        updatedAt: now,
      };
      
      if (id) {
        // Update existing
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
        await updateDoc(docRef, product);
        return id;
      } else {
        // Create new
        product.createdAt = now;
        product.salesCount = 0;
        product.views = 0;
        const docRef = doc(collection(db, COLLECTIONS.PRODUCTS));
        await setDoc(docRef, product);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },
  
  async deleteProduct(id) {
    try {
      // First, delete product images from storage
      const product = await this.getProductById(id);
      if (product.images) {
        for (const imageUrl of product.images) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.warn('Error deleting image:', error);
          }
        }
      }
      
      // Then delete product document
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
  
  async uploadProductImage(file, productId) {
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, `products/${productId}/${fileName}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
  
  async updateStock(productId, quantityChange) {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          throw new Error('Product not found');
        }
        
        const currentStock = productDoc.data().stockQuantity || 0;
        const newStock = currentStock + quantityChange;
        
        if (newStock < 0) {
          throw new Error('Insufficient stock');
        }
        
        transaction.update(productRef, { stockQuantity: newStock });
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  },
  
  // Increment product views
  async incrementProductViews(productId) {
    try {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
      await updateDoc(productRef, {
        views: (await this.getProductById(productId)).views + 1 || 1
      });
    } catch (error) {
      console.error('Error incrementing product views:', error);
    }
  },
  
  // Search products
  async searchProducts(searchTerm, filters = {}) {
    try {
      const allProducts = await this.getAllProducts();
      
      // Filter by search term
      let filtered = allProducts.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Apply additional filters
      if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category);
      }
      
      if (filters.minPrice) {
        filtered = filtered.filter(product => product.price >= filters.minPrice);
      }
      
      if (filters.maxPrice) {
        filtered = filtered.filter(product => product.price <= filters.maxPrice);
      }
      
      return filtered;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
};

// Enhanced Order Services
export const orderService = {
  async createOrder(orderData, userId = null) {
    try {
      const now = Timestamp.now();
      const orderRef = doc(collection(db, COLLECTIONS.ORDERS));
      const orderId = orderRef.id;
      
      const order = {
        ...orderData,
        id: orderId,
        userId: userId,
        createdAt: now,
        updatedAt: now,
        status: 'pending',
        paymentStatus: 'pending',
        orderNumber: `LL${now.toDate().getFullYear()}${orderId.slice(-6).toUpperCase()}`,
      };
      
      // Update product stock
      const batch = writeBatch(db);
      
      for (const item of orderData.items) {
        const productRef = doc(db, COLLECTIONS.PRODUCTS, item.id);
        batch.update(productRef, {
          stockQuantity: item.stockAfterSale || 0,
          salesCount: (item.currentSales || 0) + item.quantity
        });
      }
      
      await batch.commit();
      await setDoc(orderRef, order);
      
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  async updateOrder(orderId, updates) {
    try {
      const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },
  
  async getOrder(orderId) {
    try {
      const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  },
  
  async getUserOrders(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.ORDERS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  },
  
  async getAllOrders(filters = {}) {
    try {
      let q = collection(db, COLLECTIONS.ORDERS);
      const constraints = [orderBy('createdAt', 'desc')];
      
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      
      if (filters.paymentStatus) {
        constraints.push(where('paymentStatus', '==', filters.paymentStatus));
      }
      
      if (filters.startDate && filters.endDate) {
        constraints.push(where('createdAt', '>=', filters.startDate));
        constraints.push(where('createdAt', '<=', filters.endDate));
      }
      
      q = query(q, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },
};

// Enhanced Promo Code Services
export const promoCodeService = {
  async validatePromoCode(code, orderAmount, userId = null) {
    try {
      const q = query(
        collection(db, COLLECTIONS.PROMO_CODES), 
        where('code', '==', code.toUpperCase()),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return { valid: false, error: 'Invalid promo code' };
      }
      
      const promoData = snapshot.docs[0].data();
      const promoId = snapshot.docs[0].id;
      const now = Date.now();
      const expiryDate = promoData.expiryDate?.toDate().getTime();
      
      // Check expiry
      if (expiryDate && now > expiryDate) {
        return { valid: false, error: 'Promo code has expired' };
      }
      
      // Check minimum order
      if (promoData.minOrderAmount && orderAmount < promoData.minOrderAmount) {
        return { 
          valid: false, 
          error: `Minimum order of ₦${promoData.minOrderAmount.toLocaleString()} required` 
        };
      }
      
      // Check usage limits
      if (promoData.maxUsage && promoData.usedCount >= promoData.maxUsage) {
        return { valid: false, error: 'Promo code usage limit reached' };
      }
      
      // Check per-user usage limit
      if (userId && promoData.perUserLimit) {
        const userUsage = await this.getUserPromoUsage(userId, promoId);
        if (userUsage >= promoData.perUserLimit) {
          return { valid: false, error: 'You have already used this promo code' };
        }
      }
      
      // Calculate discount
      let discountAmount = 0;
      if (promoData.discountType === 'percentage') {
        discountAmount = orderAmount * (promoData.discountValue / 100);
      } else if (promoData.discountType === 'fixed') {
        discountAmount = promoData.discountValue;
      }
      
      // Cap discount if maxDiscount is set
      if (promoData.maxDiscount && discountAmount > promoData.maxDiscount) {
        discountAmount = promoData.maxDiscount;
      }
      
      return {
        valid: true,
        data: {
          ...promoData,
          id: promoId,
          discountAmount
        },
      };
    } catch (error) {
      console.error('Error validating promo code:', error);
      return { valid: false, error: 'Error validating promo code' };
    }
  },
  
  async applyPromoCode(code, orderId, userId = null) {
    try {
      const q = query(collection(db, COLLECTIONS.PROMO_CODES), where('code', '==', code));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const promoDoc = snapshot.docs[0];
        const promoId = promoDoc.id;
        const currentCount = promoDoc.data().usedCount || 0;
        
        const batch = writeBatch(db);
        batch.update(promoDoc.ref, {
          usedCount: currentCount + 1,
          lastUsed: Timestamp.now(),
        });
        
        // Record usage
        if (userId) {
          const usageRef = doc(collection(db, 'promoUsage'));
          batch.set(usageRef, {
            promoId,
            userId,
            orderId,
            usedAt: Timestamp.now(),
          });
        }
        
        await batch.commit();
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      throw error;
    }
  },
  
  async getAllPromoCodes() {
    try {
      const q = query(collection(db, COLLECTIONS.PROMO_CODES), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting promo codes:', error);
      throw error;
    }
  },
  
  async savePromoCode(promoData, id = null) {
    try {
      const now = Timestamp.now();
      const data = {
        ...promoData,
        code: promoData.code.toUpperCase(),
        updatedAt: now,
      };
      
      if (id) {
        const docRef = doc(db, COLLECTIONS.PROMO_CODES, id);
        await updateDoc(docRef, data);
        return id;
      } else {
        data.createdAt = now;
        data.usedCount = 0;
        data.isActive = true;
        const docRef = doc(collection(db, COLLECTIONS.PROMO_CODES));
        await setDoc(docRef, data);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving promo code:', error);
      throw error;
    }
  },
  
  async getUserPromoUsage(userId, promoId) {
    try {
      const q = query(
        collection(db, 'promoUsage'),
        where('userId', '==', userId),
        where('promoId', '==', promoId)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting user promo usage:', error);
      return 0;
    }
  },
};

// Enhanced Auth Service
export const authService = {
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Login failed';
      
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          message = 'Account disabled';
          break;
        case 'auth/user-not-found':
          message = 'No account found';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Try again later';
          break;
      }
      
      return { success: false, error: message };
    }
  },
  
  async register(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        // Set admin: false by default, or use provided admin value
        admin: userData.admin || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...userData // Include any additional user data
      });
      
      // Update profile if display name provided
      if (userData.displayName) {
        await updateProfile(user, { displayName: userData.displayName });
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      let message = 'Registration failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Email already in use';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak';
          break;
      }
      
      return { success: false, error: message };
    }
  },
  
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },
  
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  },
  
  async updateProfile(updates) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return { success: false, error: 'No user logged in' };
      }
      
      // Update Firebase Auth profile
      if (updates.displayName) {
        await updateProfile(currentUser, { displayName: updates.displayName });
      }
      
      // Update user document in Firestore
      const userRef = doc(db, COLLECTIONS.USERS, currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  },
  
  async updateUserDocument(userId, updates) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Update user document error:', error);
      return { success: false, error: error.message };
    }
  },
  
  getCurrentUser() {
    return auth.currentUser;
  },
  
  async getUserData(userId) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  },
  
  // Listen for auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },
  
  // Check if user is admin
  async checkAdminStatus(currentUser) {
    try {
      if (!currentUser) return false;
      
      // Quick email check
      const emailIsAdmin = currentUser.email?.endsWith('@luxurylocks.ng');
      
      // Check user document for admin field
      const userData = await this.getUserData(currentUser.uid);
      const documentIsAdmin = userData?.admin === true;
      
      // Check specific UID (for your admin user)
      const uidIsAdmin = currentUser.uid === "CkFxFtpgnKYmbNCimNjpSwJiz6c2";
      
      return emailIsAdmin || documentIsAdmin || uidIsAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  
  // Create or update admin user document (for setup)
  async setAdminStatus(userId, isAdmin) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          admin: isAdmin,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create document if it doesn't exist
        await setDoc(userRef, {
          uid: userId,
          admin: isAdmin,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error setting admin status:', error);
      return { success: false, error: error.message };
    }
  }
};

// Analytics Service
export const analyticsService = {
  async recordView(productId) {
    try {
      const viewRef = doc(collection(db, 'productViews'));
      await setDoc(viewRef, {
        productId,
        viewedAt: Timestamp.now(),
        userAgent: navigator.userAgent,
      });
      
      // Update product view count
      const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
      await updateDoc(productRef, {
        views: (await this.getProductViews(productId)) + 1,
      });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  },
  
  async getProductViews(productId) {
    try {
      const q = query(
        collection(db, 'productViews'),
        where('productId', '==', productId)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting product views:', error);
      return 0;
    }
  },
  
  async recordOrderEvent(orderId, eventType, data = {}) {
    try {
      const eventRef = doc(collection(db, 'orderEvents'));
      await setDoc(eventRef, {
        orderId,
        eventType,
        data,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error recording order event:', error);
    }
  },
};

// Content Management Service
export const contentService = {
  async getSiteContent() {
    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, 'siteContent');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : {};
    } catch (error) {
      console.error('Error getting site content:', error);
      return {};
    }
  },
  
  async updateSiteContent(updates) {
    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, 'siteContent');
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating site content:', error);
      return { success: false, error: error.message };
    }
  },
  
  async getPageContent(pageId) {
    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, pageId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting page content:', error);
      return null;
    }
  },
  
  async updatePageContent(pageId, content) {
    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, pageId);
      await setDoc(docRef, {
        ...content,
        updatedAt: Timestamp.now(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating page content:', error);
      return { success: false, error: error.message };
    }
  },
};

// Admin Service (for admin-specific operations)
export const adminService = {
  async getAllUsers() {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },
  
  async updateUserAdminStatus(userId, isAdmin) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        admin: isAdmin,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating admin status:', error);
      return { success: false, error: error.message };
    }
  },
  
  async getDashboardStats() {
    try {
      // Get total products
      const productsSnapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
      const totalProducts = productsSnapshot.size;
      
      // Get total orders
      const ordersSnapshot = await getDocs(collection(db, COLLECTIONS.ORDERS));
      const totalOrders = ordersSnapshot.size;
      
      // Get total revenue (sum of all order totals)
      let totalRevenue = 0;
      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        totalRevenue += order.total || 0;
      });
      
      // Get total users
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const totalUsers = usersSnapshot.size;
      
      return {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalUsers
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }
};

// Export initialization function
export const initializeFirebase = async () => {
  console.log('Firebase initialized successfully');
  return { db, storage, auth };
};