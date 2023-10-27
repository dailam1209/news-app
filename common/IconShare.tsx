import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import { useAppSelector} from '../hooks/useHooks';
import  Share  from 'react-native-share';

const IconShare = () => {

  const url = useAppSelector((state) => state.url.url);
  // share
  const showValueContext = () => {
    onShare()
  };
  const onShare = async () => {
    const options = {
        message: url,
        // title: "I am sending you application that you may be interested"
    }
    Share.open(options).then(
    ).catch(err => console.log(err))
  };
  return (
    <View>
      <TouchableOpacity style={styles.icon} onPress={() => showValueContext()}>
        <Image
          source={{
            uri: 'https://img.icons8.com/fluency-systems-regular/48/share--v1.png',
          }}
          resizeMode="contain"
          style={{
            height: 30,
            width: 30,
            borderRadius: 25,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 20,
    fontSize: 30,
    lineHeight: 26,
    color: 'black',
  },
});

export default IconShare;
