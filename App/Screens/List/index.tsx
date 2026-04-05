// App/Screens/List/index.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { toggleFavorite } from '../../../store/slices/favoritesSlice';
import { toggleBrandFlyer } from '../../../store/slices/brandSlice';
import { toggleStoreFlyer } from '../../../store/slices/storeSlice';
import Header from './_components/Header';
import Tabs from './_components/Tabs';
import ListContent from './_components/ListContent';
import { AuthContext } from '../../../lib/AuthContext';
import { toggleEvents } from '../../../store/slices/eventSlice';

const ListsScreen = ({ navigation }: any) => {
  const userData = useContext(AuthContext);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('favorites');

  const events = useSelector((state: RootState) => state.Events || []);
  const favorites = useSelector((state: RootState) => state.favorites || []);
  const brandFlyers = useSelector((state: RootState) => state.brandFlyers || []);
  const storeFavorites = useSelector((state: RootState) => state.storeFlyers || []);

  const handleItemPress = (item: any) => {
    switch (activeTab) {
      case 'favorites':
        if (item.type === 'brand') {
          navigation.navigate('BrandFlyers', {
            brandId: item.id,
            brandName: item.name,
          });
        } else if (item.type === 'store') {
          navigation.navigate('StoreFlyers', {
            storeId: item.id,
            storeName: item.name,
          });
        } else if (item.type === 'flyer') {
          navigation.navigate('Flyer', { deal: item });
        }
        break;
        
      case 'brandFlyers':
        navigation.navigate('Flyer', { deal: item });
        break;
        
      case 'storeFlyers':
        navigation.navigate('Flyer', { deal: item });
        break;
        
      case 'events':
        console.log('Navigating to event:', item); // Debug log
        navigation.navigate('SpecialEventDetail', { event: item });
        break;
        
      default:
        break;
    }
  };

  const handleDelete = (item: any) => {
    if (activeTab === 'favorites') {
      dispatch(toggleFavorite(item));
    } else if (activeTab === 'brandFlyers') {
      dispatch(toggleBrandFlyer(item));
    } else if (activeTab === 'storeFlyers') {
      dispatch(toggleStoreFlyer(item));
    } else {
      dispatch(toggleEvents(item));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Header title="My Lists" onBack={() => navigation.goBack()} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ListContent
          data={
            activeTab === 'favorites'
              ? favorites
              : activeTab === 'brandFlyers'
              ? brandFlyers
              : activeTab === 'storeFlyers'
              ? storeFavorites
              : events
          }
          onItemPress={handleItemPress}
          onDelete={handleDelete}
          emptyMessage={
            activeTab === 'favorites'
              ? "You don't have any favorites yet."
              : activeTab === 'brandFlyers'
              ? 'No brand flyers available.'
              : activeTab === 'storeFlyers'
              ? 'No store flyers available.'
              : 'No events available.'
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
});

export default ListsScreen;