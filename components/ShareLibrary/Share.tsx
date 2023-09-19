import React from 'react';
import {Alert,  View, Button, StyleSheet} from 'react-native';
import  Share  from 'react-native-share';

const ShareExample = () => {
  const onShare = async () => {
    const options = {
        message: 'https://baomoi.vn'
    }
    Share.open(options).then(
        res => console.log(res)
    ).catch(err => console.log(err))
  };
  return (
    <View style={styles.share}>
      <Button onPress={onShare} title="Share" />
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
      color: 'green'
    },
    textClicked: {
      color: 'red',
      textDecorationLine: 'underline',
    },
    modal: {
      height: 200
    },
    share: {
    }
  });

export default ShareExample;