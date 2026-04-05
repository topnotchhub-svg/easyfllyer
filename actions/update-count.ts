
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, increment, addDoc, } from 'firebase/firestore';
import {db} from '../lib/firebase';

interface UpdateCountViewProps {
  scannedValue: string;
  userId: string;
  postalCode: string;
}

export async function UpdateCountView({ scannedValue, userId, postalCode, }: UpdateCountViewProps) {
  if (!scannedValue) {
    return {error: 'Scanned Value is required'};
  }

  try {
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

      const scannedAt = new Date().toISOString(); 

      if (docSnapshot.exists()) {
        await updateDoc(docRef, {
          countView: increment(1), 
        });
      } else {
        await setDoc(docRef, {countView: 1}, {merge: true});
      }

      const scanHistoryRef = collection(docRef, 'scanHistory');
      await addDoc(scanHistoryRef, { userId, postalCode, scannedAt, });
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
