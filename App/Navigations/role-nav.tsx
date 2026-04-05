// App/Navigations/role-nav.tsx
import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../lib/AuthContext';
import StackNavigation from './stack-nav';
import AuthNavigation from './auth-nav';

const CurrentUserNavigation = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4C6EF5" />
      </View>
    );
  }

  return isLoggedIn ? <StackNavigation /> : <AuthNavigation />;
};

export default CurrentUserNavigation;