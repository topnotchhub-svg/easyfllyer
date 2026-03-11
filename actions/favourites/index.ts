import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';
import {db} from '../../lib/firebase';

export const getFavoritesFromFirebase = async (userId: string) => {
  try {
    const favoritesCollection = collection(db, 'favorites');
    const q = query(favoritesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const favorites = querySnapshot.docs.map(doc => ({
      id: doc.id, // Use Firestore's generated document ID
      ...doc.data(),
    }));

    console.log('Fetched favorites from Firebase:', favorites);
    return favorites;
  } catch (error) {
    console.error('Error fetching favorites from Firebase:', error);
    throw new Error('Failed to fetch favorites from Firebase.');
  }
};

// export const saveFavoriteToFirebase = async (
//   userId: string,
//   favorite: {id: string; name: string; type: string},
// ) => {
//   try {
//     // Use Firestore to create a new document in the 'favorites' collection
//     const favoritesCollection = collection(db, 'favorites');
//     await setDoc(doc(favoritesCollection), {userId, ...favorite});
//     console.log('Saved favorite to Firebase:', favorite);
//   } catch (error) {
//     console.error('Error saving favorite to Firebase:', error);
//     throw new Error('Failed to save favorite to Firebase.');
//   }
// };

// export const saveFavoriteToFirebase = async (
//   userId: string,
//   favorite: {id: string; name: string; type: string; address?: string},
//   fcmToken : string
// ) => {
//   try {
//     // Validate the favorite object
//     const cleanedFavorite = Object.fromEntries(
//       Object.entries({userId, ...favorite}).filter(
//         ([_, value]) => value !== undefined,
//       ),
//     );

//     // Use Firestore to create a new document in the 'favorites' collection
//     const favoritesCollection = collection(db, 'favorites');
//     await setDoc(doc(favoritesCollection), cleanedFavorite);

//     console.log('Saved favorite to Firebase:', cleanedFavorite);
//   } catch (error) {
//     console.error('Error saving favorite to Firebase:', error);
//     throw new Error('Failed to save favorite to Firebase.');
//   }
// };

export const saveFavoriteToFirebase = async (
  userId: string,
  favorite: {id: string; name: string; type: string; address?: string},
  fcmToken: string,
) => {
  try {
    // Validate the favorite object and include the FCM token
    const cleanedFavorite = Object.fromEntries(
      Object.entries({userId, fcmToken, ...favorite}).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    // Use Firestore to create a new document in the 'favorites' collection
    const favoritesCollection = collection(db, 'favorites');
    await setDoc(doc(favoritesCollection), cleanedFavorite);

    console.log('Saved favorite to Firebase with FCM token:', cleanedFavorite);
  } catch (error) {
    console.error('Error saving favorite to Firebase:', error);
    throw new Error('Failed to save favorite to Firebase.');
  }
};

export const removeFavoriteFromFirebase = async (
  userId: string,
  favorite: {id: string; name: string; type: string},
) => {
  try {
    if (!userId || !favorite?.id) {
      throw new Error('Invalid userId or favorite object.');
    }

    console.log('Removing favorite with data:', {userId, favorite});

    // Query to find the document for this favorite
    const favoritesCollection = collection(db, 'favorites');
    const q = query(
      favoritesCollection,
      where('userId', '==', userId),
      where('id', '==', favorite.id),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Favorite not found in Firebase.');
    }

    // Delete the document(s) found
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, 'favorites', docSnap.id));
      console.log('Favorite removed from Firebase:', favorite);
    }
  } catch (error) {
    console.error('Error removing favorite from Firebase:', error);
    throw new Error('Failed to remove favorite from Firebase.');
  }
};
