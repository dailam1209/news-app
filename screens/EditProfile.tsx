import {useRef, useState, useEffect} from 'react';
import {ActivityIndicator, Alert, ImageBackground} from 'react-native';
import  {REACT_APP_API_URL}  from '@env'
import 'react-native-gesture-handler';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid
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
import InputField from '../components/InputFiled';
import Toast from 'react-native-toast-message';
import CameraSVG from '../assets/misc/camera-icon.svg';
import { getImage, getEmail, getId, getPhone, getToken, getUsername, getRefreshToken } from '../helpers/userApi';

const snapPoints = ['48%'];

export default function EditProfile() {
  
  const isFocused = useIsFocused();
  const [username, setUsername] = useState<String>('');
  const [email, setEmail] = useState<String>('');
  const [phone, setPhone] = useState<String>('');
  const [errorPhone, setErrorPhone] = useState<String>('');
  const [errorEmail, setErrorEmail] = useState<String>('');
  const [errorName, setErrorName] = useState<String>('');
  const [token, setToken] = useState<String>();
  const [refreshToken, setRefreshToken] = useState<String>();
  const [idUser, setIdUser] = useState<String>();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const [image, setImage] = useState<any>('');

  // change name
  const changeName = e => {
    setUsername(e);
  };
  const usernameOnblur = () => {
    if(username.length <= 4) {
      setErrorName('Please enter username more than 4 characters.');
      return false;
    } else {
      setErrorName('');
      setUsername(username)
      return true;
    }
  };

  // change email
  const emailChange = (e: string) => {
    setEmail(e);
  };

  //change phone
  const phoneChange = (value: string) => {
    console.log('phone change', value);
    setPhone(value);
  };

  // change phone
  const phoneOnblur = () => {
    console.log('onBlur', phone);
    let regexPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    console.log('regexPhone.test(phone as any)', regexPhone.test(phone as any));
    if (regexPhone.test(phone as string) === false && phone == '') {
      setErrorPhone('Please enter again phone number.');
      return false;
    } else {
      setErrorPhone('');
      setPhone(phone as string);
      return true;
    }
  };

  const emailOnblur = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email as string) === false) {
      setErrorEmail('Please enter email again.');
      return false;
    } else {
      setEmail('');
      setErrorEmail('');
      emailChange(email as string);
      return true;
    }
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
      // quality: 1,
      includeBase64: false,
      // maxHeight: 200,
      // maxWidth: 200,
    });
    if (result.didCancel && result.didCancel == true) {
    } else {
      setImage(result?.assets[0]?.uri as string);
    }
  };

  const getAllvalueLocal = async () => {
    let newImage = await getImage();
    let newId = await getId();
    let newToken = await getToken();
    let newRefreshToken = await getRefreshToken();
    let newPhone = await getPhone();
    let newUsername = await getUsername();
    let newEmail = await getEmail();
    setImage(newImage);
    setIdUser(newId as string);
    setToken(newToken);
    setRefreshToken(newRefreshToken as string);
    setPhone(newPhone as string);
    setUsername(newUsername as string);
    setEmail(newEmail as string);
  }

  // submit profile
  const submmitUpdateProfile = async () => {
    setIsLoading(true);
    const photo = {
      uri: image,
      type: 'image/jpeg',
      name: 'name',
    };

    const form = new FormData();
    console.log('phone', phone);
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
        `${REACT_APP_API_URL}/upload/update/${idUser}`,
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
      // if (error.message.slice(-3) == 401) {
      //   console.error('Sai o buoc 1:', error);
      //   const newConfig = {
      //     url: urlHost,
      //     method: 'put',
      //     baseURL: baseUrlGet,
      //     data: form,
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       'content-type': 'multipart/form-data',
      //     },
      //   };
      //   await RefreshTokenAgain(newConfig as any, refreshToken);
      // } else {

        console.error('Sai o buoc 1:', error);
      // }
      setIsLoading(false);
    }
  };


  useEffect(() => {
    getAllvalueLocal()
  }, [isFocused]);

  return (
    <GestureHandlerRootView style={{flex: 1, position: 'relative'}}>
      <View
        style={{
          marginTop: 20,
          height: 'auto',
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
            <ImageBackground
              source={image ? {uri: `${image}`} : UserImage}
              resizeMode="cover"
              style={{
                height: 100,
                width: 100,
              }}
              imageStyle={{borderRadius: 50}}>
              <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                width: 100,
                height: 100,
                position: 'absolute',
                alignItems: 'center',
              }}>
                  <CameraSVG
                    color='white'
                    style={{
                      width:  30,
                      height: 30
                    }}
                  />
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '600',
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
              width: '100%',
              height: 'auto',
              marginTop: 20,
              alignContent: 'center',
            }}>
            <Text style={styles.textAboveInput}>Username:</Text>
            <View
              style={{
                height: 40,
              }}>
              <InputField
                label={username}
                icon={
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/fluency-systems-regular/48/000000/user--v1.png',
                    }}
                    resizeMode="contain"
                    style={styles.image}
                  />
                }
                icon1={''}
                icon2={''}
                isChange={false}
                isBorderRadius={true}
                keyboardType={undefined}
                inputType={undefined}
                fieldButtonFunction={() => {}}
                value={username}
                error={errorName}
                onBlur={() => usernameOnblur()}
                valueChangeFunction={changeName}
              />
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: 'auto',
              marginTop: 20,
              alignContent: 'center',
            }}>
            <Text style={styles.textAboveInput} >Email:</Text>
            <View
              style={{
                height: 40,
              }}>
              <InputField
                label={email}
                icon={
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/material-outlined/24/000000/new-post.png',
                    }}
                    resizeMode="contain"
                    style={styles.image}
                  />
                }
                icon1={''}
                icon2={''}
                isChange={false}
                isBorderRadius={true}
                keyboardType="number-pad"
                inputType={Number}
                fieldButtonFunction={() => {}}
                value={email}
                error={errorEmail}
                onBlur={() => emailOnblur()}
                valueChangeFunction={emailChange}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              width: '100%',
              height: 'auto',
              marginTop: 20,
              alignContent: 'center',
            }}>
            <Text style={styles.textAboveInput}>Phone:</Text>
            <View>
              <InputField
                label={phone}
                icon={
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/fluency-systems-regular/48/000000/phone.png',
                    }}
                    resizeMode="contain"
                    style={styles.image}
                  />
                }
                icon1={''}
                icon2={''}
                isChange={false}
                isBorderRadius={true}
                keyboardType="number-pad"
                inputType={Number}
                fieldButtonFunction={() => {}}
                value={phone}
                error={errorPhone}
                onBlur={() => phoneOnblur()}
                valueChangeFunction={phoneChange}
              />
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
  image: {
    height: 40,
    width: 24,
    marginRight: 8,
    tintColor: '#DE6C6C',
  },
  input: {
    height: 40,
    textAlign: 'left',
    borderRadius: 8,
    borderColor: '#e6edff',
    borderWidth: 1,
    paddingLeft: 10,
  },
  textAboveInput: {
      fontSize: 16,
      fontWeight: '600'
  }
});
