import { createSlice } from '@reduxjs/toolkit';

interface UrlState {
    url: string;
}

const initialState: UrlState = {
    url : '',
}

const urlSlice = createSlice({
    name: 'url',
    initialState,
    reducers: {
        changeUrl(state, action) {
            state.url = action.payload
        }
    }
});

export const { changeUrl } = urlSlice.actions;

export default urlSlice.reducer;