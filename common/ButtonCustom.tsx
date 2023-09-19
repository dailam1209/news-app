import React, {useState} from 'react';
import {Text, SafeAreaView, View, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ButtonProps {
    title: string
}

const ButtonCustom: React.FC<ButtonProps> = ({title}) => {
  return (
    <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 25,
            width: '100%',
            height: 40,
            marginTop: 50,
            marginBottom: 40,
          }}>
          <LinearGradient
            colors={['#AED6F1', '#3498DB']}
            style={{
              display: 'flex',
              width: '100%',
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 20,
            }}>
            <TouchableOpacity>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 20,
                  padding: 4,
                  color: 'white',
                }}>
                {title}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
  )
}

export default ButtonCustom