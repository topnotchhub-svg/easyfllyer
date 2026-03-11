import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to AsyncStorage
 * @param {string} key - Key to store the data under
 * @param {any} value - Value to store
 */
export const saveUserData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`Data saved successfully under key: ${key}`);
  } catch (error) {
    console.error('Error saving data to AsyncStorage:', error);
  }
};

/**
 * Get data from AsyncStorage
 * @param {string} key - Key of the data to retrieve
 * @returns {Promise<any>} - Returns the parsed data or null if not found
 */
export const getUserData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data from AsyncStorage:', error);
    return null;
  }
};

/**
 * Remove data from AsyncStorage
 * @param {string} key - Key of the data to remove
 */
export const removeUserData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data removed successfully for key: ${key}`);
  } catch (error) {
    console.error('Error removing data from AsyncStorage:', error);
  }
};
