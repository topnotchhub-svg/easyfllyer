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
          {/* Brand Image and Flyer Title */}
          <View style={styles.brandWithTitleContainer}>
            {item.brandImage && (
              <Image
                source={{ uri: item.brandImage }}
                style={styles.brandImage}
                resizeMode="contain"
              />
            )}
            <View style={styles.textInfo}>
            <Text style={styles.flyerTitle}>{item.title}</Text>
             <Text style={styles.flyerDescription}>{item.description}</Text>
             <Text style={styles.flyerValidity}>
            Until : {formatDate(item.validTo)}
          </Text>
          {/* Valid From: {formatDate(item.validFrom)}  */}
            </View>
          </View>

          {/* Flyer Description */}
          {/* <Text style={styles.flyerValidity}>
            Valid From: {formatDate(item.validFrom)} To: {formatDate(item.validTo)}
          </Text> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  flyerCard: {
    backgroundColor: '#ffffff',
    // marginBottom: 15,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  flyerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  flyerDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  flyerValidity: {
    fontSize: 13,
    color: '#777',
    // marginTop: 5,
    // backgroundColor : '#eeee',
  },
  heartIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    zIndex: 10, // Ensure it's above other elements
  },
});

export default FlyerItem;
