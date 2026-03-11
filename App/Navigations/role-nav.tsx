import React, {useContext} from 'react';
import {AuthContext} from '../../lib/AuthContext';
import StackNavigation from './stack-nav';
import AuthNavigation from './auth-nav';

const CurrentUserNavigation = () => {
  const {isLoggedIn} = useContext(AuthContext);

  return isLoggedIn ? <StackNavigation /> : <AuthNavigation />;
};

export default CurrentUserNavigation;
