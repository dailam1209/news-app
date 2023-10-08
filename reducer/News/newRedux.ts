import {createSlice} from '@reduxjs/toolkit';
import {createAsyncThunk} from '@reduxjs/toolkit';
import { requestConfig } from '../../helpers/newApi';

export const fetchAllNews = createAsyncThunk('api/News', async () => {
  try {
    const reponse = await requestConfig('GET', '', null, 'api/news', {}, null, false)
    return reponse.data.listNew;
  } catch (error) {
    Error(error);
  }
});

export const fetchEmpty = createAsyncThunk('api/empty', async () => {
  try {
    return [];
  } catch (error) {
    Error(error);
  }
});

const listNewSlice = createSlice({
  name: 'listNew',
  initialState: {
    listNew: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllNews.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllNews.fulfilled, (state, action) => {
        state.listNew = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(fetchEmpty.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchEmpty.fulfilled, (state, action) => {
        state.listNew = [];
        state.isLoading = false;
      })
      .addCase(fetchEmpty.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});


export default listNewSlice.reducer;
