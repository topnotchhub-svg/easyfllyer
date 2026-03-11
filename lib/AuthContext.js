import React, {createContext, useState, useEffect} from 'react';
import {getUserData, removeUserData, saveUserData} from './storageUtils'; // Utility functions for AsyncStorage
import {useToast} from 'react-native-toast-notifications';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // State to hold full user data
  const [postalCode, setPostalCode] = useState(''); // State for postal code
  const toast = useToast();

  // Check user data on app load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUserData('userData');
        if (user) {
          setUserData(user);
          setPostalCode(user.postalCode || ''); // Initialize postal code from user data
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking user data:', error);
      }
    };
    checkUser();
  }, [userData]);

  // Function to update user data
  const updateUserData = async updatedData => {
    try {
      // Remove existing user data to prevent conflicts
      await removeUserData('userData');

      // Save the updated user data
      await saveUserData('userData', updatedData);

      // Update local state with the new user data
      setUserData(updatedData);

      if (updatedData.postalCode) {
        setPostalCode(updatedData.postalCode); // Update postal code if it exists in updated data
      }

      toast.show('User data updated successfully!', {
        type: 'success',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in',
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.show('An error occurred while updating user data.', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in',
      });
    }
  };

  // Logout function with toast notification
  const logout = async () => {
    try {
      // Clear user data from AsyncStorage
      await removeUserData('userData');
      setUserData(null);
      setPostalCode(''); // Clear postal code
      setIsLoggedIn(false);

      toast.show('You have successfully logged out!', {
        type: 'success',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in',
      });

      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);

      toast.show('An error occurred during logout. Please try again.', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userData,
        postalCode, // Expose postal code to context consumers
        setIsLoggedIn,
        setPostalCode, // Expose setter for postal code
        updateUserData, // Function to update user data
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
