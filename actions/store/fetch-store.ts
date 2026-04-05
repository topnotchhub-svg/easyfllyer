import {collection, getDocs, query, where } from 'firebase/firestore';
import {db} from '../../lib/firebase';

export async function fetchAllStores() {
  try {
    // Reference the "stores" collection
    const storesRef = collection(db, 'stores');
        const storeQuery = query(
          storesRef,
          where('active', '==', true)
        );

    // Get all documents from the collection
    const querySnapshot = await getDocs(storeQuery);

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
