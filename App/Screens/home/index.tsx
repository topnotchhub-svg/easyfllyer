// import React, {useContext, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Pressable,
//   Image,
// } from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {fetchEntitiesByPostalCode} from '../../../actions/brand/fetch-brands';
// import {toggleFavorite} from '../../../store/slices/favoritesSlice';
// import {AuthContext} from '../../../lib/AuthContext';

// const HomeScreen = ({navigation}: any) => {
//   const {userData} = useContext(AuthContext);
//   const [stores, setStores] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();
//   const favorites = useSelector((state: any) => state.favorites);

//   // const data = await fetchAllBrands(); // Fetch all brands from API
//   useEffect(() => {
//     const loadStores = async () => {
//       try {
//         setLoading(true);

//         // Fetch brands based on postal code
//         const result = await fetchEntitiesByPostalCode(userData?.postalCode);

//         if (result.success) {
//           // @ts-expect-error ignore
//           setStores(result.entities || []); // Set the brands if available
//         } else {
//           console.error('Error fetching brands:', result.message);
//         }
//       } catch (error) {
//         console.error('Error fetching stores:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadStores();
//   }, [userData?.postalCode]);
//   // @ts-expect-error ignore
//   const handleToggleFavorite = brand => {
//     dispatch(toggleFavorite(brand)); // Toggle favorite in Redux
//     // dispatch(toggleFavorite({favorite: brand, userId: userData?.userId})); // Toggle favorite in Redux
//   };

//   const filteredStores = stores.filter(store =>
//     // @ts-expect-error ignore
//     store.name.toLowerCase().includes(searchQuery.toLowerCase()),
//   );
//   // @ts-expect-error ignore
//   const renderStoreItem = ({item}) => {
//     // Debugging logic for `isFavorite`
//     // @ts-expect-error ignore
//     const isFavorite = favorites.some(fav => fav.id === item.id);
//     // console.log(`Is ${item.name} favorite?`, isFavorite);

