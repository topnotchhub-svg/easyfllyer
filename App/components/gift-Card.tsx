// import React, {useEffect, useState} from 'react';
// import {FlatList, StyleSheet, View} from 'react-native';
// import {ActivityIndicator, Text} from 'react-native-paper';
// import {
//   CouponGift,
//   fetchAllCouponGifts,
// } from '../../actions/coupon-gifts/fetch-coupon';
// import {formatDate} from './store-flyers';

// export const GiftCardsComponent = () => {
//   const [giftCards, setGiftCards] = useState<CouponGift[]>([]);
//   const [loadingGiftCards, setLoadingGiftCards] = useState(true);

//   // Fetch coupon gifts
//   useEffect(() => {
//     const loadGiftCards = async () => {
//       try {
//         const coupons = await fetchAllCouponGifts();
//         setGiftCards(coupons);
//       } catch (error) {
//         console.error('Error fetching gift cards:', error);
//       } finally {
//         setLoadingGiftCards(false);
//       }
//     };

//     loadGiftCards();
//   }, []);

//   return loadingGiftCards ? (
//     <ActivityIndicator size="large" color="#4C6EF5" style={styles.loader} />
//   ) : (
//     <FlatList
//       data={giftCards}
//       keyExtractor={item => item.id}
//       renderItem={({item}) => (
//         <View style={styles.dealCard}>
//           {/* Render the image */}
//           {/* <Image
//             source={{uri: item.image}}
//             style={styles.cardImage}
//             resizeMode="cover"
//           /> */}
//           <View style={styles.cardDetails}>
//             <Text style={styles.storeName}>{item.name}</Text>
//             <Text style={styles.validity}>
//               Valid From: {formatDate(item.startDate)} To:{' '}
//               {formatDate(item.endDate)}
//             </Text>
//             <Text style={styles.discount}>Discount: {item.discount}%</Text>
//           </View>
//         </View>
//       )}
//       contentContainerStyle={styles.listContainer}
//       ListEmptyComponent={
//         <Text style={styles.emptyText}>No gift cards found</Text>
//       }
//     />
//   );
// };

