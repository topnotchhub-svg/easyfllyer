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

/////////////////////////////////////////////////////////////////

// import {createSlice} from '@reduxjs/toolkit';
// import {
//   getFavoritesFromFirebase,
//   removeFavoriteFromFirebase,
//   saveFavoriteToFirebase,
// } from '../../actions/favourites';

// const favoritesSlice = createSlice({
//   name: 'favorites',
//   initialState: [],
//   reducers: {
//     /**
//      * Fetch all favorites and replace the current state.
//      * @param {Array} action.payload - Array of favorite items fetched from Firebase.
//      */
//     fetchFavorites: (state, action) => {
//       return Array.isArray(action.payload) ? action.payload : [];
//     },

//     /**
//      * Toggle a favorite item in the state (add if not present, remove if present).
//      * Sync the change with Firebase.
//      * @param {Object} action.payload - The favorite item to toggle, including `id`, `name`, `type`, and `userId`.
//      */
//     toggleFavorite: (state, action) => {
//       const {id, name, type, userId} = action.payload;

//       // Validate the payload
//       if (!id || !name || !type || !userId) {
//         console.error('Invalid payload for toggleFavorite:', action.payload);
//         return state; // Return the unchanged state for invalid payload
//       }

//       const exists = state.some(item => item.id === id);

//       if (exists) {
//         // Remove locally
//         const updatedState = state.filter(item => item.id !== id);

//         // Sync removal with Firebase
//         removeFavoriteFromFirebase(userId, {id, name, type})
//           .then(() => {
//             console.log('Favorite removed from Firebase:', {id, name});
//           })
//           .catch(error => {
//             console.error('Error syncing removal with Firebase:', error);
//           });

//         return updatedState;
//       } else {
//         // Add locally
//         const updatedState = [...state, {id, name, type}];

//         // Sync addition with Firebase
//         saveFavoriteToFirebase(userId, {id, name, type})
//           .then(() => {
//             console.log('Favorite saved to Firebase:', {id, name});
//           })
//           .catch(error => {
//             console.error('Error syncing addition with Firebase:', error);
//           });

//         return updatedState;
//       }
//     },
//   },
// });

// /**
//  * Thunk to initialize favorites by fetching from Firebase.
//  * @param {string} userId - The ID of the user.
//  */
// export const initializeFavorites = userId => async dispatch => {
//   if (!userId) {
//     console.warn('No user ID provided for initializing favorites');
//     return;
//   }

//   try {
//     const favorites = await getFavoritesFromFirebase(userId);
//     dispatch(fetchFavorites(favorites)); // Load favorites from Firebase into Redux state
//   } catch (error) {
//     console.error('Error initializing favorites:', error);
//   }
// };

// // Export actions
// export const {fetchFavorites, toggleFavorite} = favoritesSlice.actions;
// export default favoritesSlice.reducer;
