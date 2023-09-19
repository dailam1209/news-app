import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, Text, TouchableOpacity, Image, ImageBackground} from 'react-native';
import EditSVG from '../assets/misc/edit-icon.svg';
import UserImage = require('../assets/images/user-image.png');
import { getLocalStorage } from '../untils/getLocalStorage';
import { useIsFocused } from '@react-navigation/native';

function ProfileUser({navigation}: any) {

  
  const isFocused = useIsFocused();
  const [ imageUser, setImageUser ] = useState<String>();
  const [ username, setUsername] = useState<String>();
  const [ email, setEmail ] = useState<String>();
  const [ phone, setPhone ] = useState<String>();

  const [isHaveImage, setIsHaveImage ] = useState(false);


  // get image in storage
  const getImage = async () => {
    const image = await getLocalStorage('image');
    console.log(image);
    if (typeof image ==  typeof 'string' && image !== null) {
      setImageUser(image.replace(/"/g, ''));
      setIsHaveImage(true);
    } else {
      setImageUser(UserImage);
      setIsHaveImage(false);
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

  const getPhone  = async () => {
    const phoneUser = await getLocalStorage('phone');
    if (typeof phoneUser === typeof 'asdasdf' && phoneUser !== null) {
      setPhone(phoneUser.replace(/"/g, ''));
    } else {
      setPhone('');
    }
  };

  useEffect(() => {
    getImage();
    getUsername();
    getEmail();
    getPhone();
  }, [isFocused]);
  
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 40,
          backgroundColor: '#e6edff',
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: 'center',
        }}>
        <Text
          style={{
            lineHeight: 40,
            fontSize: 16,
            fontWeight: '600',
          }}>
          About you
        </Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditProfile');
            }}>
            <EditSVG width={26} height={30} color="#627b90" />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 30,
          }}>
          <Image
            source={ isHaveImage ? {uri: `${imageUser}`} : UserImage}
            resizeMode="contain"
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 19,
            marginTop: 8,
            fontWeight: '700',
          }}>
          {username}
        </Text>
        <Text
          style={{
            fontSize: 14,
            marginTop: 2,
          }}>
          {email}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          height: 40,
          backgroundColor: '#e6edff',
          marginTop: 30,
        }}>
        <Text
          style={{
            lineHeight: 40,
            marginLeft: 20,
            fontSize: 16,
            fontWeight: '600',
          }}>
          Detail{' '}
        </Text>
      </View>
      <View
        style={{
          marginTop: 20,
          marginLeft: 20,
          marginRight: 20,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            borderBottomColor: '#e6edff',
            borderBottomWidth: 1,
            height: 40,
          }}>
          <Image
            source={{
              uri: 'https://img.icons8.com/fluency-systems-regular/48/000000/user--v1.png',
            }}
            resizeMode="contain"
            style={{
              height: 30,
              width: 24,
              borderRadius: 25,
              alignItems: 'center',
              marginRight: 8,
              tintColor: '#DE6C6C',
            }}
          />

          <Text
            style={{
              fontSize: 16,
              marginBottom: 15,
              height: 30,
              lineHeight: 30,
              textAlign: 'center',
            }}>
            {username}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            borderBottomColor: '#e6edff',
            borderBottomWidth: 1,
            height: 40,
            marginTop: 10,
          }}>
          <Image
            source={{
              uri: 'https://img.icons8.com/material-outlined/24/000000/new-post.png',
            }}
            resizeMode="contain"
            style={{
              height: 30,
              width: 24,
              borderRadius: 25,
              alignItems: 'center',
              marginRight: 8,
              tintColor: '#DE6C6C',
            }}
          />
          <Text
            style={{
              fontSize: 16,
              marginBottom: 15,
              height: 30,
              lineHeight: 30,
              textAlign: 'center',
            }}>
            {email}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            borderBottomColor: '#e6edff',
            borderBottomWidth: 1,
            height: 40,
            marginTop: 10,
          }}>
          <Image
            source={{
              uri: 'https://img.icons8.com/fluency-systems-regular/48/000000/phone.png',
            }}
            resizeMode="contain"
            style={{
              height: 30,
              width: 24,
              borderRadius: 25,
              alignItems: 'center',
              marginRight: 8,
              tintColor: '#DE6C6C',
            }}
          />
          <Text
            style={{
              fontSize: 16,
              marginBottom: 15,
              height: 30,
              lineHeight: 30,
              textAlign: 'center',
            }}>
            {phone}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ProfileUser;
