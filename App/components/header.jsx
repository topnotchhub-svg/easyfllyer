/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

export const Header = ({
  userData,
  navigation,
  setAlertVisible,
  setIsCameraActive,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerdiv}>
        <Text style={styles.headerText}>
          Savings from: {userData?.postalCode}{' '}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('updatepostalcode')}>
          <MaterialIcon
            name="edit"
            style={styles.editIcon}
            size={19}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerIcons}>
        {/* <TouchableOpacity>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => setAlertVisible(true)}>
          <AntDesignIcon name="deleteuser" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsCameraActive(true)}
          style={{marginLeft: 8}}>
          <MaterialIcon name="qr-code" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomColor: '#000000',
  },
  headerText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerdiv: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
});
