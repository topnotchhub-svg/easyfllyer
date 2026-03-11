import {createSlice} from '@reduxjs/toolkit';

const brandFlyersSlice = createSlice({
  name: 'brandFlyers',
  initialState: [],
  reducers: {
    toggleBrandFlyer: (state, action) => {
      const flyer = action.payload;
      console.log('🚀 Before Update State:', JSON.stringify(state));
      const index = state.findIndex(item => item.id === flyer.id);

      if (index !== -1) {
        // Remove the flyer if it exists
        state.splice(index, 1);
      } else {
        // Add the flyer if it doesn't exist
        state.push(flyer);
      }
      console.log('🚀 After Update State:', JSON.stringify(state));
    },
  },
});

export const {toggleBrandFlyer} = brandFlyersSlice.actions;
export default brandFlyersSlice.reducer;
