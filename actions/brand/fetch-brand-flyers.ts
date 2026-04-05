// actions/brand/fetch-brand-flyers.ts
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface Flyer {
  id: string;
  title: string;
  description: string;
  image: string;
  validFrom: string;
  validTo: string;
  brandId: string;
  createdAt: string;
}

export const fetchFlyersByBrand = async (brandId: string): Promise<Flyer[]> => {
  try {
    const flyersCollection = collection(db, 'flyers');
    const q = query(flyersCollection, where('brandId', '==', brandId),
      where('approved', '==', true));
    const querySnapshot = await getDocs(q);
    
    const flyers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || '',
      description: doc.data().description || '',
      image: doc.data().image || '',
      validFrom: doc.data().validFrom || '',
      validTo: doc.data().validTo || '',
      brandId: doc.data().brandId || '',
      createdAt: doc.data().createdAt || new Date().toISOString(),
    })) as Flyer[];
    
    // Sort by creation date (newest first)
    flyers.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return flyers;
  } catch (error) {
    console.error('Error fetching brand flyers:', error);
    return [];
  }
};