// actions/store/fetch-store-flyers.ts
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface Flyer {
  id: string;
  title: string;
  description: string;
  image: string;
  validFrom: string;
  validTo: string;
  storeId: string;
  createdAt: string;
}

export const fetchFlyersByStore = async (storeId: string): Promise<Flyer[]> => {
  try {
    const flyersCollection = collection(db, 'storeFlyers');
    const q = query(flyersCollection, where('storeId', '==', storeId));
    const querySnapshot = await getDocs(q);
    
    const flyers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '',
      description: doc.data().description || '',
      image: doc.data().image || '',
      validFrom: doc.data().validFrom || '',
      validTo: doc.data().validTo || '',
      storeId: doc.data().storeId || '',
      createdAt: doc.data().createdAt || new Date().toISOString(),
    })) as Flyer[];
    
    // Sort by creation date (newest first)
    flyers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return flyers;
  } catch (error) {
    console.error('Error fetching store flyers:', error);
    return [];
  }
};