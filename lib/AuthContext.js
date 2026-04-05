// lib/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getUserData, removeUserData, saveUserData } from './storageUtils';
import { useToast } from 'react-native-toast-notifications';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // User is signed in
        try {
          // First check local storage for user data
          const localUserData = await getUserData('userData');
          if (localUserData) {
            setUserData(localUserData);
            setPostalCode(localUserData.postalCode || '');
            setIsLoggedIn(true);
          } else {
            // Fallback to Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userDataFromFirestore = userDoc.data();
              setUserData(userDataFromFirestore);
              setPostalCode(userDataFromFirestore.postalCode || '');
              setIsLoggedIn(true);
              await saveUserData('userData', userDataFromFirestore);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // User is signed out
        setIsLoggedIn(false);
        setUserData(null);
        setPostalCode('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      await removeUserData('userData');
      setUserData(null);
      setPostalCode('');
      setIsLoggedIn(false);
      toast.show('You have successfully logged out!', { type: 'success' });
    } catch (error) {
      console.error('Error during logout:', error);
      toast.show('An error occurred during logout.', { type: 'danger' });
    }
  };

  const updateUserData = async (updatedData) => {
    try {
      await saveUserData('userData', updatedData);
      setUserData(updatedData);
      if (updatedData.postalCode) {
        setPostalCode(updatedData.postalCode);
      }
      toast.show('User data updated successfully!', { type: 'success' });
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.show('An error occurred while updating user data.', { type: 'danger' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userData,
        postalCode,
        loading,
        setIsLoggedIn,
        setPostalCode,
        updateUserData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};