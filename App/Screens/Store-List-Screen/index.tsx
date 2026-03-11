import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {AuthContext} from '../../../lib/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {fetchAllStores} from '../../../actions/store/fetch-store';

const StoreItem = ({item}: any) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={styles.storeCard}>
      {/* Store Logo with Loading and Error Fallback */}
      <View style={styles.logoContainer}>
        {imageLoading && (
          <ActivityIndicator
            size="small"
            color="#4C6EF5"
            style={styles.imageLoader}
          />
        )}
        <Image
          source={{uri: item?.image || 'https://via.placeholder.com/100'}}
          style={styles.storeLogo}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => setImageLoading(false)} // Stop loader on error
        />
      </View>

      {/* Store Details */}
      <View style={styles.storeDetails}>
        <Text style={styles.storeName}>{item.name || 'No name provided'}</Text>
        <Text style={styles.storeBrand}>
          {item.description || 'No description available'}
        </Text>
        <Text style={styles.storeAddress}>
          {item.postalCode || 'No postal code provided'}
        </Text>
        <Text style={styles.storeEmail}>
          📧 {item.email || 'No email address provided'}
        </Text>
      </View>
    </View>
  );
};

const StoresListScreen = () => {
  const {userData} = useContext(AuthContext);
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch store data from Firestore
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesData = await fetchAllStores(); // Fetch stores from Firestore
        setStores(storesData);
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stores List</Text>
      </View>

      {/* Store List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4C6EF5" style={styles.loader} />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item: any) => item.id}
          renderItem={({item}) => <StoreItem item={item} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No stores found for your postal code
            </Text>
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
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginRight: 24, // To align with the back icon
  },
  loader: {
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
    alignContent: 'center',
    alignItems: 'center',
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    width: '98%',
    alignContent: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd', // Placeholder background while image loads
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  storeBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  storeCity: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  storePhone: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  storeEmail: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
});

export default StoresListScreen;
