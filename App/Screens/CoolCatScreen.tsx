import React from 'react';
import {View, Image, StyleSheet, Button} from 'react-native';

const CoolCatScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg',
        }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          color="#6200EE"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '50%',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default CoolCatScreen;
