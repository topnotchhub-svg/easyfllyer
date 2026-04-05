// store/slices/eventSlice.js
import {createSlice} from '@reduxjs/toolkit';

const EventsSlice = createSlice({
  name: 'Events',
  initialState: [],
  reducers: {
    toggleEvents: (state, action) => {
      const flyer = action.payload;
      const index = state.findIndex(item => item.id === flyer.id);

      if (index !== -1) {
        state.splice(index, 1);
      } else {
        state.push(flyer);
      }
    },
  },
});

export const {toggleEvents} = EventsSlice.actions;
export default EventsSlice.reducer;
