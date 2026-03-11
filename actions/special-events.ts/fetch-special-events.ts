// import {collection, getDocs} from 'firebase/firestore';
// import {db} from '../../lib/firebase';

// // Define the SpecialEvent interface
// export interface SpecialEvent {
//   id: string;
//   name: string;
//   description: string;
//   brandId: string;
//   image: string | null;
//   startDate: string;
//   endDate: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // Fetch all special events
// export async function fetchSpecialEvents(): Promise<SpecialEvent[]> {
//   try {
//     // Reference the "specialEvents" collection
//     const eventsCollection = collection(db, 'specialEvents');

//     // Get all documents from the collection
//     const querySnapshot = await getDocs(eventsCollection);

//     // Map the documents into an array of special events
//     const events = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     })) as SpecialEvent[];

//     return events;
//   } catch (error) {
//     console.error('Error fetching special events:', error);
//     return [];
//   }
// }

////////////////////////////////////////////////////////////////////////////////

import {collection, getDocs, doc, getDoc} from 'firebase/firestore';
import {db} from '../../lib/firebase';

// Define the SpecialEvent interface
export interface SpecialEvent {
  id: string;
  name: string;
  description: string;
  brandId?: string;
  storeId?: string;
  image: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  brand?: Record<string, any>; // Optional brand data
  store?: Record<string, any>; // Optional store data
}

// Function to fetch a specific document from Firestore
async function fetchDataById(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
  } catch (error) {
    console.error(`Error fetching ${collectionName} with ID ${id}:`, error);
    return null;
  }
}

// Fetch all special events with optional brand/store data
export async function fetchSpecialEvents(): Promise<SpecialEvent[]> {
  try {
    const eventsCollection = collection(db, 'specialEvents');
    const querySnapshot = await getDocs(eventsCollection);

    const events = await Promise.all(
      querySnapshot.docs.map(async docSnap => {
        const event = {id: docSnap.id, ...docSnap.data()} as SpecialEvent;

        if (event.brandId) {
          // @ts-expect-error ignore
          event.brand = await fetchDataById('brands', event.brandId);
        }

        if (event.storeId) {
          // @ts-expect-error ignore
          event.store = await fetchDataById('stores', event.storeId);
        }

        return event;
      }),
    );
    // console.log('🚀 ~ fetchSpecialEvents ~ events:', events[0]);

    return events;
  } catch (error) {
    console.error('Error fetching special events:', error);
    return [];
  }
}
