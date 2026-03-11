// import {collection, getDoc, getDocs, doc} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// export async function fetchStoreFlyersWithStoreImage() {
//   try {
//     const flyersCollection = collection(db, 'storeFlyers');
//     const flyerSnapshot = await getDocs(flyersCollection);

//     const flyers = flyerSnapshot.docs.map(async flyerDoc => {
//       const flyer = flyerDoc.data();

//       // Fetch store details
//       const storeRef = doc(db, 'stores', flyer.storeId);
//       const storeDoc = await getDoc(storeRef);

//       const storeData = storeDoc.exists() ? storeDoc.data() : {};

//       return {
//         id: flyerDoc.id,
//         ...flyer,
//         storeImage: storeData.image || null,
//         storeName: storeData.name || null,
//       };
//     });

//     return Promise.all(flyers); // Resolve all promises
//   } catch (error) {
//     console.error('Error fetching store flyers with store image:', error);
//     return [];
//   }
// }

/////////////////////////////////////////////////////////////////////////////////

// import {collection, getDocs, query, where} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// export interface StoreFlyer {
//   id: string;
//   title: string;
//   description: string;
//   image: string | null;
//   storeId: string;
//   categoryID: string;
//   validFrom: string;
//   validTo: string;
//   storeImage?: string | null;
//   storeName?: string;
// }

// // Fetch store flyers by postal code with store images and selected categories
// export async function fetchStoreFlyersWithStoreImage(
//   postalCode: string,
//   selectedCategories: {name: string}[], // Selected categories with only name field
// ): Promise<StoreFlyer[]> {
//   try {
//     if (!postalCode) {
//       throw new Error('Postal code is required.');
//     }

//     if (!selectedCategories || selectedCategories.length === 0) {
//       console.warn('No selected categories provided.');
//       return [];
//     }

//     // Extract category names from selected categories array
//     const selectedCategoryNames = selectedCategories.map(cat => cat.name);
//     console.log('🚀 ~ Selected Category Names:', selectedCategoryNames);

//     // Step 1: Fetch stores associated with the postal code
//     const storesCollection = collection(db, 'stores');
//     const storeQuery = query(
//       storesCollection,
//       where('postalCode', '==', postalCode),
//     );
//     const storeSnapshot = await getDocs(storeQuery);

//     if (storeSnapshot.empty) {
//       console.warn('No stores found for the given postal code.');
//       return [];
//     }

//     // Map store data to a dictionary for quick access
//     const storeData = storeSnapshot.docs.reduce((acc, doc) => {
//       acc[doc.id] = {
//         id: doc.id,
//         image: doc.data().image || null,
//         name: doc.data().name || null,
//       };
//       return acc;
//     }, {} as Record<string, {id: string; image: string | null; name: string}>);

//     const storeIds = Object.keys(storeData);
//     console.log('🚀 ~ Store IDs:', storeIds);

//     if (storeIds.length === 0) {
//       console.warn('No valid store IDs found.');
//       return [];
//     }

//     // Step 2: Fetch store flyers associated with the retrieved store IDs and selected categories
//     const storeFlyersCollection = collection(db, 'storeFlyers');
//     const flyerQuery = query(
//       storeFlyersCollection,
//       where('storeId', 'in', storeIds),
//       where('categoryId', 'in', selectedCategoryNames), // Filtering by selected category names
//     );
//     const flyerSnapshot = await getDocs(flyerQuery);

//     if (flyerSnapshot.empty) {
//       console.warn(
//         'No store flyers found for the given store IDs and selected categories.',
//       );
//       return [];
//     }

//     // Map flyers and include the store image and name
//     const flyers = flyerSnapshot.docs.map(flyerDoc => {
//       const flyer = flyerDoc.data() as StoreFlyer;
//       const store = storeData[flyer.storeId] || {};
//       return {
//         ...flyer,
//         id: flyerDoc.id,
//         storeImage: store.image || null,
//         storeName: store.name || '',
//       };
//     });

