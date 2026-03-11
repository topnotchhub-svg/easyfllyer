import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import SpecialEventCard from './SpecialEventCard';
import {
  fetchSpecialEvents,
  SpecialEvent,
} from '../../actions/special-events.ts/fetch-special-events';

const SpecialEventsComponent = ({ mediaLink, navigation }: any) => {
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Special Events from Firestore
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const events = await fetchSpecialEvents(); // Fetch events from Firestore
      setSpecialEvents(events);
    } catch (error) {
      console.error('Error fetching special events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4C6EF5" style={styles.loader} />
      ) : (
        <FlatList
          data={specialEvents}
          keyExtractor={(item: SpecialEvent) => item.id}
          renderItem={({ item }) => (
            <SpecialEventCard
              item={item}
              mediaLink={mediaLink}
              navigation={navigation}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            specialEvents.length === 0 ? (
              <Text style={styles.emptyText}>No special events found</Text>
            ) : null
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 50,
  },
  list: {
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
    fontSize: 16,
  },
});

export default SpecialEventsComponent;
