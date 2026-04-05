import React, {createContext, useState, useEffect} from 'react';
import {getUserData, removeUserData, saveUserData} from './storageUtils'; 
import {useToast} from 'react-native-toast-notifications';

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [postalCode, setPostalCode] = useState(''); 
  const toast = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUserData('userData');
        if (user) {
          setUserData(user);
          setPostalCode(user.postalCode || ''); 
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

  const updateUserData = async updatedData => {
    try {
      await removeUserData('userData');
      await saveUserData('userData', updatedData);
      setUserData(updatedData);
      if (updatedData.postalCode) {
        setPostalCode(updatedData.postalCode); 
      }

      toast.show('User data updated successfully!', { type: 'success', placement: 'top', duration: 3000, animationType: 'slide-in', });
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.show('An error occurred while updating user data.', { type: 'danger', placement: 'top', duration: 3000, animationType: 'slide-in', });
    }
  };

  const logout = async () => {
    try {
      await removeUserData('userData');
      setUserData(null);
      setPostalCode(''); 
      setIsLoggedIn(false);
      toast.show('You have successfully logged out!', { type: 'success', placement: 'top', duration: 3000, animationType: 'slide-in', });

    } catch (error) {
      console.error('Error during logout:', error);
      toast.show('An error occurred during logout. Please try again.', { type: 'danger', placement: 'top', duration: 3000, animationType: 'slide-in', });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userData,
        postalCode, 
        setIsLoggedIn,
        setPostalCode, 
        updateUserData, 
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
