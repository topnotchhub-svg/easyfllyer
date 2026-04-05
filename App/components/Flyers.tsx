// app/components/Flyers.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FlyerItem from '../../utils/FlyerItem';
import { fetchFlyersByPostalCodeWithBrandImage, Flyer } from '../../actions/flyer/fetch-flyer';
import { toggleBrandFlyer, setBrandFlyers } from '../../store/slices/brandSlice';
import { RootState } from '../../store/store';
import {  addFavoriteToFirebase,  removeFavoriteFromFirebase,  getUserFavorites  } from '../../lib/favoritesService';

const FlyersComponent = ({ userData, navigation }: any) => { 
  const dispatch = useDispatch();
  const brandFlyers = useSelector((state: RootState) => state.brandFlyers);
  const selectedCategories = useSelector(
    (state: RootState) => state.categories,
  );
  
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Load favorites from Firebase on component mount
  useEffect(() => {
    const loadFavoritesFromFirebase = async () => {
      if (!userData?.userId) {
        return;
      }
      
      setSyncing(true);
      try {
        const firebaseFavorites = await getUserFavorites(userData.userId);
        dispatch(setBrandFlyers(firebaseFavorites));
      } catch (error) {
        console.error('Error loading favorites from Firebase:', error);
      } finally {
        setSyncing(false);
      }
    };
    
    loadFavoritesFromFirebase();
  }, [userData?.userId, dispatch]);

  const fetchFlyers = useCallback(async () => {
    setLoading(true);
    try {
      const allFlyers = await fetchFlyersByPostalCodeWithBrandImage(
        userData?.postalCode,
        selectedCategories,
      );
      setFlyers(allFlyers);
    } catch (error) {
      console.error('Error fetching flyers:', error);
    } finally {
      setLoading(false);
    }
  }, [userData?.postalCode, selectedCategories]);

  useEffect(() => {
    fetchFlyers();
  }, [fetchFlyers]);

  const toggleFavorite = useCallback(
    async (flyer: Flyer) => {
      if (!flyer || !flyer.id || !flyer.title) {
        console.error('Invalid flyer:', flyer);
        return;
      }
      
      const flyerData = {
        id: flyer.id,
        name: flyer.title,
        type: 'flyer',
        image: flyer.image || '',
      };
      
      const isCurrentlyFavorite = brandFlyers.some((f: any) => f.id === flyer.id);
      
      // Update Redux immediately for UI feedback
      dispatch(toggleBrandFlyer(flyerData));
      
      // Sync with Firebase
      try {
        if (isCurrentlyFavorite) {
          const success = await removeFavoriteFromFirebase(userData?.userId, flyerData);
          if (!success) {
            console.error('Failed to remove from Firebase, reverting...');
            dispatch(toggleBrandFlyer(flyerData)); 
          } else {
            
          }
        } else {
          const success = await addFavoriteToFirebase(
            userData?.userId,
            flyerData,
            userData?.fcmToken || '',
          );
          if (!success) {
            console.error('Failed to save to Firebase, reverting...');
            dispatch(toggleBrandFlyer(flyerData)); 
          } else {
            
          }
        }
      } catch (error) {
        console.error('Firebase sync error:', error);
        dispatch(toggleBrandFlyer(flyerData));
      }
    },
    [dispatch, brandFlyers, userData],
  );

  const renderFlyer = ({ item }: { item: Flyer }) => {
    const isFavorite = brandFlyers.some((flyer: any) => flyer.id === item.id);
  
    return (
      <FlyerItem
        item={item}
        navigation={navigation}
        isFavorite={isFavorite}
        toggleFavorite={() => toggleFavorite(item)}
      />
    );
  };

  if (loading || syncing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C6EF5" />
        {syncing && <Text style={styles.syncingText}>Syncing favorites...</Text>}
      </View>
    );
  }

  if (flyers.length === 0) {
    return (
      <View style={styles.noFlyersContainer}>
        <Text style={styles.noFlyersText}>
          No flyers available for this location.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={flyers}
      keyExtractor={item => item.id}
      renderItem={renderFlyer}
      contentContainerStyle={styles.flyerList}
      ListEmptyComponent={
        flyers.length === 0 ? (
          <Text style={styles.emptyText}>No flyers found</Text>
        ) : null
      }
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncingText: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
  noFlyersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFlyersText: {
    fontSize: 16,
    color: '#777',
  },
  flyerList: {
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
});

export default FlyersComponent;