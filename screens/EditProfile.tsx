import {useRef, useState, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import 'react-native-gesture-handler';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import UserImage = require('../assets/images/user-plus-image.png');
import {getLocalStorage} from '../untils/getLocalStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import RefreshTokenAgain from '../untils/handleRefreshToken';
import {useIsFocused} from '@react-navigation/native';

const snapPoints = ['48%'];

export default function EditProfile() {
  const isFocused = useIsFocused();

  const [selectImage, setSelectedImage] = useState<any>();

  const [username, setUsername] = useState<String>('lamdai');
  const [email, setEmail] = useState<String>('lamdia1209@gmail.com');
  const [phone, setPhone] = useState<any>('998483242643');
  const [token, setToken] = useState<String>();
  const [refreshToken, setRefreshToken] = useState<String>();
  const [idUser, setIdUser] = useState<String>();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const [image, setImage] = useState<any>('');
  const urlHost = '/update';
  const baseUrlGet = 'https://news-1.onrender.com/upload';

  const [isHaveImage, setIsHaveImage] = useState(false);
  const [imageData, setImageData] = useState(null);

  // get image in storage
  const getImage = async () => {
    const imageUser = await getLocalStorage('image');
    if (typeof imageUser === typeof 'string' && imageUser !== null) {
      setImage(imageUser.replace(/"/g, ''));
      setIsHaveImage(true);
    } else {
      setIsHaveImage(false);
      setImage(UserImage);
    }
  };

  // get userName in storage
  const getUsername = async () => {
    const name = await getLocalStorage('username');
    if (typeof name === typeof 'asdasdf' && name !== null) {
      setUsername(name.replace(/"/g, ''));
    } else {
      setUsername('');
    }
  };

  // get email in storage
  const getEmail = async () => {
    const emailUser = await getLocalStorage('email');
    if (typeof emailUser === typeof 'asdasdf' && emailUser !== null) {
      setEmail(emailUser.replace(/"/g, ''));
    } else {
      setEmail('');
    }
  };

  const getPhone = async () => {
    const phoneUser = await getLocalStorage('phone');
    if (typeof phoneUser === typeof 'asdasdf' && phoneUser !== null) {
      setPhone(phoneUser.replace(/"/g, ''));
    } else {
      setPhone('');
    }
  };

  const getToken = async () => {
    const tokenUser = await getLocalStorage('token');
    if (typeof tokenUser === typeof 'asdasdf' && tokenUser !== null) {
      setToken(tokenUser.replace(/"/g, ''));
    } else {
      setToken('');
    }
  };

  // get refresh token
  const getRefreshToken = async () => {
    const refreshTokenUser = await getLocalStorage('refresh-token');
    if (
      typeof refreshTokenUser === typeof 'asdasdf' &&
      refreshTokenUser !== null
    ) {
      setRefreshToken(refreshTokenUser.replace(/"/g, ''));
    } else {
      setRefreshToken('');
    }
  };

  // get id
  const id = async () => {
    const getId = await getLocalStorage('_id');
    if (typeof getId === typeof 'asdasdf' && getId !== null) {
      setIdUser(getId.replace(/"/g, ''));
    } else {
      setIdUser('');
    }
  };

  // change name
  const changeName = e => {
    setUsername(e);
  };

  // change email
  const changeEmail = e => {
    setEmail(e);
  };

  // change phone
  const changePhone = e => {
    setPhone(e);
  };


  function handlePresentModal() {
    addImage();
  }

  // for modal
  const handleClosePress = () => {
    bottomSheetModalRef.current?.close();
  };

  // change image
  const addImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
      // maxHeight: 200,
      // maxWidth: 200,
    });
    if (result.didCancel && result.didCancel == true) {
    } else {
      setImageData(result as any);
      setImage(result?.assets[0]?.uri as any);
    }
  };

  // submit profile
  const submmitUpdateProfile = async () => {
    setIsLoading(true);
    const photo = {
      uri: image,
      type: 'image/jpeg',
      name: 'name',
    };

    const form = new FormData();
    form.append('avatar', photo as any);
    form.append('username', username as string);
    form.append('phone', phone as any);
    form.append('email', email as string);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
    };
    try {
      const response = await axios.put(
        `https://news-1.onrender.com/upload/update/${idUser}`,
        form,
        config,
      );
      const data = await response.data.user[0];
      if (response.status == 200) {
        await AsyncStorage.setItem('username', JSON.stringify(data?.username));
        await AsyncStorage.setItem('image', JSON.stringify(data?.image));
        await AsyncStorage.setItem('email', JSON.stringify(data?.email));
        await AsyncStorage.setItem('phone', JSON.stringify(data?.phone));
        setIsLoading(false);
      }
    } catch (error) {
      if (error.message.slice(-3) == 401) {
        console.error('Sai o buoc 1:', error);
        const newConfig = {
          url: urlHost,
          method: 'put',
          baseURL: baseUrlGet,
          data: form,
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
          },
        };
        await RefreshTokenAgain(newConfig as any, refreshToken);
      } else {
        console.error('Sai o buoc 1:', error);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getImage();
    getUsername();
    getEmail();
    getPhone();
    getToken();
    id();
    getRefreshToken();
  }, [isFocused]);

  return (
    <GestureHandlerRootView style={{flex: 1, position: 'relative'}}>
      <View
        style={{
          marginTop: 20,
          height: '100vh',
        }}>
        {/*  image and name */}
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
          <TouchableOpacity
            onPress={() => handlePresentModal()}
            style={{
              width: 100,
              height: 100,
              borderColor: 'rgba(0, 0, 0, 0.5)',
              borderWidth: 2,
              borderRadius: 50,
              overflow: 'hidden',
              alignItems: 'center',
            }}>
            <Image
              source={isHaveImage ? {uri: `${image}`} : UserImage}
              resizeMode="cover"
              style={{
                height: 100,
                width: 100,
              }}
              imageStyle={{borderRadius: 50}}>
              {/* <View style={{
                width: 100,
                height: 100,
                position: 'absolute',
                alignItems: 'center'
              }}>
                  <CameraSVG
                    color=''
                    style={{
                      width:  50,
                      height: 100
                    }}
                  />
              </View> */}
            </Image>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 600,
              marginTop: 10,
            }}>
            {username}
          </Text>
        </View>
        {/* detail */}
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
          }}>
          <View
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              marginTop: 10,
              alignContent: 'center',
            }}>
            <Image
              source={{
                uri: 'https://img.icons8.com/fluency-systems-regular/48/000000/user--v1.png',
              }}
              resizeMode="contain"
              style={{
                height: 40,
                width: 24,
                borderRadius: 25,
                alignItems: 'center',
                marginRight: 8,
                tintColor: '#DE6C6C',
              }}
            />
            <View
              style={{
                height: 40,
              }}>
              <TextInput
                placeholder="Name"
                autoCorrect={false}
                value={username as string}
                onChange={value => changeName(value)}
                style={{
                  height: 40,
                  textAlign: 'left',
                  borderRadius: 8,
                  borderColor: '#e6edff',
                  borderWidth: 1,
                  paddingLeft: 10,
                }}
              />
            </View>
          </View>
          <View
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              marginTop: 10,
              alignContent: 'center',
            }}>
            <Image
              source={{
                uri: 'https://img.icons8.com/material-outlined/24/000000/new-post.png',
              }}
              resizeMode="contain"
              style={{
                height: 40,
                width: 24,
                borderRadius: 25,
                alignItems: 'center',
                marginRight: 8,
                tintColor: '#DE6C6C',
              }}
            />
            <View
              style={{
                height: 40,
              }}>
              <TextInput
                placeholder="Email"
                autoCorrect={false}
                value={email as string}
                onChange={value => changeEmail(value)}
                style={{
                  height: 40,
                  textAlign: 'left',
                  borderRadius: 8,
                  borderColor: '#e6edff',
                  borderWidth: 1,
                  paddingLeft: 10,
                }}></TextInput>
            </View>
          </View>
          <View
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              marginTop: 10,
              alignContent: 'center',
            }}>
            <Image
              source={{
                uri: 'https://img.icons8.com/fluency-systems-regular/48/000000/phone.png',
              }}
              resizeMode="contain"
              style={{
                height: 40,
                width: 24,
                borderRadius: 25,
                alignItems: 'center',
                marginRight: 8,
                tintColor: '#DE6C6C',
              }}
            />
            <View
              style={{
                height: 40,
              }}>
              <TextInput
                placeholder="Phone"
                keyboardType="number-pad"
                autoCorrect={false}
                value={phone}
                onChange={value => changePhone(value)}
                style={{
                  height: 40,
                  textAlign: 'left',
                  borderRadius: 8,
                  borderColor: '#e6edff',
                  borderWidth: 1,
                  paddingLeft: 10,
                }}></TextInput>
            </View>
          </View>
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
              <TouchableOpacity onPress={() => submmitUpdateProfile()}>
                {!isLoading && (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: 20,
                      padding: 6,
                      color: 'white',
                    }}>
                    Save
                  </Text>
                )}
                {isLoading && (
                  <ActivityIndicator
                    style={{
                      padding: 2,
                    }}
                    size="large"
                    color="white"
                  />
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
      <BottomSheetModalProvider>
        <View style={[styles.container]}>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{borderRadius: 20}}
            onDismiss={() => setIsOpen(false)}
            close={() => bottomSheetModalRef.current?.close()}
            style={{
              shadowColor: '#171717',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 0.2,
              shadowRadius: 3,
              zIndex: 20,
              opacity: 0.5,
              borderRadius: 20,
            }}>
            <TouchableOpacity
              onPress={() => handleClosePress()}
              style={{
                width: 24,
                height: 24,
                display: 'flex',
                marginLeft: 'auto',
                padding: 4,
                marginRight: 20,
              }}>
              <Image
                source={{
                  uri: 'https://img.icons8.com/material-two-tone/24/delete-sign.png',
                }}
                resizeMode="contain"
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 25,
                  backgroundColor: '#e3dcdc',
                }}
              />
            </TouchableOpacity>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
      {isOpen ? (
        <Pressable
          onPress={handleClosePress}
          style={{
            zIndex: 999999,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: '48%',
            backgroundColor: '#7f7f7f',
            opacity: 0.5,
          }}></Pressable>
      ) : (
        <></>
      )}
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 0.5,
    fontSize: 16,
  },
  subtitle: {
    color: '#101318',
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    color: '#56636F',
    fontSize: 13,
    fontWeight: 'normal',
    width: '100%',
  },
});
