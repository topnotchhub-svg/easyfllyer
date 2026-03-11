import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import React from 'react';
import SignInScreen from '../Screens/sign-in';
import HomeScreen from '../Screens/home';
import WatchListScreen from '../Screens/categories';
import ExploreScreen from '../Screens/explore';
import FlyerScreen from '../Screens/Flyer';
import DealScreen from '../Screens/deals';
import ListsScreen from '../Screens/List';
import UpdatePostalCodeScreen from '../Screens/Update-Postal-Code';
import StoresListScreen from '../Screens/Store-List-Screen';
import CoolCatScreen from '../Screens/CoolCatScreen';
import SpecialEventDetailScreen from '../Screens/SpecialEventDetail';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      {/* SignIn Screen: Vertical Slide Animation */}
      <Stack.Screen
        name="signIn"
        component={SignInScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      {/* SignIn Screen: Vertical Slide Animation */}
      <Stack.Screen
        name="updatepostalcode"
        component={UpdatePostalCodeScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />

      {/* Home Screen: Slide From Right */}
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      {/* WatchList Screen: Modal Slide-Up Animation */}
      <Stack.Screen
        name="categories"
        component={WatchListScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />

      {/* Explore Screen: Slide from Left */}
      <Stack.Screen
        name="explore"
        component={ExploreScreen}
        options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forRevealFromBottomAndroid,
        }}
      />

      {/* Flyer Screen: Fade-In */}
      <Stack.Screen
        name="Flyer"
        component={FlyerScreen}
        options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />

      {/* Deal Screen: Horizontal Flip */}
      <Stack.Screen
        name="deal"
        component={DealScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 500 } },
            close: { animation: 'timing', config: { duration: 400 } },
          },
        }}
      />

      {/* Lists Screen: Default Slide from Right */}
      <Stack.Screen
        name="List"
        component={ListsScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      {/* Store Screen: Default Slide from Right */}
      <Stack.Screen
        name="store"
        component={StoresListScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      <Stack.Screen
        name="cat"
        component={CoolCatScreen}
        // options={{
        //   cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        // }}
        // options={{
        //   title: 'Cool Cat',
        //   headerStyle: {backgroundColor: '#6200EE'},
        //   headerTintColor: '#fff',
        // }}
      />

      {/* Special Event Detail Screen: Fade-In */}
      <Stack.Screen
        name="SpecialEventDetail"
        component={SpecialEventDetailScreen}
        options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