//     return (
//       <Pressable
//         style={[styles.storeItem, isFavorite && styles.favoriteItem]}
//         onPress={() => handleToggleFavorite(item)}>
//         <Image
//           source={{uri: item?.image || 'https://via.placeholder.com/100'}}
//           style={styles.storeIcon}
//           resizeMode="cover"
//         />
//         <Text style={styles.storeName} numberOfLines={1}>
//           {item.name}
//         </Text>
//       </Pressable>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>
//         {filteredStores.length} Brands found near you!
//       </Text>
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search for a store"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         placeholderTextColor={'#000'}
//       />
//       {loading ? (
//         <ActivityIndicator size="large" color="#4C6EF5" />
//       ) : (
//         <FlatList
//           data={filteredStores}
//           numColumns={2}
//           keyExtractor={item => item.id}
//           renderItem={renderStoreItem}
//           contentContainerStyle={styles.storeList}
//         />
//       )}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('categories')}
//           style={styles.nextButton}>
//           <Text style={styles.nextButtonText}>Next (1/2)</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('categories')}>
//           <Text style={styles.skipText}>Skip this step</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     position: 'relative',
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   searchBar: {
//     height: 50,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#f5f5f5',
//     marginBottom: 20,
//   },
//   storeList: {paddingHorizontal: 5},
//   storeItem: {
//     flex: 1,
//     margin: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 10,
//     alignItems: 'center',
//     paddingVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   favoriteItem: {
//     borderWidth: 2,
//     borderColor: '#4C6EF5',
//   },
//   storeIcon: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#ddd',
//     marginBottom: 10,
//   },
//   storeName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },
//   footer: {
//     marginTop: 20,
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     right: 10,
//   },
//   nextButton: {
//     backgroundColor: '#4C6EF5',
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     width: '100%',
//     marginBottom: 10,
//   },
//   nextButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
//   skipText: {color: '#4C6EF5', fontSize: 14, textAlign: 'center'},
// });

// export default HomeScreen;

//////////////////////////////////////////////////////////////////////

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { fetchEntitiesByPostalCode } from '../../../actions/brand/fetch-brands';
import { toggleFavorite } from '../../../store/slices/favoritesSlice';
import { AuthContext } from '../../../lib/AuthContext';

type Brand = {
  id: string;
  name: string;
  image?: string | null;
};

const FALLBACK_IMG = 'https://via.placeholder.com/100';

const HomeScreen = ({ navigation }: any) => {
  const { userData } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const favorites: Brand[] = useSelector((state: any) => state.favorites);

  const [stores, setStores] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search to avoid re-filtering on every keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => setDebouncedQuery(searchQuery.trim()),
      180,
    );
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // Load stores by postal code
  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true);
        setErrorText(null);
        const result = await fetchEntitiesByPostalCode(userData?.postalCode);
        if (result?.success) {
          setStores((result.entities || []) as Brand[]);
        } else {
          setStores([]);
          setErrorText(result?.message || 'Failed to fetch brands.');
        }
      } catch (e) {
        setStores([]);
        setErrorText('Something went wrong while fetching brands.');
      } finally {
        setLoading(false);
      }
    };
    if (userData?.postalCode) loadStores();
  }, [userData?.postalCode]);

  const handleToggleFavorite = useCallback(
    (brand: Brand) => {
      dispatch(toggleFavorite(brand));
    },
    [dispatch],
  );

  const filteredStores = useMemo(() => {
    if (!debouncedQuery) return stores;
    const q = debouncedQuery.toLowerCase();
    return stores.filter(s => s.name?.toLowerCase().includes(q));
  }, [stores, debouncedQuery]);

  const isFavorite = useCallback(
    (id: string) => favorites?.some(f => f.id === id),
    [favorites],
  );

  const renderStoreItem = useCallback(
    ({ item }: { item: Brand }) => {
      const fav = isFavorite(item.id);
      return (
        <Pressable
          onPress={() => handleToggleFavorite(item)}
          android_ripple={{ color: '#E6EDFF' }}
          style={[styles.card, fav && styles.cardSelected]}
        >
          <Image
            source={{ uri: item?.image || FALLBACK_IMG }}
            style={styles.avatar}
          />
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
        </Pressable>
      );
    },
    [handleToggleFavorite, isFavorite],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeTop}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.headerText}>
          {loading ? '' : `${filteredStores.length} Brands found near you!`}
        </Text>

        {/* Search */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a store"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8A8A8A"
          returnKeyType="search"
        />

        {/* List / Loading / Empty */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4C6EF5"
            style={{ marginTop: 16 }}
          />
        ) : errorText ? (
          <Text style={styles.errorText}>{errorText}</Text>
        ) : (
          <FlatList
            data={filteredStores}
            numColumns={2}
            keyExtractor={item => item.id}
            renderItem={renderStoreItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No brands found
                {debouncedQuery ? ` for “${debouncedQuery}”` : ''}.
              </Text>
            }
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>

      {/* Footer CTA – padded for home indicator or 3-button nav */}
      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.footerSafe,
          { paddingBottom: Math.max(insets.bottom, 10) },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('categories')}
          style={styles.nextButton}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>Next (1/2)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('categories')}>
          <Text style={styles.skipText}>Skip this step</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const CARD_RADIUS = 12;

const styles = StyleSheet.create({
  safeTop: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#0B0F15',
  },
  searchBar: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: CARD_RADIUS,
    alignItems: 'center',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ECEFF3',
  },
  cardSelected: {
    borderColor: '#4C6EF5',
    shadowOpacity: 0.12,
    elevation: 3,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5E7EB',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2F36',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 32,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#B91C1C',
    marginTop: 16,
    fontSize: 14,
  },
  footerSafe: {
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#4C6EF5',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: '100%',
    marginBottom: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipText: {
    color: '#4C6EF5',
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 2,
  },
});

export default HomeScreen;
