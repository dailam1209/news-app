import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';

export interface ItermProps {
    iterm: any,
    onPress: () => void
}

const Iterm :React.FC<ItermProps> = ({ onPress, iterm })  => {

  return (
    <View style={styles.wrapper} key={iterm.id} >
      <TouchableOpacity onPress={onPress}>
        <Image
          source={{ uri: iterm.image }} 
          style={styles.webView}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 16,
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        backgroundColor: '#f0eded',
        borderRadius: 10,
    },
    webView: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      borderRadius: 10,
      margin: 20,
    },
});

export default Iterm;