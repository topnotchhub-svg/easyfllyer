import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useToast } from 'react-native-toast-notifications';
import { AuthContext } from '../../../lib/AuthContext';
import { editPostalCode } from '../../../actions/postal-code/edit-code';

const UpdatePostalCodeScreen = ({ navigation }: any) => {
  const [postalCode, setPostalCode] = useState('');
  const [displayPostalCode, setDisplayPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const {
    updateUserData,
    postalCode: globalPostalCode,
    userData,
  } = useContext(AuthContext);

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

  const handleUpdatePostalCode = async () => {
    if (!postalCode || postalCode.length !== 6) {
      toast.show('Please enter a valid 6-digit alphanumeric postal code!', { type: 'danger' });
      return;
    }

    try {
      setLoading(true);
      const result = await editPostalCode(globalPostalCode, postalCode, userData.userId);
      if (result.success) {
        const { oldPostalCode, newPostalCode, userId, fcmToken } = result;
        updateUserData({ postalCode: newPostalCode, userId, fcmToken });
        toast.show(`Postal Code updated successfully from '${oldPostalCode}' to '${newPostalCode}'!`, {
          type: 'success',
        });
        navigation.goBack();
      } else {
        toast.show(result.message || 'Failed to update postal code.', { type: 'danger' });
      }
    } catch (error) {
      console.error('Error updating postal code:', error);
      toast.show('An error occurred. Please try again later.', { type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#000000" />
        </TouchableOpacity>

        <View style={styles.profileIconContainer}>
          <Text style={styles.profileIconText}>📮</Text>
        </View>
        
        <Text style={styles.title}>Update Postal Code</Text>
        
        <TextInput
          style={styles.input}
          placeholder="ABC 123"
          placeholderTextColor="#888"
          value={displayPostalCode}
          onChangeText={handlePostalCodeChange}
          keyboardType="default"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7} // 6 digits + 1 space
          accessibilityLabel="Postal Code Input"
        />
        
        <Text style={styles.hintText}>
          Enter 6-digit alphanumeric code (e.g., ABC123)
        </Text>
        
        <Text style={styles.currentPostalCode}>
          Current Postal Code: {globalPostalCode || 'Not Set'}
        </Text>

        <TouchableOpacity
          onPress={handleUpdatePostalCode}
          style={[styles.updateButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.updateButtonText}>Update</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  profileIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileIconText: {
    fontSize: 40,
    color: '#4A5568',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    color: '#2D3748',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    color: '#2D3748',
    textAlign: 'center',
    letterSpacing: 2,
  },
  hintText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  currentPostalCode: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 20,
    textAlign: 'center',
  },
  updateButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4C6EF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
});

export default UpdatePostalCodeScreen;