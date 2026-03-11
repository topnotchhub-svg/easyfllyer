// BottomBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

export default function BottomBar({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    // Ensures background fills the curved corners / home-indicator zone
    <SafeAreaView edges={['bottom']} style={styles.safeBottom}>
      <View
        style={[
          styles.bar,
          // If there’s no bottom inset (3-button nav), keep at least 10px
          { paddingBottom: Math.max(insets.bottom, 10) },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('home')}
          style={styles.item}
        >
          <Text style={styles.icon}>
            <Icon name="home" size={24} color="#000" />
          </Text>
          <Text style={styles.label}>Browse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('store')}
          style={styles.item}
        >
          <Text style={styles.icon}>
            <EntypoIcon name="shop" size={24} color="#000" />
          </Text>
          <Text style={styles.label}>Stores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('List')}
          style={styles.item}
        >
          <Text style={styles.icon}>
            <Icon name="list" size={24} color="#000" />
          </Text>
          <Text style={styles.label}>Lists</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeBottom: {
    backgroundColor: '#becbd6', // extends behind the home indicator
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#becbd6',
    paddingTop: 10,
  },
  item: { alignItems: 'center' },
  icon: { color: '#000', fontSize: 20 },
  label: { color: '#000', fontSize: 12, marginTop: 5 },
});
