// import {collection, getDocs, query, where} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// export interface Flyer {
//   id: string;
//   title: string;
//   description: string;
//   image: string | null;
//   brandId: string;
//   storeId?: string; // Adjusted to match the provided structure
//   validFrom: string; // Start date of the flyer
//   validTo: string; // End date of the flyer
// }

// // Fetch flyers by postal code
// export async function fetchFlyersByPostalCode(
//   postalCode: string,
// ): Promise<Flyer[]> {
//   try {
//     if (!postalCode) {
//       throw new Error('Postal code is required.');
//     }

//     // Step 1: Fetch brand(s) associated with the postal code
//     const brandsCollection = collection(db, 'brands');
//     const brandQuery = query(
//       brandsCollection,
//       where('postalCode', '==', postalCode),
//     );
//     const brandSnapshot = await getDocs(brandQuery);

//     if (brandSnapshot.empty) {
//       console.warn('No brands found for the given postal code.');
//       return [];
//     }

//     // Collect brand IDs
//     const brandIds = brandSnapshot.docs.map(doc => doc.id);
//     console.log('🚀 ~ brandIds:', brandIds);

//     // Step 2: Fetch flyers associated with the retrieved brand IDs
//     const flyersCollection = collection(db, 'flyers');

//     const flyerQuery = query(
//       flyersCollection,
//       where('brandId', 'in', brandIds),
//     );
//     const flyerSnapshot = await getDocs(flyerQuery);

//     if (flyerSnapshot.empty) {
//       console.warn('No flyers found for the given brand IDs.');
//       return [];
//     }

//     // Map the documents into an array of flyers
//     const flyers = flyerSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as Flyer[];

//     console.log('🚀 ~ flyers:', flyers);

//     // Return the fetched flyers
//     return flyers;
//   } catch (error) {
//     console.error('Error fetching flyers by postal code:', error);
//     return [];
//   }
// }

/////////////////////////////////////////////////////////////////////////////////

// import {collection, getDocs, query, where} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// export interface Flyer {
//   id: string;
//   title: string;
//   description: string;
//   image: string | null;
//   brandId: string;
//   storeId?: string; // Adjusted to match the provided structure
//   validFrom: string; // Start date of the flyer
//   validTo: string; // End date of the flyer
//   brandImage?: string | null; // Updated to allow null values
// }

// // Fetch flyers by postal code with brand images
// export async function fetchFlyersByPostalCodeWithBrandImage(
//   postalCode: string,
//   selectedCategories: any,
// ): Promise<Flyer[]> {
//   try {
//     if (!postalCode) {
//       throw new Error('Postal code is required.');
//     }

//     // Step 1: Fetch brands associated with the postal code
//     const brandsCollection = collection(db, 'brands');
//     const brandQuery = query(
//       brandsCollection,
//       where('postalCode', '==', postalCode),
//     );
//     const brandSnapshot = await getDocs(brandQuery);

//     if (brandSnapshot.empty) {
//       console.warn('No brands found for the given postal code.');
//       return [];
//     }

//     // Map brand data to a dictionary for quick access
//     const brandData = brandSnapshot.docs.reduce((acc, doc) => {
//       acc[doc.id] = {
//         id: doc.id,
//         image: doc.data().image || null,
//         name: doc.data().name || null,
//       };
//       return acc;
//     }, {} as Record<string, {id: string; image: string | null; name: string}>);

//     const brandIds = Object.keys(brandData);
//     console.log('🚀 ~ brandIds:', brandIds);

//     // Step 2: Fetch flyers associated with the retrieved brand IDs

//     // fetch brands on basis of postal code and category ,
//     const flyersCollection = collection(db, 'flyers');
//     const flyerQuery = query(
//       flyersCollection,
//       where('brandId', 'in', brandIds),
//     );
//     const flyerSnapshot = await getDocs(flyerQuery);

//     if (flyerSnapshot.empty) {
//       console.warn('No flyers found for the given brand IDs.');
//       return [];
//     }

//     // Map flyers and include the brand image
//     const flyers = flyerSnapshot.docs.map(doc => {
//       const flyerData = doc.data() as Flyer;
//       const brand = brandData[flyerData.brandId] || {};
//       return {
//         ...flyerData,
//         id: doc.id,
//         brandImage: brand.image || null, // Include the brand image
//         brandName: brand.name || '',
//       };
//     });

//     // console.log('🚀 ~ flyers with brand images:', flyers);

