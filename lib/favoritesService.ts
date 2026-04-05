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

// Get all favorites for a user
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

    console.log(`📥 Loaded ${favorites.length} favorites from Firebase for user ${userId}`);
    return favorites;
  } catch (error) {
    console.error('Error fetching favorites from Firebase:', error);
    return [];
  }
};

// Add a favorite to Firebase
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
    // Check if already exists to avoid duplicates
    const favoritesCollection = collection(db, 'favorites');
    const q = query(
      favoritesCollection,
      where('userId', '==', userId),
      where('id', '==', favorite.id)
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      console.log('Favorite already exists in Firebase, skipping...');
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
    console.log('✅ Favorite saved to Firebase:', favorite.name);
    return true;
  } catch (error) {
    console.error('Error saving favorite to Firebase:', error);
    return false;
  }
};

// Remove a favorite from Firebase
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

    // Delete all matching documents (should only be one)
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(docSnap => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();

    console.log('✅ Favorite removed from Firebase:', favorite.name);
    return true;
  } catch (error) {
    console.error('Error removing favorite from Firebase:', error);
    return false;
  }
};

// Load favorites from Firebase on app start
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
    console.log(`🔄 Synced ${firebaseFavorites.length} favorites from Firebase to Redux`);
  } catch (error) {
    console.error('Error syncing favorites from Firebase:', error);
  }
};