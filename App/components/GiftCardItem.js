import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const GiftCardItem = ({item, onPress}) => (
  <TouchableOpacity onPress={() => onPress(item)} style={styles.container}>
    <View>
      <Text style={styles.name}>{item.c_name}</Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  date: {fontSize: 14, color: '#555'},
});

export default GiftCardItem;
