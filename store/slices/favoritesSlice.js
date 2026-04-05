// app/slices/favoritesSlice.js
import {createSlice} from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: [],
  reducers: {
    /**
     * Fetch all favorites and replace the current state.
     * @param {Array} action.payload - Array of favorite items fetched from the server or storage.
     */
    fetchFavorites: (state, action) => {
      return action.payload; // Replace the current state with fetched favorites
    },

    /**
     * Add a new favorite item to the state.
     * @param {Object} action.payload - The favorite item to add.
     */
    addFavorite: (state, action) => {
      const favorite = action.payload;
      const exists = state.some(item => item.id === favorite.id);
      if (!exists) {
        state.push(favorite); // Add only if it doesn't already exist
      }
    },

    /**
     * Remove a favorite item from the state.
     * @param {string} action.payload - The ID of the favorite item to remove.
     */
    removeFavorite: (state, action) => {
      const favoriteId = action.payload;
      return state.filter(item => item.id !== favoriteId); // Remove item by ID
    },

    /**
     * Toggle a favorite item in the state (add if not present, remove if present).
     * @param {Object} action.payload - The favorite item to toggle.
     */
    toggleFavorite: (state, action) => {
      const favorite = action.payload;
      const exists = state.some(item => item.id === favorite.id);
      if (exists) {
        return state.filter(item => item.id !== favorite.id); // Remove if it exists
      } else {
        state.push(favorite); // Add if it doesn't exist
      }
    },
  },
});

export const {fetchFavorites, addFavorite, removeFavorite, toggleFavorite} =
  favoritesSlice.actions;
export default favoritesSlice.reducer;

