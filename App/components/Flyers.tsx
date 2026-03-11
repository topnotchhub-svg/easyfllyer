import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import FlyerItem from '../../utils/FlyerItem';
import {
  fetchFlyersByPostalCodeWithBrandImage,
  Flyer,
} from '../../actions/flyer/fetch-flyer';
import {toggleBrandFlyer} from '../../store/slices/brandSlice';
import {RootState} from '../../store/store';

const FlyersComponent = ({userData, mediaLink, navigation}: any) => {
  const dispatch = useDispatch();

  // Select brandFlyers from Redux state
  const brandFlyers = useSelector((state: RootState) => state.brandFlyers);
  const selectedCategories = useSelector(
    (state: RootState) => state.categories,
  );
  //console.log('🚀 ~ FlyersComponent ~ selectedCategories:', selectedCategories);

  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch flyers from Firestore
  const fetchFlyers = useCallback(async () => {
    setLoading(true);
    try {
      const allFlyers = await fetchFlyersByPostalCodeWithBrandImage(
        userData?.postalCode,
        selectedCategories,
      );
      // console.log('Fetched Flyers:', allFlyers);
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

  // Toggle favorite flyer using Redux
  const toggleFavorite = useCallback(
    (flyer: Flyer) => {
      if (!flyer || !flyer.id || !flyer.title) {
        console.error('Invalid flyer:', flyer);
        return;
      }
      const flyerData = {id: flyer.id, name: flyer.title};
      console.log('🚀 Toggling Favorite Flyer:', flyerData);
      dispatch(toggleBrandFlyer(flyerData));
    },
    [dispatch],
  );

  // Render flyer item
  const renderFlyer = ({item}: {item: Flyer}) => {
    const isFavorite = brandFlyers.some((flyer: any) => flyer.id === item.id);
    // console.log(`Flyer ${item.id} isFavorite:`, isFavorite);

    return (
      <FlyerItem
        item={item}
        // @ts-expect-error ignore
        mediaLink={mediaLink}
        navigation={navigation}
        isFavorite={isFavorite}
        toggleFavorite={() => toggleFavorite(item)}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C6EF5" />
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
