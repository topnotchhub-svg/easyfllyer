// App/Screens/Brand-Flyers-Screen/index.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchFlyersByBrand } from '../../../actions/brand/fetch-brand-flyers';
import { Header } from '../../../App/components/header';
import { AuthContext } from '../../../lib/AuthContext';

interface Flyer {
  id: string;
  title: string;
  description: string;
  image: string;
  validFrom: string;
  validTo: string;
  brandId: string;
  createdAt: string;
}

interface RouteParams {
  brandId: string;
  brandName: string;
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

const BrandFlyersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = useContext(AuthContext);
  const { brandId, brandName } = (route.params as RouteParams) || { brandId: '', brandName: '' };
  
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        const flyersData = await fetchFlyersByBrand(brandId);
        setFlyers(flyersData as Flyer[]);
      } catch (error) {
        console.error('Error fetching brand flyers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (brandId) {
      fetchFlyers();
    } else {
      setLoading(false);
    }
  }, [brandId]);

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
      <SafeAreaView style={styles.safeArea} edges={['top']}>
    <View style={styles.container}>
      {/* Header */}
      <Header
        userData={userData}
        navigation={navigation}
        setAlertVisible={setAlertVisible}
        setIsCameraActive={setIsCameraActive}
      />

      {/* Title Section */}
      <View style={styles.titleSection}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{brandName || 'Brand Flyers'}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Flyers Count */}
      {!loading && flyers.length > 0 && (
        <Text style={styles.flyerCount}>
          {flyers.length} flyer{flyers.length !== 1 ? 's' : ''} available
        </Text>
      )}

      {/* Flyers List */}
      {flyers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="document-text-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No flyers available for this brand</Text>
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
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  flyerCount: {
    fontSize: 13,
    color: '#666',
    marginHorizontal: 16,
    marginVertical: 8,
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

export default BrandFlyersScreen;