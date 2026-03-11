import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { saveUserData } from '../../../lib/storageUtils'; // Import the utility function
import { AuthContext } from '../../../lib/AuthContext';
import { createPostalCodeUser } from '../../../actions/postal-code/create-code';

const SignupScreen = () => {
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { setIsLoggedIn, updateUserData } = useContext(AuthContext); // Access the setIsLoggedIn function

  // const handleSignup = async () => {
  //   if (!postalCode.trim()) {
  //     toast.show('Postal Code is required!', {
  //       type: 'danger',
  //       placement: 'top',
  //       duration: 3000,
  //       animationType: 'slide-in',
  //     });
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // Call createPostalCodeUser server action
  //     const result = await createPostalCodeUser(postalCode);

  //     if (result.success) {
  //       const userData = {postalCode, userId: result.userId}; // Save postalCode and userId
  //       await saveUserData('userData', userData);

  //       // Update AuthContext with the new user data
  //       updateUserData(userData);

  //       toast.show('User registered successfully!', {
  //         type: 'success',
  //         placement: 'top',
  //         duration: 3000,
  //         animationType: 'slide-in',
  //       });

  //       // Update the global login state
  //       setIsLoggedIn(true);
  //     } else {
  //       toast.show(result.message || 'Registration failed. Please try again.', {
  //         type: 'danger',
  //         placement: 'top',
  //         duration: 3000,
  //         animationType: 'slide-in',
  //       });
  //     }
  //   } catch (error) {
  //     toast.show('An error occurred. Please try again.', {
  //       type: 'danger',
  //       placement: 'top',
  //       duration: 3000,
  //       animationType: 'slide-in',
  //     });
  //     console.error('Error during registration:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSignup = async () => {
    if (!postalCode.trim()) {
      toast.show('Postal Code is required!', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in',
      });
      return;
    }

    try {
      setLoading(true);

      // Call createPostalCodeUser server action
      const result = await createPostalCodeUser(postalCode);

      if (result.success && result.userId) {
        const { userId, postalCode: userPostalCode, fcmToken } = result;
        const userData = { userId, postalCode: userPostalCode, fcmToken }; // Save postalCode, userId, and FCM token

        // Save user data locally
        await saveUserData('userData', userData);

        // Update AuthContext with the new user data
        updateUserData(userData);

        // Show success message
        toast.show('User registered successfully!', {
          type: 'success',
          placement: 'top',
          duration: 3000,
          animationType: 'slide-in',
        });

        // Update global login state
        setIsLoggedIn(true);
      } else {
        throw new Error(
          result.message || 'Registration failed. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // @ts-expect-error ignore
      toast.show(error.message || 'An error occurred. Please try again.', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <View style={styles.profileIconContainer}>
        <Image
          source={require('../../../assets/logo/playstore.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Easy Fllyer</Text>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter your Postal Code"
        placeholderTextColor="#999"
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType="default"
        keyboardAppearance="light"
      />

      {/* Signup Button */}
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
