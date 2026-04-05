// App/Screens/List/_components/ListContent.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ListContentProps {
  data: any[];
  onItemPress: (item: any) => void;
  onDelete: (item: any) => void;
  emptyMessage: string;
}

const ListContent: React.FC<ListContentProps> = ({
  data,
  onItemPress,
  onDelete,
  emptyMessage,
}) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onItemPress(item)}
      activeOpacity={0.7}
    >
      {/* Image */}
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/60' }}
        style={styles.itemImage}
      />
      
      {/* Content */}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title || item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        {item.validFrom && item.validTo && (
          <Text style={styles.itemValidity}>
            Valid: {item.validFrom} - {item.validTo}
          </Text>
        )}
      </View>
      
      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item)}
      >
        <Icon name="trash-outline" size={22} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="heart-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  itemValidity: {
    fontSize: 11,
    color: '#888',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
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

export default ListContent;