import React from 'react';
import {Pressable, Text, Image, StyleSheet} from 'react-native';

const StoreItem = ({item, isFavorite, onToggleFavorite, mediaLink}) => {
  return (
    <Pressable
      style={[styles.storeItem, isFavorite && styles.favoriteItem]}
      onPress={() => onToggleFavorite(item)} // Pass the entire item for toggling
    >
      <Image
        source={{uri: item?.image || 'https://via.placeholder.com/100'}}
        style={styles.storeIcon}
        resizeMode="cover"
      />
      <Text style={styles.storeName} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  storeItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  favoriteItem: {
    borderWidth: 2,
    borderColor: '#4C6EF5',
  },
  storeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default StoreItem;
