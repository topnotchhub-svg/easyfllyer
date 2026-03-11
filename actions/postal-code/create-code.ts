import {doc, collection, getDoc, setDoc, addDoc} from 'firebase/firestore';
import {db} from '../../lib/firebase';
import CryptoJS from 'crypto-js';
import messaging from '@react-native-firebase/messaging';

export async function createPostalCodeUser(postalCode: string): Promise<{
  success: boolean;
  message: string;
  userId?: string;
  postalCode?: string;
  fcmToken?: string;
}> {
  try {
    // Validate postal code input
    if (!postalCode || typeof postalCode !== 'string') {
      return {
        success: false,
        message: 'A valid postal code is required.',
      };
    }

    // Reference the postal code document in Firestore
    const postalRef = doc(db, 'postalCodes', postalCode);

    // Check if the postal code document exists
    const postalDoc = await getDoc(postalRef);

    if (!postalDoc.exists()) {
      // Create the postal code document if it doesn't exist
      await setDoc(postalRef, {
        postalCode,
        createdAt: new Date().toISOString(),
      });
    }

    // Get Firebase messaging token
    let token = '';
    try {
      token = await messaging().getToken();
      console.log('FCM Token:', token);
    } catch (error) {
      console.warn('Error retrieving FCM token:', error);
    }

    // Generate a unique user ID using CryptoJS
    const userId = CryptoJS.SHA256(
      `${new Date().toISOString()}-${postalCode}-${token || 'no-token'}`,
    ).toString(CryptoJS.enc.Hex);

    // Reference the users subcollection under the postal code
    const usersRef = collection(postalRef, 'postalusers');

    // Add the user document to the subcollection
    await addDoc(usersRef, {
      userId,
      createdAt: new Date().toISOString(),
      fcmToken: token || null, // Save FCM token if available
    });

    return {
      success: true,
      message: `User created successfully under postal code '${postalCode}'.`,
      userId,
      postalCode,
      fcmToken: token as string,
    };
  } catch (error) {
    console.error('Error in createPostalCodeUser server action:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while processing the postal code.';

    return {
      success: false,
      message: errorMessage,
    };
  }
}
