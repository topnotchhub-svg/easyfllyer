// store/slices/brandSlice.js
import {createSlice} from '@reduxjs/toolkit';

const brandFlyersSlice = createSlice({
  name: 'brandFlyers',
  initialState: [],
  reducers: {
    toggleBrandFlyer: (state, action) => {
      const flyer = action.payload;
      const index = state.findIndex(item => item.id === flyer.id);
      if (index !== -1) {
        state.splice(index, 1);
      } else {
        state.push(flyer);
      }
    },
    setBrandFlyers: (state, action) => {
      return action.payload;
    },
  },
});

export const { toggleBrandFlyer, setBrandFlyers } = brandFlyersSlice.actions;
export default brandFlyersSlice.reducer;
