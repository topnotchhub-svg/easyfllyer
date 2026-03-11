import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {fetchStoreFlyersWithStoreImage} from '../../actions/store-flyers/fetch-store-flyers';
import {toggleStoreFlyer} from '../../store/slices/storeSlice';
import {RootState} from '../../store/store';

export const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const StoreFlyersComponent = ({userData, navigation}: any) => {
  const dispatch = useDispatch();
  const [storeFlyers, setStoreFlyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const favorites = useSelector((state: RootState) => state.storeFlyers || []);
  const selectedCategories = useSelector(
    (state: RootState) => state.categories,
  );

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        const flyers = await fetchStoreFlyersWithStoreImage(
          userData?.postalCode,
          selectedCategories,
        );
        // @ts-expect-error ignore
        setStoreFlyers(flyers);
      } catch (error) {
        console.error('Error fetching store flyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlyers();
  }, [userData?.postalCode, selectedCategories]);

  const toggleFavorite = (flyer: any) => {
    dispatch(toggleStoreFlyer(flyer));
  };

  const navigateToFlyerScreen = (item: any) => {
    navigation.navigate('Flyer', {deal: item});
  };

  const renderFlyer = ({item}: any) => {
    const isFavorite = favorites.some((flyer: any) => flyer.id === item.id);

    return (
      <View style={styles.flyerCard}>
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => toggleFavorite(item)}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-o'}
            size={22}
            color={isFavorite ? '#FF0000' : '#888'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigateToFlyerScreen(item)}>
          <Image
            source={{uri: item.image}}
            style={styles.flyerImage}
            resizeMode="cover"
          />
          <View style={styles.flyerInfo}>
            <Image source={{uri: item.storeImage}} style={styles.storeImage} />
            <View style={styles.textInfo}>
              <Text style={styles.storeName}>{item.storeName}</Text>
              <Text style={styles.flyerTitle}>{item.title}</Text>
              <Text style={styles.flyerValidity}>
                Until : {formatDate(item.validTo)}
              </Text>
              {/* Valid From: {formatDate(item.validFrom)}  */}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C6EF5" />
      </View>
    );
  }

  if (storeFlyers.length === 0) {
    return (
      <View style={styles.noFlyersContainer}>
        <Text style={styles.noFlyersText}>
          No flyers available for this store.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={storeFlyers}
      // @ts-expect-error ignore
      keyExtractor={item => item.id}
      renderItem={renderFlyer}
      contentContainerStyle={styles.flyerList}
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
    paddingHorizontal: 20,
  },
  noFlyersText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#888',
    textAlign: 'center',
  },
  flyerList: {
    padding: 10,
  },
  flyerCard: {
    backgroundColor: '#ffffff',
    // marginBottom: 15,
    marginBottom: 5,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  flyerImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  flyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  flyerTitle: {
    fontSize: 16,
    color: '#555',
  },
  flyerValidity: {
    fontSize: 14,
    color: '#777',
  },
  heartIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    zIndex: 10, // Ensures it's above other elements
  },
});

export default StoreFlyersComponent;
