// utils/FlyerItem.js
import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const FlyerItem = ({ item, navigation, toggleFavorite, isFavorite }) => {
  const navigateToFlyerScreen = () => {
    navigation.navigate('Flyer', { deal: item });
  };

  // Determine which image to show (brand image for brand flyers, store image for store flyers)
  const getEntityImage = () => {
      return item.brandImage;
  };

  const getEntityName = () => {
      return item.brandName;
  };

  const entityImage = getEntityImage();
  const entityName = getEntityName();

  return (
    <View style={styles.flyerCard}>
      {/* Heart Icon for Favorite */}
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={() => toggleFavorite(item)}
      >
        <Icon
          name={isFavorite ? 'heart' : 'heart-o'}
          size={22}
          color={isFavorite ? '#FF0000' : '#888'}
        />
      </TouchableOpacity>

      {/* Flyer Content */}
      <TouchableOpacity onPress={navigateToFlyerScreen} activeOpacity={0.9}>
        <Image
          source={{ uri: item.image }}
          style={styles.flyerImage}
          resizeMode="cover"
        />
        <View style={styles.flyerDetails}>
          {/* Brand/Store Image and Flyer Title */}
          <View style={styles.brandWithTitleContainer}>
            {entityImage && (
              <Image
                source={{ uri: entityImage }}
                style={styles.brandImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.textInfo}>
              <Text style={styles.entityName}>{entityName}</Text>
              <Text style={styles.flyerTitle}>{item.title}</Text>
              <Text style={styles.flyerDescription}>{item.description}</Text>
              <Text style={styles.flyerValidity}>
                Until : {formatDate(item.validTo)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flyerCard: {
    backgroundColor: '#ffffff',
    marginBottom: 5,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  flyerImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  flyerDetails: {
    padding: 15,
    backgroundColor: '#fff',
  },
  textInfo: {
    flex: 1,
  },
  brandWithTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  brandImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  entityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 2,
  },
  flyerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  flyerDescription: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
  },
  flyerValidity: {
    fontSize: 12,
    color: '#888',
  },
  heartIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    zIndex: 10,
  },
});

export default FlyerItem;