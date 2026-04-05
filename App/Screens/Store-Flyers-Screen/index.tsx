// App/Screens/Store-Flyers-Screen/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchFlyersByStore } from '../../../actions/store/fetch-store-flyers';

// Define the Flyer interface
interface Flyer {
  id: string;
  title: string;
  description: string;
  image: string;
  validFrom: string;
  validTo: string;
  storeId: string;
  createdAt: string;
}

// Define route params type
interface RouteParams {
  storeId: string;
  storeName: string;
}

const FlyerItem = ({ item, onPress }: { item: Flyer; onPress: (item: Flyer) => void }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.9}>
      <View style={styles.flyerCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.flyerImage}
          resizeMode="cover"
        />
        <View style={styles.flyerDetails}>
          <Text style={styles.flyerTitle}>{item.title}</Text>
          <Text style={styles.flyerDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.validityContainer}>
            <Icon name="calendar-outline" size={12} color="#888" />
            <Text style={styles.flyerValidity}>
              Valid: {item.validFrom} - {item.validTo}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StoreFlyersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { storeId, storeName } = (route.params as RouteParams) || { storeId: '', storeName: '' };
  
  const [flyers, setFlyers] = useState<Flyer[]>([]); // 👈 Add Flyer[] type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        const flyersData = await fetchFlyersByStore(storeId);
        setFlyers(flyersData as Flyer[]);
      } catch (error) {
        console.error('Error fetching store flyers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchFlyers();
    } else {
      setLoading(false);
    }
  }, [storeId]);

  const handleFlyerPress = (flyer: Flyer) => {
  (navigation as any).navigate('Flyer', { deal: flyer });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C6EF5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{storeName || 'Store Flyers'}</Text>
          {!loading && (
            <Text style={styles.flyerCount}>
              {flyers.length} flyer{flyers.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Flyers List */}
      {flyers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="document-text-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No flyers available for this store</Text>
        </View>
      ) : (
        <FlatList
          data={flyers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FlyerItem item={item} onPress={handleFlyerPress} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  flyerCount: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  headerRight: {
    width: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  flyerCard: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  flyerImage: {
    width: '100%',
    height: 180,
  },
  flyerDetails: {
    padding: 12,
  },
  flyerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  flyerDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flyerValidity: {
    fontSize: 11,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
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
});

export default StoreFlyersScreen;