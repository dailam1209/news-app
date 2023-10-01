import {createSlice} from '@reduxjs/toolkit';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {getAllChat, getAllUser} from './userService';


export const fetchAllFriend = createAsyncThunk('user/getFriend', async () => {
  try {
    const data = await getAllUser('friend');
    return data.data.users;
  } catch (error) {
    Error(error);
  }
});

// export const fetchAllChats = createAsyncThunk('user/getAllChat', async () => {
//   try {
//     const data = await getAllChat('get-chats');
//     return data.data.lastMessageAll;
//   } catch (error) {
//     Error(error);
//   }
// });

export const fetchAllChats = createAsyncThunk('user/getAllChat', async () => {
  try {
    const data = await getAllChat('get-chats');
    console.log('data', data);
    return data.data.lastMessageAll;
  } catch (error) {
    Error(error);
  }
});



interface userState {
  list: {
    friend: any,
    chat: any,
  },
  isLoading: boolean,
}

const initialState: userState = {
  list: {
    friend: [],
    chat: [],
  },
  isLoading: false,
}



const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
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
        // state.isLoading = true;
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.list.chat = action.payload;
        // state.isLoading = false;
      })
      .addCase(fetchAllChats.rejected, (state, action) => {
        // state.isLoading = false;
      })
  },
});


export default UserSlice.reducer;
