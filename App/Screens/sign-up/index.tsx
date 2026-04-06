import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { saveUserData } from '../../../lib/storageUtils'; 
import { AuthContext } from '../../../lib/AuthContext';
import { createPostalCodeUser } from '../../../actions/postal-code/create-code';

const SignupScreen = () => {
  const [postalCode, setPostalCode] = useState('');
  const [displayPostalCode, setDisplayPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { setIsLoggedIn, updateUserData } = useContext(AuthContext); 

  // Format postal code with space after 3 digits
  const formatPostalCode = (text: string) => {
    // Remove non-alphanumeric characters
    let cleaned = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Limit to 6 characters
    cleaned = cleaned.slice(0, 6);
    
    // Add space after 3 digits if length > 3
    let formatted = cleaned;
    if (cleaned.length > 3) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    }
    
    return { cleaned, formatted };
  };

  const handlePostalCodeChange = (text: string) => {
    const { cleaned, formatted } = formatPostalCode(text);
    setPostalCode(cleaned);
    setDisplayPostalCode(formatted);
  };

  const handleSignup = async () => {
    if (!postalCode || postalCode.length !== 6) {
      toast.show('Please enter a valid 6-digit alphanumeric postal code!', { type: 'danger' });
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
        toast.show('User registered successfully!', { type: 'success' });

        setIsLoggedIn(true);
      } else {
        throw new Error(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // @ts-expect-error ignore
      toast.show(error.message || 'An error occurred. Please try again.', { type: 'danger' });
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
      
      <TextInput 
        style={styles.input} 
        placeholder="ABC 123" 
        placeholderTextColor="#999" 
        value={displayPostalCode} 
        onChangeText={handlePostalCodeChange}
        keyboardType="default"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={7} // 6 digits + 1 space
      />
      
      <Text style={styles.hintText}>
        Enter 6-digit alphanumeric code (e.g., ABC123)
      </Text>
      
      <TouchableOpacity 
        onPress={handleSignup} 
        style={[styles.signupButton, loading && styles.disabledButton]} 
        disabled={loading} 
      >
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
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: '#fff',
    textAlign: 'center',
    letterSpacing: 2,
  },
  hintText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
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