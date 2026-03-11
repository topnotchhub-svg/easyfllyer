import {
  doc,
  collection,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {db} from '../../lib/firebase';

export async function deleteUser(
  postalCode: string,
  userId: string,
): Promise<{success: boolean; message: string}> {
  try {
    // Validate input
    if (!postalCode || !userId) {
      return {
        success: false,
        message: 'A valid postal code and user ID are required.',
      };
    }

    // Reference the postal code document
    const postalRef = doc(db, 'postalCodes', postalCode);

    // Check if the postal code document exists
    const postalDoc = await getDoc(postalRef);
    if (!postalDoc.exists()) {
      return {
        success: false,
        message: `Postal code '${postalCode}' not found.`,
      };
    }

    // Reference the users subcollection
    const usersRef = collection(postalRef, 'postalusers');

    // Query for the specific user document
    const userQuery = query(usersRef, where('userId', '==', userId));
    const userDocs = await getDocs(userQuery);

    if (userDocs.empty) {
      return {
        success: false,
        message: `User ID '${userId}' not found under postal code '${postalCode}'.`,
      };
    }

    // Delete the user document
    for (const userDoc of userDocs.docs) {
      await deleteDoc(userDoc.ref);
    }

    // Check if the users subcollection is now empty
    const remainingUsers = await getDocs(usersRef);

    if (remainingUsers.empty) {
      // Optionally delete the postal code document if no users remain
      await deleteDoc(postalRef);
      return {
        success: true,
        message: `User ID '${userId}' deleted. Postal code '${postalCode}' removed as no users remain.`,
      };
    }

    return {
      success: true,
      message: `User ID '${userId}' deleted successfully.`,
    };
  } catch (error) {
    console.error('Error in deleteUser server action:', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred while deleting the user.';

    return {
      success: false,
      message: errorMessage,
    };
  }
}
