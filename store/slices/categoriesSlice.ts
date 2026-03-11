import {createSlice} from '@reduxjs/toolkit';

interface Category {
  name: string;
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: [] as Category[],
  reducers: {
    toggleCategory: (state, action) => {
      const categoryName = action.payload;
      const index = state.findIndex((item: any) => item.name === categoryName);

      if (index !== -1) {
        // Remove category if it exists (unselect)
        state.splice(index, 1);
      } else {
        // Add category if it doesn't exist (select)
        state.push({name: categoryName});
      }
    },
  },
});

export const {toggleCategory} = categoriesSlice.actions;
export default categoriesSlice.reducer;
