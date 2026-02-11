import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check admin status from user document
  const checkAdminStatus = async (currentUser) => {
    try {
      // Check email pattern first (quick check)
      const emailIsAdmin = currentUser.email?.endsWith('@luxurylocks.ng') || 
                          currentUser.email === process.env.REACT_APP_ADMIN_EMAIL;
      
      // Fetch user document to check admin field
      let userData = null;
      try {
        userData = await authService.getUserData(currentUser.uid);
      } catch (err) {
        console.warn('Could not fetch user data:', err);
        // Continue without user data
      }
      
      // Check admin status from user document OR email pattern OR specific UID
      const isUserAdmin = emailIsAdmin || 
                         (userData?.admin === true) || 
                         currentUser.uid === "CkFxFtpgnKYmbNCimNjpSwJiz6c2";
      
      return {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        isAdmin: isUserAdmin,
        userData: userData // Optional: store full user data if needed
      };
    } catch (err) {
      console.error('Error checking admin status:', err);
      // Fallback to basic user info without admin privileges
      return {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        isAdmin: false
      };
    }
  };

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          const userWithAdmin = await checkAdminStatus(currentUser);
          setUser(userWithAdmin);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err.message);
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await authService.login(email, password);
      const currentUser = userCredential.user;
      
      const userWithAdmin = await checkAdminStatus(currentUser);
      setUser(userWithAdmin);
      
      return { success: true, user: userWithAdmin };
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.register(email, password, userData);
      if (result.success) {
        const currentUser = result.user;
        
        // Check admin status after registration
        const userWithAdmin = await checkAdminStatus(currentUser);
        setUser(userWithAdmin);
        
        return { success: true, user: userWithAdmin };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.updateProfile(updates);
      
      // Refresh user data
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const userWithAdmin = await checkAdminStatus(currentUser);
        setUser(userWithAdmin);
      }
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh user data (e.g., after admin status changes)
  const refreshUserData = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const userWithAdmin = await checkAdminStatus(currentUser);
        setUser(userWithAdmin);
        return { success: true, user: userWithAdmin };
      }
      return { success: false, error: 'No user logged in' };
    } catch (err) {
      console.error('Error refreshing user data:', err);
      return { success: false, error: err.message };
    }
  };

  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  };

  const isAdmin = () => {
    return user?.isAdmin || false;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    refreshUserData,
    isAuthenticated: !!user,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};