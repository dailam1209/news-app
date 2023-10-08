import {configureStore, combineReducers} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import urlRedux from './Url/urlRedux';
import tongleShareRedux from './tongleShareRedux';
import numberRedux from './numberRedux';
import newRedux from './News/newRedux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userRedux from './User/userRedux';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  url: urlRedux,
  tongle: tongleShareRedux,
  number: numberRedux,
  listNew: newRedux,
  user: userRedux
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
export const store = configureStore({
  reducer: persistedReducer,
  // middleware: [thunk],
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type AppDispatch = typeof store.dispatch;
export let persistor = persistStore(store);
