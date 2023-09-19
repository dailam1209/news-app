import {createSlice} from '@reduxjs/toolkit';

interface TongleState {
  tongle: boolean;
}

const initialState: TongleState = {
  tongle: false,
};
const tongleSlice = createSlice({
  name: 'tongle',
  initialState,
  reducers: {
    changeTongle(state, action) {
      state.tongle = action.payload;
    },
  },
});

export const {changeTongle} = tongleSlice.actions;

export default tongleSlice.reducer;
