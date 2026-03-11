// ///////////////////////////////////////////////////////////////////

// import {collection, getDocs, query, where} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// export interface Brand {
//   id: string;
//   name: string;
//   email: string;
//   password?: string;
//   description: string;
//   image: string | null;
//   adminId: string;
//   postalCode: string;
// }

// export async function fetchBrandsByPostalCode(
//   postalCode: string,
// ): Promise<{success: boolean; message: string; brands?: Brand[]}> {
//   try {
//     // Validate the input
//     if (!postalCode) {
//       return {
//         success: false,
//         message: 'Postal code is required to fetch brands.',
//       };
//     }

//     // Reference the "brands" collection with a postal code filter
//     const brandsCollection = collection(db, 'brands');
//     const brandsQuery = query(
//       brandsCollection,
//       where('postalCode', '==', postalCode),
//     );

//     // Execute the query
//     const querySnapshot = await getDocs(brandsQuery);

//     // Map the documents into an array of brands
//     const brands = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as Brand[];

//     return {
//       success: true,
//       message: 'Brands fetched successfully.',
//       brands,
//     };
//   } catch (error) {
//     console.error('Error fetching brands by postal code:', error);
//     return {
//       success: false,
//       message: 'An error occurred while fetching brands.',
//     };
//   }
// }

import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../../lib/firebase';

export interface Entity {
  id: string;
  name: string;
  type: 'brand' | 'store'; // Distinguish between brands and stores
  postalCode: string;
  description?: string; // For brands
  image?: string | null; // For brands and stores
  address?: string; // For stores
  brandId?: string; // For stores
}

export async function fetchEntitiesByPostalCode(
  postalCode: string,
): Promise<{success: boolean; message: string; entities?: Entity[]}> {
  try {
    // Validate the input
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
    );
    const brandsSnapshot = await getDocs(brandsQuery);

    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      type: 'brand', // Mark as a brand
      postalCode: doc.data().postalCode,
      description: doc.data().description,
      image: doc.data().image || null,
    })) as Entity[];

    // Fetch stores
    const storesCollection = collection(db, 'stores');
    const storesQuery = query(
      storesCollection,
      where('postalCode', '==', postalCode),
    );
    const storesSnapshot = await getDocs(storesQuery);

    const stores = storesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      type: 'store', // Mark as a store
      postalCode: doc.data().postalCode,
      address: doc.data().address,
      brandId: doc.data().brandId,
      image: doc.data().image || null,
    })) as Entity[];

    // Combine brands and stores into a single array
    const entities = [...brands, ...stores];

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