//     console.log('🚀 ~ Store Flyers with store images:', flyers);
//     return flyers;
//   } catch (error) {
//     console.error('Error fetching store flyers with store image:', error);
//     return [];
//   }
// }

/////////////////////////////////////////////////////////////////////////////////
///////////////////  WORKING CODE ///////////////////////////////////

// import {collection, getDocs, query, where} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// export interface StoreFlyer {
//   id: string;
//   title: string;
//   description: string;
//   image: string | null;
//   storeId: string;
//   categoryID: string;
//   validFrom: string;
//   validTo: string;
//   storeImage?: string | null;
//   storeName?: string;
//   storeQrCode?: string | null; // Added store QR code
// }

// // Fetch store flyers by postal code with store images and selected categories
// export async function fetchStoreFlyersWithStoreImage(
//   postalCode: string,
//   selectedCategories: {name: string}[], // Selected categories with only name field
// ): Promise<StoreFlyer[]> {
//   try {
//     console.log('🚀 Starting fetchStoreFlyersWithStoreImage function');
//     console.log('📩 Postal Code Received:', postalCode);
//     console.log('📂 Selected Categories Received:', selectedCategories);

//     if (!postalCode) {
//       throw new Error('❌ Postal code is required.');
//     }

//     if (!selectedCategories || selectedCategories.length === 0) {
//       console.warn('⚠️ No selected categories provided.');
//       return [];
//     }

//     // Extract category names from selected categories array
//     const selectedCategoryNames = selectedCategories.map(cat => cat.name);
//     console.log('🔍 Selected Category Names:', selectedCategoryNames);

//     // Step 1: Fetch stores associated with the postal code
//     console.log('🛒 Fetching stores for postal code...');
//     const storesCollection = collection(db, 'stores');
//     const storeQuery = query(
//       storesCollection,
//       where('postalCode', '==', postalCode),
//     );
//     const storeSnapshot = await getDocs(storeQuery);

//     if (storeSnapshot.empty) {
//       console.warn('⚠️ No stores found for the given postal code.');
//       return [];
//     }

//     console.log(`🏬 Found ${storeSnapshot.size} stores.`);

//     // Map store data to a dictionary for quick access
//     const storeData = storeSnapshot.docs.reduce((acc, doc) => {
//       const data = doc.data();
//       acc[doc.id] = {
//         id: doc.id,
//         image: data.image || null,
//         name: data.name || null,
//         qrCode: data.qrCode || null, // Handle missing QR code gracefully
//       };
//       return acc;
//     }, {} as Record<string, {id: string; image: string | null; name: string; qrCode: string | null}>);

//     const storeIds = Object.keys(storeData);
//     console.log('🏪 Store IDs Retrieved:', storeIds);

//     if (storeIds.length === 0) {
//       console.warn('⚠️ No valid store IDs found.');
//       return [];
//     }

//     // Step 2: Fetch store flyers associated with the retrieved store IDs and selected categories
//     console.log(
//       '📄 Fetching store flyers for selected categories and stores...',
//     );
//     const storeFlyersCollection = collection(db, 'storeFlyers');
//     const flyerQuery = query(
//       storeFlyersCollection,
//       where('storeId', 'in', storeIds),
//       where('categoryId', 'in', selectedCategoryNames), // Filtering by selected category names
//     );
//     const flyerSnapshot = await getDocs(flyerQuery);

//     if (flyerSnapshot.empty) {
//       console.warn(
//         '⚠️ No store flyers found for the given store IDs and selected categories.',
//       );
//       return [];
//     }

//     console.log(`📃 Found ${flyerSnapshot.size} store flyers.`);

//     // Map flyers and include the store image, name, and QR code
//     const flyers = flyerSnapshot.docs.map(flyerDoc => {
//       const flyer = flyerDoc.data() as StoreFlyer;
//       const store = storeData[flyer.storeId] || {};
//       return {
//         ...flyer,
//         id: flyerDoc.id,
//         storeImage: store.image || null,
//         storeName: store.name || '',
//         storeQrCode: store.qrCode || null, // Ensure qrCode is handled safely
//       };
//     });

