import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface Brand {
  id: string;
  name: string;
  email: string;
  description: string;
  image: string | null;
  adminId: string;
  postalCode: string;
}

// Fetch a single brand by ID
export async function fetchBrandById(brandId: string): Promise<Brand | null> {
  try {
    if (!brandId) {
      console.warn('Brand ID is required');
      return null;
    }

    const brandDoc = doc(db, 'brands', brandId);
    const brandSnapshot = await getDoc(brandDoc);

    if (!brandSnapshot.exists()) {
      console.warn(`Brand with ID ${brandId} not found`);
      return null;
    }

    return {
      id: brandSnapshot.id,
      ...brandSnapshot.data(),
    } as Brand;
  } catch (error) {
    console.error('Error fetching brand by ID:', error);
    return null;
  }
}
