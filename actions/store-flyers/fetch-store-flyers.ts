import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../lib/firebase';

export interface StoreFlyer {
  id: string;
  title: string;
  description: string;
  image: string | null;
  storeId: string;
  categoryID: string;
  validFrom: string;
  validTo: string;
  storeImage?: string | null;
  storeName?: string;
  storeQrCode?: string | null; 
}

export async function fetchStoreFlyersWithStoreImage(
  postalCode: string,
  selectedCategories: {name: string}[], 
): Promise<StoreFlyer[]> {
  try {
    if (!postalCode) {
      throw new Error('❌ Postal code is required.');
    }

    // Step 1: Fetch stores associated with the postal code
    const storesCollection = collection(db, 'stores');
    const storeQuery = query(
      storesCollection,
      where('postalCode', '==', postalCode),
          where('active', '==', true)
    );
    const storeSnapshot = await getDocs(storeQuery);

    if (storeSnapshot.empty) {
      console.warn('⚠️ No stores found for the given postal code.');
      return [];
    }

    // Map store data to a dictionary for quick access
    const storeData = storeSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[doc.id] = {
        id: doc.id,
        image: data.image || null,
        name: data.name || null,
        qrCode: data.qrCode || null, 
      };
      return acc;
    }, {} as Record<string, {id: string; image: string | null; name: string; qrCode: string | null}>);

    const storeIds = Object.keys(storeData);

    if (storeIds.length === 0) {
      console.warn('⚠️ No valid store IDs found.');
      return [];
    }

    // Step 2: Fetch store flyers associated with the retrieved store IDs

    const storeFlyersCollection = collection(db, 'storeFlyers');

    let flyerQuery;
    if (!selectedCategories || selectedCategories.length === 0) {
      // ✅ No categories selected → Fetch all flyers for the stores
      console.warn('⚠️ No selected categories provided. Fetching all flyers.');
      flyerQuery = query(
        storeFlyersCollection,
        where('storeId', 'in', storeIds),
      where('approved', '==', true)
      );
    } else {
      // ✅ Categories selected → Filter flyers by categories
      const selectedCategoryNames = selectedCategories.map(cat => cat.name);

      flyerQuery = query(
        storeFlyersCollection,
        where('storeId', 'in', storeIds),
        where('categoryId', 'in', selectedCategoryNames), 
      where('approved', '==', true)
      );
    }

    const flyerSnapshot = await getDocs(flyerQuery);

    if (flyerSnapshot.empty) {
      console.warn(
        '⚠️ No store flyers found for the given store IDs and selected categories.',
      );
      return [];
    }

    // Map flyers and include the store image, name, and QR code
    const flyers = flyerSnapshot.docs.map(flyerDoc => {
      const flyer = flyerDoc.data() as StoreFlyer;
      const store = storeData[flyer.storeId] || {};
      return {
        ...flyer,
        id: flyerDoc.id,
        storeImage: store.image || null,
        storeName: store.name || '',
        storeQrCode: store.qrCode || null, 
      };
    });

    return flyers;
  } catch (error) {
    console.error('❌ Error fetching store flyers with store image:', error);
    return [];
  }
}
