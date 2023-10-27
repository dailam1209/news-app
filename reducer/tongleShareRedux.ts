import {createSlice} from '@reduxjs/toolkit';

interface TongleState {
  tongle: boolean;
  nextPage: number
}

const initialState: TongleState = {
  tongle: false,
  nextPage: 1,
};
const tongleSlice = createSlice({
  name: 'tongle',
  initialState,
  reducers: {
    changeTongle(state, action) {
      state.tongle = action.payload;
    },
    changeNextPage(state, action) {
      state.nextPage = action.payload;
    }
  },
});

export const {changeTongle, changeNextPage} = tongleSlice.actions;

export default tongleSlice.reducer;
