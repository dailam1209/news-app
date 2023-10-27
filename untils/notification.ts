import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

// request permission for notification message
export const requestUserPermission = async () => {
  let authStatus = await messaging().requestPermission();

  const enable =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enable) {
    getFcmToken();
  }
};

export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
        return token;
      }
    } catch (error) {
      console.log(`Can not get fcmToken ${error.message}`);
      return 0;
    }
};
