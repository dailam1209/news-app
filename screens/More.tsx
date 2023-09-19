import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, { useState, useEffect } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {COLORS, FONTS} from '../constants';
import RightSVG from '../assets/misc/right-icon.svg';
import LogoutSVG from '../assets/misc/logout-icon.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserImage = require('../assets/images/user-image.png');
import { getLocalStorage } from '../untils/getLocalStorage';
import { useIsFocused } from '@react-navigation/native';

const More = ({navigation}) => {

  const isFocused = useIsFocused();

  const [ imageUser, setImageUser ] = useState<String>();
  const [ username, setUsername] = useState<String>();
  const [ email, setEmail ] = useState<String>();
  const [isHaveImage, setIsHaveImage ] = useState(false);

  // get image in storage
  const getImage = async () => {
    const image = await getLocalStorage('image');
    if (typeof image ===  typeof 'string' && image !== null) {
      setIsHaveImage(true);
      setImageUser(image.replace(/"/g, ''));
    } else {
      setIsHaveImage(false);
      setImageUser(UserImage);
    }
  };

  // get userName in storage
  const getUsername  = async () => {
    const name = await getLocalStorage('username');
    if (typeof name === typeof 'asdasdf' && name !== null) {
      setUsername(name.replace(/"/g, ''));
    } else {
      setUsername('');
    }
  };

  // get email in storage
  const getEmail  = async () => {
    const emailUser = await getLocalStorage('email');
    if (typeof emailUser === typeof 'asdasdf' && emailUser !== null) {
      setEmail(emailUser.replace(/"/g, ''));
    } else {
      setEmail('');
    }
  };

  const clearAllData = async () => {
    let keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.getAllKeys()
        .then(keys => AsyncStorage.multiRemove(keys))
        .then(() => alert('success'));
    navigation.navigate('Home')
};

useEffect(() => {
  getImage();
  getUsername();
  getEmail();
}, [isFocused]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 22,
            marginVertical: 22,
          }}>
          <Text style={{...FONTS.h4}}>More</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 22,
          }}>
          <View
            style={{
              height:80,
              width:80,
              borderRadius: 50,
              backgroundColor: COLORS.secondaryWhite,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 50,
                marginLeft: 10
              }}
              source={ isHaveImage ? {uri: `${imageUser}`} : UserImage}/>
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginRight: 50
            }}>
            <Text style={{...FONTS.h4, marginVertical: 6}}>
              {username}
            </Text>
            <Text style={{...FONTS.body3, color: COLORS.gray}}>
              {email}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log('pressed');
            }}>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 32,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProfileUser');
            }}
            style={styles.touch}>
            <View
              style={styles.touchTitle}>
              <Text style={{...FONTS.h4, marginLeft: 12}}>Account</Text>
              <RightSVG width={20} height={20}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Chats')
            }}
            style={styles.touch}>
            <View
              style={styles.touchTitle}>
              <Text style={{...FONTS.h4, marginLeft: 12}}>Chats</Text>
              <RightSVG width={20} height={20}/>
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => {
              console.log('Pressed');
            }}
            style={styles.touch}>
            <View
              style={styles.touchTitle}>
              
              <Text style={{...FONTS.h4, marginLeft: 12}}>Notifications</Text>
              <RightSVG width={20} height={20}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log('Pressed')
            }}
            style={styles.touch}>
            <View
              style={styles.touchTitle}>
              <Text style={{...FONTS.h4, marginLeft: 12}}>Help</Text>
              <RightSVG width={20} height={20}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>  clearAllData()}
            style={styles.touch}>
            <View
              style={[styles.touchTitle ]}>
              <Text style={{...FONTS.h4, marginLeft: 12, color: 'red'}}>
                Logout
              </Text>
              <LogoutSVG style={{
                marginLeft: 6,
                width: 20,
                height: 40
              }} 
              color={'red'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  touch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    paddingVertical: 12,
    height: 40,
    marginTop: 10
  },
  touchTitle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  }
})

export default More;
