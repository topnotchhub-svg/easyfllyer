// actions/flyer/fetch-flyers.ts
import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../lib/firebase';
export interface Flyer {
  id: string;
  title: string;
  description: string;
  image: string | null;
  brandId: string;
  storeId?: string;
  validFrom: string;
  validTo: string;
  brandImage?: string | null;
  brandName?: string;
  brandQrCode?: string | null; 
}

export async function fetchFlyersByPostalCodeWithBrandImage(
  postalCode: string,
  selectedCategories: {name: string}[], 
): Promise<Flyer[]> {
  try {
    if (!postalCode) {
      throw new Error('Postal code is required.');
    }

    const brandsCollection = collection(db, 'brands');
    const brandQuery = query(
      brandsCollection,
      where('postalCode', '==', postalCode),
    );
    const brandSnapshot = await getDocs(brandQuery);

    if (brandSnapshot.empty) {
      console.warn('No brands found for the given postal code.');
      return [];
    }

    const brandData = brandSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = {
        id: doc.id,
        image: doc.data().image || null,
        name: doc.data().name || null,
        qrCode: doc.data().qrCode || null, 
      };
      return acc;
    }, {} as Record<string, {id: string; image: string | null; name: string; qrCode: string | null}>);

    const brandIds = Object.keys(brandData);
    if (brandIds.length === 0) {
      console.warn('No valid brand IDs found.');
      return [];
    }

    const flyersCollection = collection(db, 'flyers');
    let flyerQuery;
    if (!selectedCategories || selectedCategories.length === 0) {
      console.warn('No selected categories provided. Fetching all flyers.');
      flyerQuery = query(flyersCollection, where('brandId', 'in', brandIds));
    } else {
      const selectedCategoryNames = selectedCategories.map(cat => cat.name);

      flyerQuery = query(
        flyersCollection,
        where('brandId', 'in', brandIds),
        where('categoryId', 'in', selectedCategoryNames), 
      );
    }

    const flyerSnapshot = await getDocs(flyerQuery);
    if (flyerSnapshot.empty) {
      console.warn('No flyers found for the given brand IDs and selected categories.',);
      return [];
    }

    const flyers = flyerSnapshot.docs.map(doc => {
      const flyerData = doc.data() as Flyer;
      const brand = brandData[flyerData.brandId] || {};
      return {
        ...flyerData,
        id: doc.id,
        brandImage: brand.image || null,
        brandName: brand.name || '',
        brandQrCode: brand.qrCode || null, 
      };
    });

    return flyers;
  } catch (error) {
    console.error('Error fetching flyers by postal code:', error);
    return [];
  }
}
