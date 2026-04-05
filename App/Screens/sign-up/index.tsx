import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { saveUserData } from '../../../lib/storageUtils'; 
import { AuthContext } from '../../../lib/AuthContext';
import { createPostalCodeUser } from '../../../actions/postal-code/create-code';

const SignupScreen = () => {
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { setIsLoggedIn, updateUserData } = useContext(AuthContext); 

  const handleSignup = async () => {
    if (!postalCode.trim()) {
      toast.show('Postal Code is required!', { type: 'danger', placement: 'top', duration: 3000, animationType: 'slide-in', });
      return;
    }

    try {
      setLoading(true);
      const result = await createPostalCodeUser(postalCode);
      if (result.success && result.userId) {
        const { userId, postalCode: userPostalCode, fcmToken } = result;
        const userData = { userId, postalCode: userPostalCode, fcmToken }; 

        await saveUserData('userData', userData);
        updateUserData(userData);
        toast.show('User registered successfully!', { type: 'success', placement: 'top', duration: 3000, animationType: 'slide-in', });

        setIsLoggedIn(true);
      } else {
        throw new Error( result.message || 'Registration failed. Please try again.', );
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // @ts-expect-error ignore
      toast.show(error.message || 'An error occurred. Please try again.', { type: 'danger', placement: 'top', duration: 3000, animationType: 'slide-in', });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileIconContainer}>
        <Image source={require('../../../assets/logo/playstore.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Easy Fllyer</Text>
      <TextInput style={styles.input} placeholder="Enter your Postal Code" placeholderTextColor="#999" value={postalCode} onChangeText={setPostalCode}
        keyboardType="default" keyboardAppearance="light" />
      <TouchableOpacity onPress={handleSignup} style={[styles.signupButton, loading && styles.disabledButton]} disabled={loading} >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.signupButtonText}>SIGN UP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 20,
  },
  profileIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#5A67D8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
});

export default SignupScreen;
