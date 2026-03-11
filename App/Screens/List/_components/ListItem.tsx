import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListItem = ({item, onDelete}: {item: any; onDelete: () => void}) => {
  return (
    <View style={styles.listItem}>
      <Image
        source={{
          uri: item.image || 'https://via.placeholder.com/150',
        }}
        style={styles.itemImage}
      />
      <Text style={styles.itemName} numberOfLines={1}>
        {item.name || item.title}
      </Text>
      <Pressable onPress={onDelete}>
        <Icon
          name="delete"
          size={24}
          color="#FF0000"
          style={styles.deleteIcon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteIcon: {
    marginLeft: 10,
  },
});

export default ListItem;
