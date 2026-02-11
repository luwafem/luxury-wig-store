export const siteConfig = {
  // Brand Information
  brandName: "LuxuryLocks Nigeria",
  brandTagline: "Premium Human Hair Wigs & Extensions",
  
  // Business Information
  business: {
    name: "LuxuryLocks Nigeria Limited",
    address: "123 Victoria Island, Lagos, Nigeria",
    phone: "+234 812 345 6789",
    whatsapp: "+2348123456789",
    email: "info@luxurylocks.ng",
    workingHours: "Mon - Sat: 9AM - 6PM",
  },
  
  // Delivery Information
  delivery: {
    lagos: "1-2 business days",
    otherStates: "3-5 business days",
    international: "7-14 business days",
    freeShippingThreshold: 50000, // Naira
  },
  
  // Social Media
  social: {
    instagram: "https://instagram.com/luxurylocksng",
    facebook: "https://facebook.com/luxurylocksng",
    twitter: "https://twitter.com/luxurylocksng",
    whatsapp: "https://wa.me/2348123456789",
  },
  
  // Payment Configuration
  payment: {
    paystackPublicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    currency: "NGN",
  },
  
  // Firebase Configuration
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  },
  
  // SEO Defaults
  seo: {
    title: "LuxuryLocks Nigeria | Premium Human Hair Wigs & Extensions",
    description: "Shop premium 100% human hair wigs, closures, frontals, and extensions. Free delivery in Lagos. Best prices in Nigeria.",
    keywords: "human hair wigs Nigeria, lace front wigs, hair extensions, closure, frontal, Nigerian wig store",
    ogImage: "/images/og-image.jpg",
    twitterHandle: "@luxurylocksng",
  }
};