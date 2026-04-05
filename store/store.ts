// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import favoritesReducer from './slices/favoritesSlice';
import brandFlyersReducer from './slices/brandSlice';
import storeFlyersReducer from './slices/storeSlice';
import eventsReducer from './slices/eventSlice';
import toggleCategory from './slices/categoriesSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  brandFlyers: brandFlyersReducer,
  storeFlyers: storeFlyersReducer,
  Events: eventsReducer,
  categories: toggleCategory,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const persistor = persistStore(store);
export default store;
