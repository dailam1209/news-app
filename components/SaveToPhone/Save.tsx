import { StyleSheet, Button, View, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

export default function Save() {
  const downloadFromUrl = async () => {
    const filename = "small.mp4";
    const result = await FileSystem.downloadAsync(
      'http://techslides.com/demos/sample-videos/small.mp4',
      FileSystem.documentDirectory + filename
    );
    console.log(result);

    // save(result.uri, filename, result.headers["Content-Type"]);
  };

  const downloadFromAPI = async () => {
    const filename = "MissCoding.pdf";
    const localhost = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
    const result = await FileSystem.downloadAsync(
      `http://${localhost}:5000/generate-pdf?name=MissCoding&email=hello@tripwiretech.com`,
      FileSystem.documentDirectory + filename,
      {
        headers: {
          "MyHeader": "MyValue"
        }
      }
    );
    console.log(result);
    // save(result.uri, filename, result.headers["Content-Type"]);
  };



  return (
    <View style={styles.container}>
      <Button title="Download From URL" onPress={downloadFromUrl} />
      <Button title="Download From API" onPress={downloadFromAPI} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});