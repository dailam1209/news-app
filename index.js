/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import { LogBox } from 'react-native';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import { store, persistor } from './reducer/store';
import { PersistGate } from 'redux-persist/integration/react'

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
