import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import {WebView} from 'react-native-webview';
import {useAppSelector, useAppDispatch} from '../hooks/useHooks';
import {changeUrl} from '../reducer/Url/urlRedux';

const Detail = () => {
  const dispatch = useAppDispatch();
  const url = useAppSelector(state => state.url.url);

  const handleNavigationStateChange = (navState: any) => {
    dispatch(changeUrl(navState.url));
  };
  const injectedJs = `window.postMessage(window.location.href);`;

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: url}} // Replace with your desired URL
        style={styles.webview}
        onNavigationStateChange={e => handleNavigationStateChange(e)}
        onMessage={event => {
          console.log(event.nativeEvent.data);
        }}
        onLoadStart={() => {
          console.log('LOAD START ');
        }}
        onLoadEnd={() => {
          console.log('LOAD END');
        }}
        onError={err => {
          console.log('ERROR ');
          console.log(err);
        }}
        injectedJavaScript={injectedJs}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabledAndroid={true}
        javaScriptEnabled={true}
        bounces={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default Detail;
