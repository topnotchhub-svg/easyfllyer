import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const Tabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    {key: 'favorites', label: 'Favorites'},
    {key: 'brandFlyers', label: 'Brand Flyers'},
    {key: 'storeFlyers', label: 'Store Flyers'},
    {key: 'allEvents', label: 'All Events'},
  ];

  return (
    <View style={styles.tabsContainer}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key)}>
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4C6EF5',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#4C6EF5',
    fontWeight: 'bold',
  },
});

export default Tabs;
