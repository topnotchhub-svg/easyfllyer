import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

const CategoryItem = ({ item, isSelected, onSelect }: any) => {
  return (
    <Pressable
      style={[styles.categoryItem, isSelected && styles.selectedCategory]}
      onPress={onSelect}
    >
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryInitial}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#4C6EF5',
  },
  categoryIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C6EF5',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default CategoryItem;
