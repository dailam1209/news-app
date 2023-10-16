import {createSlice} from '@reduxjs/toolkit';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {getAllChat, getAllUser} from './userService';
import { requestConfig } from '../../helpers/newApi';


export const fetchAllFriend = createAsyncThunk('user/getFriend', async (user: any) => {
  try {
    // const data = await getAllUser('friend', user?.token, user._id);
    const data = await requestConfig("GET", user.token, null, `friend/${user._id}`, null, null, true);
    return data.data.users;
  } catch (error) {
    Error(error);
  }
});


export const fetchAllChats = createAsyncThunk('user/getAllChat', async (user: any) => {
  try {
    const data = await requestConfig("GET", user.token, null, 'get-chats', null, null, true)
    return data.data.lastMessageAll;
  } catch (error) {
    Error(error);
  }
});



interface userState {
  user: any,
  list: {
    friend: any,
    chat: any,
  },
  isLoading: boolean,
}

const initialState: userState = {
  user: null,
  list: {
    friend: [],
    chat: [],
  },
  isLoading: false,
}



const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUser (state, action) {
      state.user = action.payload;
    }
  },
  extraReducers: builder => {
    builder
    // get friends
      .addCase(fetchAllFriend.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFriend.fulfilled, (state, action) => {
        state.list.friend = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllFriend.rejected, (state, action) => {
        state.isLoading = false;
      })

      // get chats
      .addCase(fetchAllChats.pending, (state, action) => {
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.list.chat = action.payload;
      })
      .addCase(fetchAllChats.rejected, (state, action) => {
      })
  },
});

export const { changeUser } = userSlice.actions;



export default userSlice.reducer;
