import {AppRegistry} from 'react-native';
import App from './App';
import { LogBox } from 'react-native';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import { store, persistor } from './reducer/store';
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';


ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);

messaging().setBackgroundMessageHandler( async message => {
    console.log(message);
})

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const ReduxProvider = () => {
    return(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    )
}
AppRegistry.registerComponent(appName, () => ReduxProvider);

