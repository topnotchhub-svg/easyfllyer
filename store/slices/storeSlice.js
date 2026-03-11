import {createSlice} from '@reduxjs/toolkit';

const storeFlyersSlice = createSlice({
  name: 'storeFlyers',
  initialState: [],
  reducers: {
    toggleStoreFlyer: (state, action) => {
      const flyer = action.payload;
      const exists = state.some(item => item.id === flyer.id);
      if (exists) {
        return state.filter(item => item.id !== flyer.id);
      } else {
        state.push(flyer);
      }
    },
  },
});

export const {toggleStoreFlyer} = storeFlyersSlice.actions;
export default storeFlyersSlice.reducer;
