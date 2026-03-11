import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from './store-flyers';
import { toggleEvents } from '../../store/slices/eventSlice';
import { RootState } from '../../store/store';

const SpecialEventCard = ({ item, navigation }: any) => {
  const [imageLoading, setImageLoading] = useState(!!item.image);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();

  // Check if this event is already a favorite
  const favorites = useSelector((state: RootState) => state.Events);
  const isFavorite = favorites.some((fav: any) => fav.id === item.id);

  const handleFavoriteToggle = () => {
    dispatch(toggleEvents(item));
  };

  const handlePress = () => {
    navigation?.navigate('SpecialEventDetail', { event: item });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Favorite (Heart) Icon */}
      <TouchableOpacity style={styles.heartIcon} onPress={handleFavoriteToggle}>
        <Icon
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={26}
          color={isFavorite ? '#FF3D00' : '#888'}
        />
      </TouchableOpacity>

      {/* Event Image with Loader */}
      <View style={styles.imageContainer}>
        {item?.image && !imageError ? (
          <>
            {imageLoading && (
              <View style={styles.imageLoaderContainer}>
                <ActivityIndicator size="small" color="#4C6EF5" />
              </View>
            )}
            <Image
              source={{
                uri: item.image,
                cache: 'force-cache',
              }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
          </>
        ) : (
          <View style={styles.placeholderImage}>
            <View style={styles.placeholderIconContainer}>
              <Icon name="event" size={32} color="#bbb" />
            </View>
            <Text style={styles.placeholderImageText}>
              {imageError ? 'Failed to load' : 'No Image'}
            </Text>
          </View>
        )}
      </View>

      {/* Event Details Section */}
      <View style={styles.details}>
        <View style={styles.brandWithTitleContainer}>
          {item?.brand?.image || item?.store?.image ? (
            <Image
              source={{ uri: item?.brand?.image || item?.store?.image }}
              style={styles.brandImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderBrandImage}>
              {/* <Text style={styles.placeholderText}>No Image</Text> */}
            </View>
          )}

          <View style={styles.textInfo}>
            <Text
              style={styles.storeName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.store?.name || item?.brand?.name}
            </Text>
            <Text
              style={styles.eventName}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item?.name}
            </Text>
            <Text style={styles.validity}>
              Valid From: {formatDate(item?.startDate)} To:{' '}
              {formatDate(item?.endDate)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageLoaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  heartIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    zIndex: 10, // Ensures clickability
  },
  details: {
    padding: 15,
    backgroundColor: '#fff',
  },
  brandWithTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
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
  eventName: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  validity: {
    fontSize: 14,
    color: '#777',
  },

  placeholderBrandImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  placeholderText: {
    fontSize: 12,
    color: '#888',
  },

  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },

  placeholderIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },

  placeholderImageText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SpecialEventCard;
