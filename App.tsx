import React, {useEffect, useState, createContext, useContext, useRef} from 'react';
import {AppState, StyleSheet, View, Text} from 'react-native';
import AppNavigator from './navigators/AppNavigator';
import ModalShare from './common/ModelShare';
import { getLocalStorage } from './untils/getLocalStorage';

import {useAppDispatch, useAppSelector} from './untils/useHooks';
import tongleShareRedux, {changeTongle} from './reducer/tongleShareRedux';
import SplashScreen from 'react-native-splash-screen';
import { fetchAllNews, fetchEmpty} from './reducer/News/newRedux';
import axios from 'axios';
import { getFcmToken } from './untils/notification';
import { changeUrl } from './reducer/Url/urlRedux';
import { REACT_APP_API_URL } from '@env';

const App = () => {

  // state AppState
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [ token, setToken ] = useState<String>('');

  // get token
  const getToken = async () => {
    const tokenUser = await getLocalStorage('token');
    if (typeof tokenUser === typeof 'asdasdf' && tokenUser !== null) {
        setToken(tokenUser.replace(/"/g, ''));
        return tokenUser.replace(/"/g, '');
    } else {
      setToken('');
      return '';
    }
  };

  // post request online or offline
  const postOnline = async (isOnline: boolean) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
  };
    const data = {
      "state": isOnline 
    }
    
    await axios.post(
      `${REACT_APP_API_URL}/online`,
      data,
      config
      
    );
  };

  // tongle share show and hidden
  const isTongle = useAppSelector(state => state.tongle.tongle);
  const dispatch = useAppDispatch();

  // get data news to show 
  const getData = async () => {
    dispatch(fetchAllNews());
  };

  // put fcm-token to update can send notification when have message
  const putFcmToken = async (token: string, fcmToken: any) => {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    await axios
      .put(`${REACT_APP_API_URL}/fcm-token`, {
        "fcmToken": fcmToken
      }, config)
      .then(async response => {
        if (response.status == 200) {
          console.log('put fcmToken success.');
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  }

 

  useEffect(() => {
    // splashScreen when start
    SplashScreen.hide();
    ( async  () => {
      await getData();
      const getTokenUser = await getToken();
      const fcmToken = await getFcmToken();
      await putFcmToken(getTokenUser, fcmToken);
      
      // tongle false when load app again
      dispatch(changeTongle(false));
    })()

    //change isOnline of User
    const subscription = AppState.addEventListener("change", async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // await postOnline(true)
      } else {
        // await postOnline(false)
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <React.Fragment>
      <AppNavigator />
      {isTongle ? (
        <View>
          <ModalShare />
        </View>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  textClicked: {
    color: 'red',
    textDecorationLine: 'underline',
  },
  modal: {
    height: 200,
  },
});

export default App;
