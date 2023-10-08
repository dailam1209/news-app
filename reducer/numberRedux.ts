import {createSlice} from '@reduxjs/toolkit';

interface NumberState {
  number: Number;
}

const initialState: NumberState = {
  number: 0,
};

const numberSlice = createSlice({
  name: 'number',
  initialState,
  reducers: {
    changeNumber(state, action) {
      state.number = action.payload;
    },
    
  },
});

export const {changeNumber } = numberSlice.actions;
export default numberSlice.reducer;
