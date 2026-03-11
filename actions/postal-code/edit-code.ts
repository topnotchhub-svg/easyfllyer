import {
  doc,
  collection,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {db} from '../../lib/firebase';

export async function editPostalCode(
  oldPostalCode: string,
  newPostalCode: string,
  userId: string,
): Promise<{
  success: boolean;
  message: string;
  oldPostalCode?: string;
  newPostalCode?: string;
  userId?: string;
  fcmToken?: string;
}> {
  try {
    // Validate input
    if (!oldPostalCode || !newPostalCode || !userId) {
      return {
        success: false,
        message:
          'Valid old postal code, new postal code, and user ID are required.',
      };
    }

    // Reference the old postal code document
    const oldPostalRef = doc(db, 'postalCodes', oldPostalCode);
    const oldPostalDoc = await getDoc(oldPostalRef);

    if (!oldPostalDoc.exists()) {
      return {
        success: false,
        message: `Old postal code '${oldPostalCode}' not found.`,
      };
    }

    // Reference the users subcollection in the old postal code
    const oldUsersRef = collection(oldPostalRef, 'postalusers');
    const userQuery = query(oldUsersRef, where('userId', '==', userId));
    const userDocs = await getDocs(userQuery);

    if (userDocs.empty) {
      return {
        success: false,
        message: `User ID '${userId}' not found under postal code '${oldPostalCode}'.`,
      };
    }

    // Retrieve the FCM token from the user's document
    let fcmToken: string | null = null;
    for (const userDoc of userDocs.docs) {
      const userData = userDoc.data();
      fcmToken = userData?.fcmToken || null;
      await deleteDoc(userDoc.ref); // Delete the user's document from old postal code
    }

    // Reference the new postal code document
    const newPostalRef = doc(db, 'postalCodes', newPostalCode);
    const newPostalDoc = await getDoc(newPostalRef);

    if (!newPostalDoc.exists()) {
      // Create new postal code document if it doesn't exist
      await setDoc(newPostalRef, {
        postalCode: newPostalCode,
        createdAt: new Date().toISOString(),
      });
    }

    // Add the user to the new postal code
    const newUsersRef = collection(newPostalRef, 'postalusers');
    await setDoc(doc(newUsersRef, userId), {
      userId,
      createdAt: new Date().toISOString(),
      fcmToken, // Carry over the FCM token
    });

    return {
      success: true,
      message: `User ID '${userId}' successfully moved from postal code '${oldPostalCode}' to '${newPostalCode}'.`,
      oldPostalCode,
      newPostalCode,
      userId,
      // @ts-expect-error ignore
      fcmToken,
    };
  } catch (error) {
    console.error('Error in editPostalCode server action:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while editing the postal code.';

    return {
      success: false,
      message: errorMessage,
    };
  }
}
