import {collection, getDocs} from 'firebase/firestore';
import {db} from '../../lib/firebase';

export async function fetchAllStores() {
  try {
    // Reference the "stores" collection
    const storesRef = collection(db, 'stores');

    // Get all documents from the collection
    const querySnapshot = await getDocs(storesRef);

    // Map the documents into an array of stores
    const stores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return stores;
  } catch (error) {
    console.error('Error fetching all stores:', error);
    return [];
  }
}
