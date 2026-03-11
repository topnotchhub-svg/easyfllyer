import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import SignupScreen from '../Screens/sign-up';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="signUp"
      screenOptions={{headerShown: false, gestureEnabled: true}}>
      {/* Signup Screen: Fade Animation */}
      <Stack.Screen
        name="signUp"
        component={SignupScreen}
        options={{
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
