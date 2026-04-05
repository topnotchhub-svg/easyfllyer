// actions/brand/fetch-brands.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface Entity {
  id: string;
  name: string;
  type: 'brand' | 'store';
  postalCode: string;
  description?: string;
  image?: string | null;
  address?: string;
  brandId?: string;
  email?: string; // Add email for brands
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  email: string;
  image: string;
  postalCode: string;
  createdAt?: string;
  active?: boolean; // Add active status
}

export const fetchAllBrands = async (): Promise<Brand[]> => {
  try {
    const brandsCollection = collection(db, 'brands');
    const querySnapshot = await getDocs(brandsCollection);
    
    const brands = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      description: doc.data().description || '',
      email: doc.data().email || '',
      image: doc.data().compressedImage || doc.data().image || '',
      postalCode: doc.data().postalCode || '',
      createdAt: doc.data().createdAt || '',
      active: doc.data().active ?? true, // Add active status
    })) as Brand[];
    
    // Optional: Sort by name
    brands.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`✅ Fetched ${brands.length} brands`);
    return brands;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

export async function fetchEntitiesByPostalCode(
  postalCode: string,
): Promise<{ success: boolean; message: string; entities?: Entity[] }> {
  try {
    if (!postalCode) {
      return {
        success: false,
        message: 'Postal code is required to fetch entities.',
      };
    }

    // Fetch brands
    const brandsCollection = collection(db, 'brands');
    const brandsQuery = query(
      brandsCollection,
      where('postalCode', '==', postalCode),
      where('active', '==', true) // Only fetch active brands
    );
    const brandsSnapshot = await getDocs(brandsQuery);

    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      type: 'brand' as const,
      postalCode: doc.data().postalCode,
      description: doc.data().description,
      image: doc.data().compressedImage || doc.data().image || null,
      email: doc.data().email,
    })) as Entity[];

    // Fetch stores
    const storesCollection = collection(db, 'stores');
    const storesQuery = query(
      storesCollection,
      where('postalCode', '==', postalCode),
      where('active', '==', true) // Only fetch active stores
    );
    const storesSnapshot = await getDocs(storesQuery);

    const stores = storesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      type: 'store' as const,
      postalCode: doc.data().postalCode,
      address: doc.data().address,
      brandId: doc.data().brandId,
      image: doc.data().image || null,
    })) as Entity[];

    const entities = [...brands, ...stores];
    
    // Sort entities by name
    entities.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`✅ Fetched ${entities.length} entities (${brands.length} brands, ${stores.length} stores) for postal code: ${postalCode}`);

    return {
      success: true,
      message: 'Entities fetched successfully.',
      entities,
    };
  } catch (error) {
    console.error('Error fetching entities by postal code:', error);
    return {
      success: false,
      message: 'An error occurred while fetching entities.',
    };
  }
}