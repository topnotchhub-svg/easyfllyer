import {collection, getDocs} from 'firebase/firestore';
import {db} from '../../lib/firebase';

export interface CouponGift {
  id: string;
  brandId: string;
  name: string;
  code: string;
  discount: string;
  image: string | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
}

// Fetch All Coupon Gifts
export async function fetchAllCouponGifts(): Promise<CouponGift[]> {
  try {
    // Reference to the "couponGifts" collection
    const couponGiftsCollection = collection(db, 'couponGifts');

    // Get all documents from the collection
    const querySnapshot = await getDocs(couponGiftsCollection);

    if (querySnapshot.empty) {
      console.warn('No coupon gifts found.');
      return [];
    }

    // Map the documents into an array of CouponGift
    const couponGifts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CouponGift[];

    console.log('Fetched All Coupon Gifts:', couponGifts);

    return couponGifts;
  } catch (error) {
    console.error('Error fetching all coupon gifts:', error);
    return [];
  }
}
