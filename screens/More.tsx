import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLocalStorage} from '../untils/getLocalStorage';
import {useIsFocused} from '@react-navigation/native';
import {getUsername, getToken, getEmail, getImage} from '../helpers/userApi';
import {COLORS, FONTS} from '../constants';
import RightSVG from '../assets/misc/right-icon.svg';
import LogoutSVG from '../assets/misc/logout-icon.svg';
import UserImage = require('../assets/images/user-image.png');
import  {REACT_APP_API_URL}  from '@env'

const More = ({navigation}) => {
  const isFocused = useIsFocused();

  const [imageUser, setImageUser] = useState<String>('');
  const [username, setUsername] = useState<String>('');
  const [email, setEmail] = useState<String>('');
  const [token, setToken] = useState<String>('');

  // clear all data when logout
  const clearAllData = async () => {
    await axios({
      method: 'post',
      url: `${REACT_APP_API_URL}/logout`,
      headers: {},
      data: {},
    })
      .then(async res => {
        if (res.status == 200) {
          await AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => alert('success'));
          navigation.navigate('Home');
          Alert.alert('Logout success.');
        }
      })
      .catch(error => {
        Alert.alert(`${error.message}`);
      });
  };

  const getLocal = async () => {
    let newImage = await getImage();
    let newUsername = await getUsername();
    let newToken = await getToken();
    let newEmail = await getEmail();
    setImageUser(newImage ? newImage : '');
    setUsername(newUsername ? newUsername : '');
    setToken(newToken);
    setEmail(newEmail ? newEmail : '');
  };

  useEffect(() => {
    getLocal();
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
              height: 80,
              width: 80,
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
              }}
              source={imageUser ? {uri: `${imageUser}`} : UserImage}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              paddingRight: 80,
              height: 80,
              justifyContent: 'center',
            }}>
            <Text style={{...FONTS.h4, marginVertical: 6}}>{username}</Text>
            <Text style={{...FONTS.body3, color: COLORS.gray}}>{email}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log('pressed');
            }}></TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 32,
          }}>
          <TouchableOpacity
            onPress={() => {
              if (token && username) {
                navigation.navigate('ProfileUser');
              } else {
                navigation.navigate('Login');
              }
            }}
            style={styles.touch}>
            <View style={styles.touchTitle}>
              <Text style={{...FONTS.h4, marginLeft: 12}}>Account</Text>
              <RightSVG width={20} height={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (token && username) {
                navigation.navigate('Chats');
              } else {
                navigation.navigate('Login');
              }
            }}
            style={styles.touch}>
            <View style={styles.touchTitle}>
              <Text style={{...FONTS.h4, marginLeft: 12}}>Chats</Text>
              <RightSVG width={20} height={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log('Pressed');
            }}
            style={styles.touch}>
            <View style={styles.touchTitle}>
              <Text style={{...FONTS.h4, marginLeft: 12}}>Notifications</Text>
              <RightSVG width={20} height={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log('Pressed');
            }}
            style={styles.touch}>
            <View style={styles.touchTitle}>
              <Text style={{...FONTS.h4, marginLeft: 12}}>Help</Text>
              <RightSVG width={20} height={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (token && username && email) {
                clearAllData();
              }
            }}
            style={styles.touch}>
            <View style={[styles.touchTitle]}>
              <Text style={{...FONTS.h4, marginLeft: 12, color: 'red'}}>
                Logout
              </Text>
              <LogoutSVG
                style={{
                  marginLeft: 6,
                  width: 20,
                  height: 40,
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
    marginTop: 10,
  },
  touchTitle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
});

export default More;
