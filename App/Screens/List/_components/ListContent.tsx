import React from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import ListItem from './ListItem';

const ListContent = ({
  data,
  loading,
  onDelete,
  emptyMessage,
}: {
  data: any[];
  loading?: boolean;
  onDelete: (item: any) => void;
  emptyMessage: string;
}) => {
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4C6EF5" />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => (item?.id || index).toString()}
      renderItem={({item}) => (
        <ListItem item={item} onDelete={() => onDelete(item)} />
      )}
      contentContainerStyle={styles.listContentContainer}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});

export default ListContent;