//     return flyers;
//   } catch (error) {
//     console.error('Error fetching flyers by postal code:', error);
//     return [];
//   }
// }

//////////////////////////////////////////////////////////////////////////

// Working Code ---------------------- >

// import {collection, getDocs, query, where} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// export interface Flyer {
//   id: string;
//   title: string;
//   description: string;
//   image: string | null;
//   brandId: string;
//   storeId?: string;
//   validFrom: string;
//   validTo: string;
//   brandImage?: string | null;
//   brandName?: string;
// }

// // Fetch flyers by postal code with brand images and selected categories
// export async function fetchFlyersByPostalCodeWithBrandImage(
//   postalCode: string,
//   selectedCategories: {name: string}[], // Selected categories now in array of objects
// ): Promise<Flyer[]> {
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
//     console.log('🚀 ~ Selected Categories:', selectedCategoryNames);

//     // Step 1: Fetch brands associated with the postal code
//     const brandsCollection = collection(db, 'brands');
//     const brandQuery = query(
//       brandsCollection,
//       where('postalCode', '==', postalCode),
//     );
//     const brandSnapshot = await getDocs(brandQuery);

//     if (brandSnapshot.empty) {
//       console.warn('No brands found for the given postal code.');
//       return [];
//     }

//     // Map brand data to a dictionary for quick access
//     const brandData = brandSnapshot.docs.reduce((acc, doc) => {
//       acc[doc.id] = {
//         id: doc.id,
//         image: doc.data().image || null,
//         name: doc.data().name || null,
//       };
//       return acc;
//     }, {} as Record<string, {id: string; image: string | null; name: string}>);

//     const brandIds = Object.keys(brandData);
//     console.log('🚀 ~ Brand IDs:', brandIds);

//     if (brandIds.length === 0) {
//       console.warn('No valid brand IDs found.');
//       return [];
//     }

//     // Step 2: Fetch flyers associated with the retrieved brand IDs and selected categories
//     const flyersCollection = collection(db, 'flyers');
//     const flyerQuery = query(
//       flyersCollection,
//       where('brandId', 'in', brandIds),
//       where('categoryId', 'in', selectedCategoryNames), // Filtering by selected category names
//     );
//     const flyerSnapshot = await getDocs(flyerQuery);

//     if (flyerSnapshot.empty) {
//       console.warn(
//         'No flyers found for the given brand IDs and selected categories.',
//       );
//       return [];
//     }

//     // Map flyers and include the brand image and name
//     const flyers = flyerSnapshot.docs.map(doc => {
//       const flyerData = doc.data() as Flyer;
//       const brand = brandData[flyerData.brandId] || {};
//       return {
//         ...flyerData,
//         id: doc.id,
//         brandImage: brand.image || null,
//         brandName: brand.name || '',
//       };
//     });

//     console.log('🚀 ~ Flyers with brand images:', flyers);
//     return flyers;
//   } catch (error) {
//     console.error('Error fetching flyers by postal code:', error);
//     return [];
//   }
// }

///////////////////////////////////////////////////////////////////////////////

//////////////// WORKING CODE ////////////////////////////////

// import {collection, getDocs, query, where} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// export interface Flyer {
//   id: string;
//   title: string;
//   description: string;
//   image: string | null;
//   brandId: string;
//   storeId?: string;
//   validFrom: string;
//   validTo: string;
//   brandImage?: string | null;
//   brandName?: string;
//   brandQrCode?: string | null; // Added brand QR code field
// }

// // Fetch flyers by postal code with brand images and selected categories
// export async function fetchFlyersByPostalCodeWithBrandImage(
//   postalCode: string,
//   selectedCategories: {name: string}[], // Selected categories now in array of objects
// ): Promise<Flyer[]> {
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
//     console.log('🚀 ~ Selected Categories:', selectedCategoryNames);

//     // Step 1: Fetch brands associated with the postal code
//     const brandsCollection = collection(db, 'brands');
//     const brandQuery = query(
//       brandsCollection,
//       where('postalCode', '==', postalCode),
//     );
//     const brandSnapshot = await getDocs(brandQuery);

//     if (brandSnapshot.empty) {
//       console.warn('No brands found for the given postal code.');
//       return [];
//     }

//     // Map brand data to a dictionary for quick access, including qrCode
//     const brandData = brandSnapshot.docs.reduce((acc, doc) => {
//       acc[doc.id] = {
//         id: doc.id,
//         image: doc.data().image || null,
//         name: doc.data().name || null,
//         qrCode: doc.data().qrCode || null, // Added qrCode from brand
//       };
//       return acc;
//     }, {} as Record<string, {id: string; image: string | null; name: string; qrCode: string | null}>);