// const styles = StyleSheet.create({
//   loader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   listContainer: {
//     paddingHorizontal: 10,
//   },
//   dealCard: {
//     margin: 10,
//     backgroundColor: '#E3F2FD',
//     borderRadius: 10,
//     overflow: 'hidden', // Ensure the image doesn't overflow the card
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   cardImage: {
//     width: '100%',
//     height: 150, // Adjust height as needed
//   },
//   cardDetails: {
//     padding: 10,
//   },
//   storeName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 5,
//   },
//   validity: {
//     fontSize: 14,
//     color: '#555',
//   },
//   discount: {
//     fontSize: 14,
//     color: '#000',
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: '#555',
//     marginTop: 20,
//     fontSize: 16,
//   },
// });

//////////////////////////////////////

import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import {
  CouponGift,
  fetchAllCouponGifts,
} from '../../actions/coupon-gifts/fetch-coupon';
import { fetchBrandById } from '../../actions/brand/fetch-brand-by-id';
import { formatDate } from './store-flyers'; // keep using your existing formatter

// --- helpers ----------------------------------------------------

const toDate = (d: any) => (d instanceof Date ? d : new Date(d));

/** Compact range like:
 *  - Same month+year: "Sep 1–17, 2025"
 *  - Same year, different month: "Sep 28 – Oct 3, 2025"
 *  - Different year: "Dec 28, 2025 — Jan 3, 2026"
 */
const formatDateRange = (start: any, end: any) => {
  const s = toDate(start);
  const e = toDate(end);

  const sDay = s.getDate();
  const eDay = e.getDate();
  const sMonth = s.toLocaleString('en-US', { month: 'short' });
  const eMonth = e.toLocaleString('en-US', { month: 'short' });
  const sYear = s.getFullYear();
  const eYear = e.getFullYear();

  if (sYear === eYear && sMonth === eMonth) {
    return `${sMonth} ${sDay}–${eDay}, ${sYear}`;
  }
  if (sYear === eYear) {
    return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${sYear}`;
  }
  return `${sMonth} ${sDay}, ${sYear} — ${eMonth} ${eDay}, ${eYear}`;
};

type StatusType = 'upcoming' | 'active' | 'expired';
const getStatus = (start: any, end: any): StatusType => {
  const today = new Date();
  const s = toDate(start);
  const e = toDate(end);
  if (today < s) return 'upcoming';
  if (today > e) return 'expired';
  return 'active';
};

const StatusPill = ({ status, date }: { status: StatusType; date: any }) => {
  let label = 'Active';
  let statusStyle = styles.pillActive;

  if (status === 'upcoming') {
    label = `Starts ${formatDate(date)}`;
    statusStyle = styles.pillUpcoming;
  } else if (status === 'expired') {
    label = `Expired ${formatDate(date)}`;
    statusStyle = styles.pillExpired;
  }

  return (
    <View style={[styles.pill, statusStyle]}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
};

// --- component --------------------------------------------------

type GiftCardWithBrand = CouponGift & { brandName?: string };

export const GiftCardsComponent = () => {
  const [giftCards, setGiftCards] = useState<GiftCardWithBrand[]>([]);
  const [loadingGiftCards, setLoadingGiftCards] = useState(true);

  useEffect(() => {
    const loadGiftCards = async () => {
      try {
        const coupons = await fetchAllCouponGifts();

        // Fetch brand names for each coupon
        const couponsWithBrands = await Promise.all(
          (coupons ?? []).map(async coupon => {
            if (coupon.brandId) {
              const brand = await fetchBrandById(coupon.brandId);
              return {
                ...coupon,
                brandName: brand?.name,
              };
            }
            return coupon;
          }),
        );

        setGiftCards(couponsWithBrands);
      } catch (error) {
        console.error('Error fetching gift cards:', error);
      } finally {
        setLoadingGiftCards(false);
      }
    };
    loadGiftCards();
  }, []);

  if (loadingGiftCards) {
    return (
      <ActivityIndicator size="large" color="#4C6EF5" style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={giftCards}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        const status = getStatus(item.startDate, item.endDate);
        const dim = status === 'expired';
        const range = formatDateRange(item.startDate, item.endDate);

        return (
          <View style={[styles.dealCard, dim && { opacity: 0.6 }]}>
            <View style={styles.cardDetails}>
              <View style={styles.rowBetween}>
                <StatusPill
                  status={status}
                  date={status === 'upcoming' ? item.startDate : item.endDate}
                />
              </View>

              {/* Brand Name */}
              {item.brandName && (
                <Text style={styles.infoText}>
                  <Text style={styles.label}>Brand Name: </Text>
                  <Text style={styles.value}>{item.brandName}</Text>
                </Text>
              )}

              {/* Coupon Gift Name */}
              <Text style={styles.infoText}>
                <Text style={styles.label}>Coupon Gift Name: </Text>
                <Text style={styles.value}>{item.name}</Text>
              </Text>

              {/* Validity Period */}
              <Text style={styles.validity}>Valid: {range}</Text>

              {/* Discount */}
              <Text style={styles.discount}>Discount: {item.discount}%</Text>
            </View>
          </View>
        );
      }}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No gift cards found</Text>
      }
    />
  );
};

// --- styles -----------------------------------------------------

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  listContainer: { paddingHorizontal: 10 },
  dealCard: {
    margin: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDetails: { padding: 12 },
  infoText: { fontSize: 14, marginTop: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#4A5568' },
  value: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  validity: { fontSize: 14, color: '#556170', marginTop: 8 },
  discount: { fontSize: 14, color: '#000', fontWeight: 'bold', marginTop: 6 },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },

  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 11,
    color: '#0b2239',
  },
  // ✅ modifiers don’t need the padding again, just backgroundColor
  pillActive: { backgroundColor: '#D6F5E1' },
  pillUpcoming: { backgroundColor: '#E6F0FF' },
  pillExpired: { backgroundColor: '#FFE8E8' },
});
