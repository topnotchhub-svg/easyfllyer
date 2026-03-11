import {createSlice} from '@reduxjs/toolkit';

const EventsSlice = createSlice({
  name: 'Events',
  initialState: [],
  reducers: {
    toggleEvents: (state, action) => {
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

export const {toggleEvents} = EventsSlice.actions;
export default EventsSlice.reducer;
