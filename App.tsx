import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  AppState,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import AppNavigator from './navigators/AppNavigator';
import ModalShare from './common/ModelShare';

import {useAppDispatch, useAppSelector} from './hooks/useHooks';
import {changeTongle} from './reducer/tongleShareRedux';
import SplashScreen from 'react-native-splash-screen';
import {fetchAllNews, fetchEmpty} from './reducer/News/newRedux';
import {getFcmToken} from './untils/notification';
import {requestConfig} from './helpers/newApi';
import messaging from '@react-native-firebase/messaging';
import { COLORS } from './constants';
import notifee from '@notifee/react-native';


const App = () => {
  // state AppState
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const user = useAppSelector(state => state.user.user);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  
  

  // post request online or offline
  const postOnline = async (isOnline: boolean) => {
    const data = {
      state: isOnline,
    };

    await requestConfig("POST", user.token, null, "online", data, null, true )
  };

  // tongle share show and hidden
  const isTongle = useAppSelector(state => state.tongle.tongle);
  const dispatch = useAppDispatch();

  // get data news to show
  const getData = async () => {
    dispatch(fetchAllNews());
  };

  // put fcm-token to update can send notification when have message
  const putFcmToken = async (fcmToken: string) => {
    await requestConfig(
      'PUT',
      user.token,
      null,
      'fcm-token',
      {
        fcmToken: fcmToken,
      },
      null,
      true,
    );
  };

  useEffect(() => {
    // splashScreen when start
    SplashScreen.hide();
    (async () => {
      await getData();
      const fcmToken = await getFcmToken();
      await putFcmToken(fcmToken as string);

      // tongle false when load app again
      dispatch(changeTongle(false));
    })();

    //change isOnline of User
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
       
        if (
          nextAppState == 'active'
        ) {
          await postOnline(true);
        } else {
          await postOnline(false);
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
      },
    );

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const notifi = remoteMessage.notification;
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'main channel',
      })

      // Display a notification
      await notifee.displayNotification({
        title: notifi.title,
        body: notifi.body,
        data: notifi.data,
        android: {
          channelId,
          localOnly: true,
          pressAction: {
            id: 'default',
          },
        },
      })
    });

    return () => {
      subscription.remove();
      unsubscribe;
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        width: width,
        height: height,
        backgroundColor: 'blue',
      }}>
        <StatusBar
        backgroundColor={COLORS.yellow}
        barStyle="light-content" 
      />
      <AppNavigator />
      {isTongle ? (
        <View>
          <ModalShare />
        </View>
      ) : (
        <></>
      )}
    </View>
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
// function completion(
//   notification: Notification,
//   completion: (response: NotificationCompletion) => void,
// ): void {
//   throw new Error('Function not implemented.');
// }
