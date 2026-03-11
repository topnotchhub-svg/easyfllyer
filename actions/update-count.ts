// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   setDoc,
//   updateDoc,
//   where,
//   increment,
// } from 'firebase/firestore';
// import {db} from '../lib/firebase';

// interface UpdateCountViewProps {
//   scannedValue: string;
// }

// export async function UpdateCountView({scannedValue}: UpdateCountViewProps) {
//   // if we have value then will increment count view in brands and stores collection in firebase , we will add the count view field for it ,

//   // first of all ,we check where the scanned value is present in brands or stores collection and the scanned value is in name field , wheather its in brands or stores , if it is present then we will increment the count view field for it , if it is not present then we will not do anything

//   // first we will check in brands collection
//   try {
//     // Validate scanned value
//     if (!scannedValue) {
//       return {error: 'Scanned Value is required'};
//     }

//     // Helper function to update count view in a collection
//     const updateCountView = async (collectionName: string, value: string) => {
//       const collectionRef = collection(db, collectionName);
//       const q = query(collectionRef, where('name', '==', value)); // Assuming scannedValue is stored in 'name' field

//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         return {
//           error: `No item found with the scanned value in ${collectionName}`,
//         };
//       }

//       const docRef = doc(db, collectionName, querySnapshot.docs[0].id);

//       // Check if countView field exists
//       const docSnapshot = await getDoc(docRef);
//       if (docSnapshot.exists() && docSnapshot.data()?.countView !== undefined) {
//         // Increment the countView field if it exists
//         await updateDoc(docRef, {
//           countView: increment(1), // Increment the countView field
//         });
//         return {success: `Count view incremented in ${collectionName}`};
//       } else {
//         // Create countView field and increment it if it doesn't exist
//         await setDoc(
//           docRef,
//           {
//             countView: 1, // Initialize countView with 1 if it doesn't exist
//           },
//           {merge: true},
//         );

//         return {
//           success: `Count view field created and set to 1 in ${collectionName}`,
//         };
//       }
//     };

//     // Check in brands collection
//     let result = await updateCountView('brands', scannedValue);
//     if (result.error) {
//       // If no match in brands, check in stores collection
//       result = await updateCountView('stores', scannedValue);
//     }

//     return result;
//   } catch (error) {
//     console.error('Error updating count view:', error);
//     return {error: 'An error occurred while updating the count view'};
//   }
// }

///////////////////////////////////////////////////////////////////////   Working Code ////////////////////////////////////////////

// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   setDoc,
//   updateDoc,
//   where,
//   increment,
// } from 'firebase/firestore';
// import {db} from '../lib/firebase';

// interface UpdateCountViewProps {
//   scannedValue: string;
// }

// export async function UpdateCountView({scannedValue}: UpdateCountViewProps) {
//   // Validate scanned value
//   if (!scannedValue) {
//     return {error: 'Scanned Value is required'};
//   }

//   try {
//     // Helper function to check if countView field exists, then increment or create it
//     const updateCountView = async (collectionName: string, value: string) => {
//       const collectionRef = collection(db, collectionName);
//       const q = query(collectionRef, where('name', '==', value)); // Assuming scannedValue is stored in 'name' field

//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         return {
//           error: `No item found with the scanned value in ${collectionName}`,
//         };
//       }

//       const docRef = doc(db, collectionName, querySnapshot.docs[0].id);
//       const docSnapshot = await getDoc(docRef);

//       // Check if countView field exists
//       if (docSnapshot.exists() && docSnapshot.data()?.countView !== undefined) {
//         // Increment the countView field if it exists
//         await updateDoc(docRef, {
//           countView: increment(1), // Increment the countView field
//         });
//         return {success: `Count view incremented in ${collectionName}`};
//       } else {
//         // Create countView field and increment it if it doesn't exist
//         await setDoc(docRef, {countView: 1}, {merge: true});
//         return {
//           success: `Count view field created and set to 1 in ${collectionName}`,
//         };
//       }
//     };

//     // First, check in the brands collection
//     let result = await updateCountView('brands', scannedValue);

//     if (result.error) {
//       // If no match in brands, check in stores collection
//       result = await updateCountView('stores', scannedValue);
//     }

//     return result;
//   } catch (error) {
//     console.error('Error updating count view:', error);
//     return {error: 'An error occurred while updating the count view'};
//   }
// }

///////////////////////////////////////// new Code /////////////////////////////////////////////////////////////////////////

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  increment,
  addDoc,
} from 'firebase/firestore';
import {db} from '../lib/firebase';

interface UpdateCountViewProps {
  scannedValue: string;
  userId: string;
  postalCode: string;
}

export async function UpdateCountView({
  scannedValue,
  userId,
  postalCode,
}: UpdateCountViewProps) {
  if (!scannedValue) {
    return {error: 'Scanned Value is required'};
  }

  try {
    // Function to update count and store user scan history
    const updateScannedData = async (collectionName: string, value: string) => {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where('name', '==', value));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          error: `No item found with the scanned value in ${collectionName}`,
        };
      }

      const docRef = doc(db, collectionName, querySnapshot.docs[0].id);
      const docSnapshot = await getDoc(docRef);

      const scannedAt = new Date().toISOString(); // Current timestamp

      // ✅ Step 1: Update Count
      if (docSnapshot.exists()) {
        await updateDoc(docRef, {
          countView: increment(1), // Maintain original count logic
        });
      } else {
        await setDoc(docRef, {countView: 1}, {merge: true});
      }

      // ✅ Step 2: Store Scan Data in `scanHistory` Sub-Collection
      const scanHistoryRef = collection(docRef, 'scanHistory');
      await addDoc(scanHistoryRef, {
        userId,
        postalCode,
        scannedAt,
      });

      return {success: `Scan data recorded in ${collectionName}`};
    };

    let result = await updateScannedData('brands', scannedValue);

    if (result.error) {
      result = await updateScannedData('stores', scannedValue);
    }

    return result;
  } catch (error) {
    console.error('Error updating scan data:', error);
    return {error: 'An error occurred while updating the scan data'};
  }
}
