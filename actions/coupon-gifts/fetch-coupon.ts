import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
  createdAt?: string; // Add this field for sorting
}

// Fetch All Coupon Gifts sorted by latest created first
export async function fetchAllCouponGifts(): Promise<CouponGift[]> {
  try {
    // Reference to the "couponGifts" collection with orderBy
    const couponGiftsCollection = collection(db, 'couponGifts');
    
    // ✅ Query with orderBy to get latest first (descending order)
    const q = query(couponGiftsCollection, orderBy('endDate', 'desc'));
    
    // Get all documents from the collection
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('No coupon gifts found.');
      return [];
    }

    // Map the documents into an array of CouponGift
    const couponGifts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CouponGift[];

    return couponGifts;
  } catch (error) {
    console.error('Error fetching all coupon gifts:', error);
    return [];
  }
}