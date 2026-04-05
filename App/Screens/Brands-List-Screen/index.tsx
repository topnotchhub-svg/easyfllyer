// App/Screens/Brands-List-Screen/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchAllBrands } from '../../../actions/brand/fetch-brands';

interface Brand {
  id: string;
  name: string;
  description: string;
  email: string;
  image: string;
  postalCode: string;
  createdAt?: string;
  active?: boolean;
}

const BrandItem = ({ item, onPress }: { item: Brand; onPress: (item: Brand) => void }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={[styles.brandCard, item.active === false && styles.inactiveCard]}>
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
            style={styles.brandLogo}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </View>

        <View style={styles.brandDetails}>
          <View style={styles.nameRow}>
            <Text style={[styles.brandName, item.active === false && styles.inactiveText]}>
              {item.name || 'No name provided'}
            </Text>
            {item.active === false && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Inactive</Text>
              </View>
            )}
          </View>
          <Text style={[styles.brandDescription, item.active === false && styles.inactiveText]}>
            {item.description || 'No description available'}
          </Text>
          <Text style={[styles.brandAddress, item.active === false && styles.inactiveText]}>
            📍 {item.postalCode || 'No postal code provided'}
          </Text>
          <Text style={[styles.brandEmail, item.active === false && styles.inactiveText]}>
            📧 {item.email || 'No email address provided'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BrandsListScreen = () => {
  const navigation = useNavigation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const brandsData = await fetchAllBrands();
      setBrands(brandsData as Brand[]);
      setFilteredBrands(brandsData as Brand[]);
    } catch (error) {
      console.error('Error fetching brand data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const brandsData = await fetchAllBrands();
      setBrands(brandsData as Brand[]);
      setFilteredBrands(brandsData as Brand[]);
    } catch (error) {
      console.error('Error refreshing brands:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter((brand) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          brand.name?.toLowerCase().includes(searchLower) ||
          brand.description?.toLowerCase().includes(searchLower) ||
          brand.postalCode?.toLowerCase().includes(searchLower) ||
          brand.email?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredBrands(filtered);
    }
  }, [searchQuery, brands]);

  const handleBrandPress = (brand: Brand) => {
    (navigation as any).navigate('BrandFlyers', {
      brandId: brand.id,
      brandName: brand.name,
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C6EF5" />
        <Text style={styles.loadingText}>Loading brands...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Brands</Text>
        {!loading && brands.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{brands.length}</Text>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by brand name, description, or location..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={clearSearch}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      {!loading && filteredBrands.length > 0 && (
        <Text style={styles.resultsCount}>
          {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} found
        </Text>
      )}

      {/* Brand List */}
      <FlatList
        data={filteredBrands}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BrandItem item={item} onPress={handleBrandPress} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4C6EF5']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="business-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No brands match your search' : 'No brands found'}
            </Text>
            {searchQuery && (
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.clearSearchText}>Clear search</Text>
              </TouchableOpacity>
            )}
          </View>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8FF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#4C6EF5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  brandCard: {
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
  inactiveCard: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
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
  brandLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  imageLoader: {
    position: 'absolute',
  },
  brandDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  brandDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  brandAddress: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  brandEmail: {
    fontSize: 12,
    color: '#888',
  },
  inactiveText: {
    color: '#999',
  },
  inactiveBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inactiveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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

export default BrandsListScreen;