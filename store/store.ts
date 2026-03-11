import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import favoritesReducer from './slices/favoritesSlice';
import brandFlyersReducer from './slices/brandSlice';
import storeFlyersReducer from './slices/storeSlice';
import eventsReducer from './slices/eventSlice';
import toggleCategory from './slices/categoriesSlice';

// Configure persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Combine reducers
const rootReducer = combineReducers({
  favorites: favoritesReducer,
  brandFlyers: brandFlyersReducer,
  storeFlyers: storeFlyersReducer,
  Events: eventsReducer,
  categories: toggleCategory,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
});

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

export const persistor = persistStore(store);
export default store;
