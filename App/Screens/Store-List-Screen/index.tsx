// App/Screens/Store-List-Screen/index.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { AuthContext } from '../../../lib/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchAllStores } from '../../../actions/store/fetch-store';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your navigation param list
type RootStackParamList = {
  StoresList: undefined;
  StoreFlyers: { storeId: string; storeName: string };
  Flyer: { deal: any };
  // Add other screens here
};

// Type the navigation hook
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Store {
  id: string;
  name: string;
  description: string;
  email: string;
  image: string;
  postalCode: string;
  createdAt?: string;
}

const StoreItem = ({ item, onPress }: { item: Store; onPress: (item: Store) => void }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.storeCard}>
        <View style={styles.logoContainer}>
          {imageLoading && (
            <ActivityIndicator
              size="small"
              color="#4C6EF5"
              style={styles.imageLoader}
            />
          )}
          <Image
            source={{ uri: item?.image || 'https://via.placeholder.com/100' }}
            style={styles.storeLogo}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </View>

        <View style={styles.storeDetails}>
          <Text style={styles.storeName}>{item.name || 'No name provided'}</Text>
          <Text style={styles.storeBrand}>
            {item.description || 'No description available'}
          </Text>
          <Text style={styles.storeAddress}>
            📍 {item.postalCode || 'No postal code provided'}
          </Text>
          <Text style={styles.storeEmail}>
            📧 {item.email || 'No email address provided'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StoresListScreen = () => {
  const { userData } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp>(); // 👈 Type the navigation
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesData = await fetchAllStores();
        setStores(storesData as Store[]);
        setFilteredStores(storesData as Store[]);
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter((store) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          store.name?.toLowerCase().includes(searchLower) ||
          store.description?.toLowerCase().includes(searchLower) ||
          store.postalCode?.toLowerCase().includes(searchLower) ||
          store.email?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredStores(filtered);
    }
  }, [searchQuery, stores]);

  const handleStorePress = (store: Store) => {
    navigation.navigate('StoreFlyers', { 
      storeId: store.id,
      storeName: store.name 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stores</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by store name, description, or location..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {!loading && filteredStores.length > 0 && (
        <Text style={styles.resultsCount}>
          {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} found
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#4C6EF5" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredStores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoreItem item={item} onPress={handleStorePress} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="storefront-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No stores match your search' : 'No stores found'}
              </Text>
              {searchQuery && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchText}>Clear search</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: '#666',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loader: {
    marginTop: 20,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  storeLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  imageLoader: {
    position: 'absolute',
  },
  storeDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  storeBrand: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  storeEmail: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 12,
    fontSize: 16,
  },
  clearSearchText: {
    color: '#4C6EF5',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default StoresListScreen;