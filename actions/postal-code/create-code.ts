import {doc, collection, getDoc, setDoc, addDoc} from 'firebase/firestore';
import {db} from '../../lib/firebase';
import CryptoJS from 'crypto-js';
import messaging from 'firebase/messaging';

export async function createPostalCodeUser(postalCode: string): Promise<{
  success: boolean;
  message: string;
  userId?: string;
  postalCode?: string;
  fcmToken?: string;
}> {
  try {
    if (!postalCode || typeof postalCode !== 'string') {
      return {
        success: false,
        message: 'A valid postal code is required.',
      };
    }

    const postalRef = doc(db, 'postalCodes', postalCode);
    const postalDoc = await getDoc(postalRef);
    if (!postalDoc.exists()) {
      await setDoc(postalRef, {
        postalCode,
        createdAt: new Date().toISOString(),
      });
    }

    let token = '';
    try {
      token = await messaging().getToken();
    } catch (error) {
      console.warn('Error retrieving FCM token:', error);
    }

    const userId = CryptoJS.SHA256(
      `${new Date().toISOString()}-${postalCode}-${token || 'no-token'}`,
    ).toString(CryptoJS.enc.Hex);

    const usersRef = collection(postalRef, 'postalusers');
    await addDoc(usersRef, {
      userId,
      createdAt: new Date().toISOString(),
      fcmToken: token || null, 
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
