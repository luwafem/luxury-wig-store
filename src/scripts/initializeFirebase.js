import { db } from '../services/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

const initializeDatabase = async () => {
  console.log('Initializing LuxuryLocks database...');

  // Create initial admin user document
  const adminUser = {
    uid: 'admin-uid-here', // Replace with actual admin UID
    email: 'admin@luxurylocks.ng',
    displayName: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: ['all']
  };

  try {
    // Check if admin user exists
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    if (snapshot.empty) {
      // Create admin user
      await setDoc(doc(db, 'users', adminUser.uid), adminUser);
      console.log('Admin user created');
    }

    // Create initial content
    const contentData = {
      homepage: {
        title: 'Premium Human Hair Wigs & Extensions',
        heroText: 'Experience luxury with our 100% virgin human hair',
        featured: true,
        updatedAt: new Date()
      },
      policies: {
        privacy: 'Privacy policy content...',
        terms: 'Terms and conditions...',
        refund: 'Refund policy...',
        delivery: 'Delivery information...',
        updatedAt: new Date()
      }
    };

    await setDoc(doc(db, 'content', 'siteContent'), contentData);
    console.log('Site content initialized');

    // Create sample promo codes
    const promoCode = {
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      maxUsage: 100,
      usedCount: 0,
      isActive: true,
      createdAt: new Date(),
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    };

    await setDoc(doc(db, 'promoCodes', 'WELCOME10'), promoCode);
    console.log('Sample promo code created');

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Export for manual execution
export { initializeDatabase };