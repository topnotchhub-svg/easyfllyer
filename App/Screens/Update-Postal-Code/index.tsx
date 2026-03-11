import React, {useContext, useState} from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useToast} from 'react-native-toast-notifications';
import {AuthContext} from '../../../lib/AuthContext';
import {editPostalCode} from '../../../actions/postal-code/edit-code';

const UpdatePostalCodeScreen = ({navigation}: any) => {
  const [postalCode, setPostalCode] = useState(''); // Local state for new postal code input
  const [loading, setLoading] = useState(false); // Loading state
  const toast = useToast();

  const {
    updateUserData,
    postalCode: globalPostalCode,
    userData,
  } = useContext(AuthContext); // Access global postal code and updater

  const handleUpdatePostalCode = async () => {
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

      // Call the editPostalCode action
      const result = await editPostalCode(
        globalPostalCode,
        postalCode,
        userData.userId,
      ); // Replace with the actual userId

      if (result.success) {
        const {oldPostalCode, newPostalCode, userId, fcmToken} = result;

        // Update the global postal code in the context
        updateUserData({postalCode: newPostalCode, userId, fcmToken});

        toast.show(
          `Postal Code updated successfully from '${oldPostalCode}' to '${newPostalCode}'!`,
          {
            type: 'success',
            placement: 'top',
            duration: 3000,
            animationType: 'slide-in',
          },
        );

        // Navigate back to the previous screen
        navigation.goBack();
      } else {
        toast.show(result.message || 'Failed to update postal code.', {
          type: 'danger',
          placement: 'top',
          duration: 3000,
          animationType: 'slide-in',
        });
      }
    } catch (error) {
      console.error('Error updating postal code:', error);
      toast.show('An error occurred. Please try again later.', {
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="#000000" />
      </TouchableOpacity>

      {/* Profile Icon */}
      <View style={styles.profileIconContainer}>
        <Text style={styles.profileIconText}>📮</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Update Postal Code</Text>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder={'Enter your New Postal Code'}
        placeholderTextColor="#888"
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Postal Code Input"
      />

      {/* Current Postal Code Display */}
      <Text style={styles.currentPostalCode}>
        Current Postal Code: {globalPostalCode || 'Not Set'}
      </Text>

      {/* Update Button */}
      <TouchableOpacity
        onPress={handleUpdatePostalCode}
        style={[styles.updateButton, loading && styles.disabledButton]}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.updateButtonText}>Update</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    justifyContent: 'center',
    alignContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
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
    shadowOffset: {width: 0, height: 1},
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
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    color: '#2D3748',
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
    shadowOffset: {width: 0, height: 2},
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
