import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../untils/useHooks';
import {changeTongle} from '../reducer/tongleShareRedux';

const IconShare = () => {
  const isTrue = useAppSelector(state => state.tongle.tongle);

  const dispatch = useAppDispatch();
  const showValueContext = () => {
    console.log(isTrue);
    dispatch(changeTongle(true));
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