//     const brandIds = Object.keys(brandData);
//     console.log('🚀 ~ Brand IDs:', brandIds);

//     if (brandIds.length === 0) {
//       console.warn('No valid brand IDs found.');
//       return [];
//     }

//     // Step 2: Fetch flyers associated with the retrieved brand IDs and selected categories
//     const flyersCollection = collection(db, 'flyers');
//     const flyerQuery = query(
//       flyersCollection,
//       where('brandId', 'in', brandIds),
//       where('categoryId', 'in', selectedCategoryNames), // Filtering by selected category names
//     );
//     const flyerSnapshot = await getDocs(flyerQuery);

//     if (flyerSnapshot.empty) {
//       console.warn(
//         'No flyers found for the given brand IDs and selected categories.',
//       );
//       return [];
//     }

//     // Map flyers and include the brand image, name, and QR code
//     const flyers = flyerSnapshot.docs.map(doc => {
//       const flyerData = doc.data() as Flyer;
//       const brand = brandData[flyerData.brandId] || {};
//       return {
//         ...flyerData,
//         id: doc.id,
//         brandImage: brand.image || null,
//         brandName: brand.name || '',
//         brandQrCode: brand.qrCode || null, // Include brand QR code
//       };
//     });

//     console.log('🚀 ~ Flyers with brand images and QR codes:', flyers);
//     return flyers;
//   } catch (error) {
//     console.error('Error fetching flyers by postal code:', error);
//     return [];
//   }
// }

///////////////////////////////////////////////////////////////////////////////
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
  brandQrCode?: string | null; // Added brand QR code field
}

// Fetch flyers by postal code with brand images and selected categories
export async function fetchFlyersByPostalCodeWithBrandImage(
  postalCode: string,
  selectedCategories: {name: string}[], // Selected categories now in an array of objects
): Promise<Flyer[]> {
  try {
    if (!postalCode) {
      throw new Error('Postal code is required.');
    }

    // Step 1: Fetch brands associated with the postal code
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

    // Map brand data to a dictionary for quick access, including qrCode
    const brandData = brandSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = {
        id: doc.id,
        image: doc.data().image || null,
        name: doc.data().name || null,
        qrCode: doc.data().qrCode || null, // Added qrCode from brand
      };
      return acc;
    }, {} as Record<string, {id: string; image: string | null; name: string; qrCode: string | null}>);

    const brandIds = Object.keys(brandData);
    console.log('🚀 ~ Brand IDs:', brandIds);

    if (brandIds.length === 0) {
      console.warn('No valid brand IDs found.');
      return [];
    }

    // Step 2: Fetch flyers associated with the retrieved brand IDs
    const flyersCollection = collection(db, 'flyers');

    let flyerQuery;
    if (!selectedCategories || selectedCategories.length === 0) {
      // ✅ No categories selected → Fetch all flyers for the brands
      console.warn('No selected categories provided. Fetching all flyers.');
      flyerQuery = query(flyersCollection, where('brandId', 'in', brandIds));
    } else {
      // ✅ Categories selected → Filter flyers by categories
      const selectedCategoryNames = selectedCategories.map(cat => cat.name);
      console.log('🚀 ~ Selected Categories:', selectedCategoryNames);

      flyerQuery = query(
        flyersCollection,
        where('brandId', 'in', brandIds),
        where('categoryId', 'in', selectedCategoryNames), // Filtering by selected category names
      );
    }

    const flyerSnapshot = await getDocs(flyerQuery);

    if (flyerSnapshot.empty) {
      console.warn(
        'No flyers found for the given brand IDs and selected categories.',
      );
      return [];
    }

    // Map flyers and include the brand image, name, and QR code
    const flyers = flyerSnapshot.docs.map(doc => {
      const flyerData = doc.data() as Flyer;
      const brand = brandData[flyerData.brandId] || {};
      return {
        ...flyerData,
        id: doc.id,
        brandImage: brand.image || null,
        brandName: brand.name || '',
        brandQrCode: brand.qrCode || null, // Include brand QR code
      };
    });

    console.log('🚀 ~ Flyers with brand images and QR codes:', flyers);
    return flyers;
  } catch (error) {
    console.error('Error fetching flyers by postal code:', error);
    return [];
  }
}
