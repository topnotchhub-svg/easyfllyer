import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {
  fetchFavorites,
  toggleFavorite,
} from '../../../store/slices/favoritesSlice';
import {toggleBrandFlyer} from '../../../store/slices/brandSlice';
import {toggleStoreFlyer} from '../../../store/slices/storeSlice';
import Header from './_components/Header';
import Tabs from './_components/Tabs';
import ListContent from './_components/ListContent';
import {AuthContext} from '../../../lib/AuthContext';
import {toggleEvents} from '../../../store/slices/eventSlice';

const ListsScreen = ({navigation}: any) => {
  const userData = useContext(AuthContext);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('favorites');

  // Fetching data from Redux store
  const events = useSelector((state: RootState) => state.Events || []);
  const favorites = useSelector((state: RootState) => state.favorites || []);
  const brandFlyers = useSelector(
    (state: RootState) => state.brandFlyers || [],
  );
  const storeFavorites = useSelector(
    (state: RootState) => state.storeFlyers || [],
  );

  // Filter favorite events from events state
  // const favoriteEvents = events.filter(event => event.isFavorite);

  useEffect(() => {
    if (activeTab === 'favorites') {
      dispatch(fetchFavorites());
    }
  }, [dispatch, activeTab]);

  const handleDelete = (item: any) => {
    if (activeTab === 'favorites') {
      dispatch(toggleFavorite(item));
    } else if (activeTab === 'brandFlyers') {
      dispatch(toggleBrandFlyer(item));
    } else if (activeTab === 'storeFlyers') {
      dispatch(toggleStoreFlyer(item));
    } else {
      dispatch(toggleEvents(item)); // Handle event deletion
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
});

export default ListsScreen;
