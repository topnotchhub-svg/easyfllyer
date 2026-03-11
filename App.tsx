// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <NewAppScreen templateFileName="App.tsx" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;

///////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from 'react-native-toast-notifications';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserData } from './lib/storageUtils';
import CurrentUserNavigation from './App/Navigations/role-nav';
import { AuthProvider } from './lib/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import store, { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

function App(): React.JSX.Element {
  const [user, setuser] = useState(null);
  // console.log('🚀 User in App.tsx -------- >', user);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getUserData('userData');

        if (userData) {
          setuser(userData);
        }
      } catch (error) {
        console.error('Error checking user data:', error);
      }
    };
    checkUser();
  }, [user]);
  return (
    <ToastProvider
      placement="top"
      duration={5000}
      animationType="slide-in"
      animationDuration={250}
      offset={20}
      offsetTop={30}
      offsetBottom={40}
      swipeEnabled={true}
      renderToast={toast => (
        <CustomToast message={toast.message} type={toast.type} />
      )}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <PaperProvider>
              <NavigationContainer>
                <CurrentUserNavigation />
                {/* <StackNavigation /> */}
              </NavigationContainer>
            </PaperProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}

// Custom Toast Component
const CustomToast = ({ message, type }: any) => {
  const toastStyles = getToastStyles(type);

  return (
    <View
      style={[
        styles.toastContainer,
        { borderLeftColor: toastStyles.borderColor },
      ]}
    >
      <Icon
        name={toastStyles.icon}
        size={20}
        color={toastStyles.borderColor}
        style={styles.toastIcon}
      />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{toastStyles.title}</Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </View>
  );
};

// Function to get styles based on toast type
const getToastStyles = (type: string) => {
  switch (type) {
    case 'success':
      return {
        borderColor: 'green',
        title: 'Success',
        icon: 'checkmark-circle',
      };
    case 'danger':
      return { borderColor: 'red', title: 'Error', icon: 'close-circle' };
    case 'warning':
      return { borderColor: 'orange', title: 'Warning', icon: 'warning' };
    default:
      return { borderColor: 'gray', title: 'Info', icon: 'information-circle' };
  }
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    borderLeftWidth: 5,
  },
  toastIcon: {
    marginRight: 10,
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  toastMessage: {
    fontSize: 14,
    color: '#555',
  },
});

export default App;
