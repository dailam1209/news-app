import React from "react";
import { Text, View, StyleSheet, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppSelector } from "../untils/useHooks";

const Detail = ({ navigation  } : any) => {

  const handleNavigationStateChange = (navState: any) => {
    // This gets us the navstate which has the url of the newly loaded page
    console.log("aaaaaa",navState.url);
  };
  const injectedJs = `
  window.postMessage(window.location.href);
`;

  const url = useAppSelector((state) => state.url.url)
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: url }} // Replace with your desired URL
                style={styles.webview}
                onNavigationStateChange={(e) => handleNavigationStateChange(e)}
                onMessage={event => {
                  console.log(event.nativeEvent.data);
                }}
                onLoadStart={() => {
                  console.log("LOAD START ");
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
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    webview: {
      flex: 1,
    },
  });

export default Detail;