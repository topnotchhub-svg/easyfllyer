// services/favoritesService.ts
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

interface Favorite {
  id: string;
  name: string;
  type: string;
  image?: string;
}

interface FavoriteDocument extends Favorite {
  userId: string;
  fcmToken: string;
  createdAt: Timestamp;
}

export const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
  if (!userId) {
    console.log('No userId provided');
    return [];
  }

  try {
    const favoritesCollection = collection(db, 'favorites');
    const q = query(favoritesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const favorites = querySnapshot.docs.map(doc => ({
      id: doc.data().id,
      name: doc.data().name,
      type: doc.data().type,
      image: doc.data().image,
    }));

    return favorites;
  } catch (error) {
    console.error('Error fetching favorites from Firebase:', error);
    return [];
  }
};

export const addFavoriteToFirebase = async (
  userId: string,
  favorite: Favorite,
  fcmToken: string,
): Promise<boolean> => {
  if (!userId || !favorite?.id) {
    console.error('Invalid userId or favorite object');
    return false;
  }

  try {
    const favoritesCollection = collection(db, 'favorites');
    const q = query(
      favoritesCollection,
      where('userId', '==', userId),
      where('id', '==', favorite.id)
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      return true;
    }

    const favoriteData: FavoriteDocument = {
      userId,
      fcmToken,
      id: favorite.id,
      name: favorite.name,
      type: favorite.type || 'flyer',
      image: favorite.image || '',
      createdAt: Timestamp.now(),
    };

    const newDocRef = doc(favoritesCollection);
    await setDoc(newDocRef, favoriteData);
    return true;
  } catch (error) {
    console.error('Error saving favorite to Firebase:', error);
    return false;
  }
};

export const removeFavoriteFromFirebase = async (
  userId: string,
  favorite: Favorite,
): Promise<boolean> => {
  if (!userId || !favorite?.id) {
    console.error('Invalid userId or favorite object');
    return false;
  }

  try {
    const favoritesCollection = collection(db, 'favorites');
    const q = query(
      favoritesCollection,
      where('userId', '==', userId),
      where('id', '==', favorite.id),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('Favorite not found in Firebase');
      return true;
    }

    const batch = writeBatch(db);
    querySnapshot.docs.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();

    return true;
  } catch (error) {
    console.error('Error removing favorite from Firebase:', error);
    return false;
  }
};

export const syncFavoritesFromFirebase = async (
  userId: string,
  dispatch: any,
  setFavoritesAction: any
): Promise<void> => {
  if (!userId) return;

  try {
    const firebaseFavorites = await getUserFavorites(userId);
    // Dispatch action to populate Redux with Firebase favorites
    dispatch(setFavoritesAction(firebaseFavorites));
  } catch (error) {
    console.error('Error syncing favorites from Firebase:', error);
  }
};