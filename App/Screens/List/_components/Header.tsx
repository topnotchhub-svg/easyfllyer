import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({title, onBack}: {title: string; onBack: () => void}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Icon name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerTitle: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Header;