//     console.log('🚀 Store Flyers with store images and QR codes:', flyers);
//     return flyers;
//   } catch (error) {
//     console.error('❌ Error fetching store flyers with store image:', error);
//     return [];
//   }
// }

////////////////////////////////////////////////////////////////////////////////

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
  storeQrCode?: string | null; // Added store QR code
}

// Fetch store flyers by postal code with store images and selected categories
export async function fetchStoreFlyersWithStoreImage(
  postalCode: string,
  selectedCategories: {name: string}[], // Selected categories with only name field
): Promise<StoreFlyer[]> {
  try {
    console.log('🚀 Starting fetchStoreFlyersWithStoreImage function');
    console.log('📩 Postal Code Received:', postalCode);
    console.log('📂 Selected Categories Received:', selectedCategories);

    if (!postalCode) {
      throw new Error('❌ Postal code is required.');
    }

    // Step 1: Fetch stores associated with the postal code
    console.log('🛒 Fetching stores for postal code...');
    const storesCollection = collection(db, 'stores');
    const storeQuery = query(
      storesCollection,
      where('postalCode', '==', postalCode),
    );
    const storeSnapshot = await getDocs(storeQuery);

    if (storeSnapshot.empty) {
      console.warn('⚠️ No stores found for the given postal code.');
      return [];
    }

    console.log(`🏬 Found ${storeSnapshot.size} stores.`);

    // Map store data to a dictionary for quick access
    const storeData = storeSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[doc.id] = {
        id: doc.id,
        image: data.image || null,
        name: data.name || null,
        qrCode: data.qrCode || null, // Handle missing QR code gracefully
      };
      return acc;
    }, {} as Record<string, {id: string; image: string | null; name: string; qrCode: string | null}>);

    const storeIds = Object.keys(storeData);
    console.log('🏪 Store IDs Retrieved:', storeIds);

    if (storeIds.length === 0) {
      console.warn('⚠️ No valid store IDs found.');
      return [];
    }

    // Step 2: Fetch store flyers associated with the retrieved store IDs
    console.log(
      '📄 Fetching store flyers for selected categories and stores...',
    );
    const storeFlyersCollection = collection(db, 'storeFlyers');

    let flyerQuery;
    if (!selectedCategories || selectedCategories.length === 0) {
      // ✅ No categories selected → Fetch all flyers for the stores
      console.warn('⚠️ No selected categories provided. Fetching all flyers.');
      flyerQuery = query(
        storeFlyersCollection,
        where('storeId', 'in', storeIds),
      );
    } else {
      // ✅ Categories selected → Filter flyers by categories
      const selectedCategoryNames = selectedCategories.map(cat => cat.name);
      console.log('🔍 Selected Category Names:', selectedCategoryNames);

      flyerQuery = query(
        storeFlyersCollection,
        where('storeId', 'in', storeIds),
        where('categoryId', 'in', selectedCategoryNames), // Filtering by selected category names
      );
    }

    const flyerSnapshot = await getDocs(flyerQuery);

    if (flyerSnapshot.empty) {
      console.warn(
        '⚠️ No store flyers found for the given store IDs and selected categories.',
      );
      return [];
    }

    console.log(`📃 Found ${flyerSnapshot.size} store flyers.`);

    // Map flyers and include the store image, name, and QR code
    const flyers = flyerSnapshot.docs.map(flyerDoc => {
      const flyer = flyerDoc.data() as StoreFlyer;
      const store = storeData[flyer.storeId] || {};
      return {
        ...flyer,
        id: flyerDoc.id,
        storeImage: store.image || null,
        storeName: store.name || '',
        storeQrCode: store.qrCode || null, // Ensure qrCode is handled safely
      };
    });

    console.log('🚀 Store Flyers with store images and QR codes:', flyers);
    return flyers;
  } catch (error) {
    console.error('❌ Error fetching store flyers with store image:', error);
    return [];
  }
}
