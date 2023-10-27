import {createSlice} from '@reduxjs/toolkit';

interface NumberState {
  number: any;
}

const initialState: NumberState = {
  number: {},
};

const numberSlice = createSlice({
  name: 'number',
  initialState,
  reducers: {
    changeRoom(state, action) {
      state.number = action.payload;
    },
    
  },
});

export const {changeRoom } = numberSlice.actions;
export default numberSlice.reducer;
