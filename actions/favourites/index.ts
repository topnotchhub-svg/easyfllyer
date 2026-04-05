import { doc, setDoc, getDocs, deleteDoc, collection, query, where, } from 'firebase/firestore';
import {db} from '../../lib/firebase';

export const getFavoritesFromFirebase = async (userId: string) => {
  try {
    const favoritesCollection = collection(db, 'favorites');
    const q = query(favoritesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const favorites = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data(),
    }));

    return favorites;
  } catch (error) {
    console.error('Error fetching favorites from Firebase:', error);
    throw new Error('Failed to fetch favorites from Firebase.');
  }
};

export const saveFavoriteToFirebase = async (
  userId: string,
  favorite: {id: string; name: string; type: string; address?: string},
  fcmToken: string,
) => {
  try {
    const cleanedFavorite = Object.fromEntries(
      Object.entries({userId, fcmToken, ...favorite}).filter(
        ([_, value]) => value !== undefined,
      ),
    );
console.log('its here');
    const favoritesCollection = collection(db, 'favorites');
    await setDoc(doc(favoritesCollection), cleanedFavorite);

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

    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, 'favorites', docSnap.id));
      console.log('Favorite removed from Firebase:', favorite);
    }
  } catch (error) {
    console.error('Error removing favorite from Firebase:', error);
    throw new Error('Failed to remove favorite from Firebase.');
  }
};

// export const saveFavoriteToFirebase = async (
//   userId: string,
//   favorite: {id: string; name: string; type: string},
// ) => {
//   try {
//     const favoritesCollection = collection(db, 'favorites');
//     await setDoc(doc(favoritesCollection), {userId, ...favorite});
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
//     const cleanedFavorite = Object.fromEntries(
//       Object.entries({userId, ...favorite}).filter(
//         ([_, value]) => value !== undefined,
//       ),
//     );

//     const favoritesCollection = collection(db, 'favorites');
//     await setDoc(doc(favoritesCollection), cleanedFavorite);

//   } catch (error) {
//     console.error('Error saving favorite to Firebase:', error);
//     throw new Error('Failed to save favorite to Firebase.');
//   }
// };

