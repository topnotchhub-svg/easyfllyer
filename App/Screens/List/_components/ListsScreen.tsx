import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Header from './Header';
import Tabs from './Tabs';
import ListContent from './ListContent';
import {
  fetchFavorites,
  toggleFavorite,
} from '../../../../store/slices/favoritesSlice';
import {fetchStoreFlyersWithStoreImage} from '../../../../actions/store-flyers/fetch-store-flyers';
import {toggleBrandFlyer} from '../../../../store/slices/brandSlice';
import {toggleStoreFlyer} from '../../../../store/slices/storeSlice';
import {RootState} from '../../../../store/store';

const ListsScreen = ({navigation}: any) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('favorites');
  const [storeFlyers, setStoreFlyers] = useState([]);
  const [loadingStoreFlyers, setLoadingStoreFlyers] = useState(true);

  const favorites = useSelector((state: RootState) => state.favorites || []);
  const brandFlyers = useSelector(
    (state: RootState) => state.brandFlyers || [],
  );
  const storeFavorites = useSelector(
    (state: RootState) => state.storeFlyers || [],
  );

  useEffect(() => {
    if (activeTab === 'favorites') {
      dispatch(fetchFavorites());
    }
  }, [dispatch, activeTab]);

  //   useEffect(() => {
  //     const fetchFlyers = async () => {
  //       try {
  //         const flyers = await fetchStoreFlyersWithStoreImage();
  //         setStoreFlyers(flyers);
  //       } catch (error) {
  //         console.error('Error fetching store flyers:', error);
  //       } finally {
  //         setLoadingStoreFlyers(false);
  //       }
  //     };

  //     fetchFlyers();
  //   }, []);

  const handleDelete = (item: any) => {
    if (activeTab === 'favorites') {
      dispatch(toggleFavorite(item));
    } else if (activeTab === 'brandFlyers') {
      dispatch(toggleBrandFlyer(item));
    } else {
      dispatch(toggleStoreFlyer(item));
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
            : storeFavorites
        }
        // loading={activeTab === 'storeFlyers' && loadingStoreFlyers}
        onDelete={handleDelete}
        emptyMessage={
          activeTab === 'favorites'
            ? "You don't have any favorites yet."
            : activeTab === 'brandFlyers'
            ? 'No brand flyers available.'
            : 'No store flyers available.'
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
