import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

function Loading() {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}>
      <ActivityIndicator size="large" />
      <Text
        style={{
          fontSize: 18,
          marginTop: 12,
        }}>
        Loading...
      </Text>
    </View>
  );
}

export default Loading;