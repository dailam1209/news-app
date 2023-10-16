import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {COLORS, FONTS, images } from '../constants';
import RightSVG from '../assets/misc/right-icon.svg';
import LogoutSVG from '../assets/misc/logout-icon.svg';
import  {REACT_APP_API_URL}  from '@env'
import { useAppDispatch, useAppSelector } from '../untils/useHooks';
import { changeUser } from '../reducer/User/userRedux';
import { ModalModule } from '../common/Modal';

const More = ({navigation}) => {
  const dispatch = useAppDispatch();
  const user  = useAppSelector((state) => state.user?.user);
  const [ showModal, setShowModal ] = useState(false);


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
          dispatch(changeUser(null))
          navigation.navigate('Home');
        }
      })
      .catch(error => {
        Alert.alert(`${error.message}`);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageContainer>
        {
          showModal && 
        <ModalModule title="Xác nhận đăng xuất thông tin." onPress1={() => setShowModal(!showModal) }  onPress2={() => {
          if (user) {
            clearAllData();
          }
        }}/>
        }
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
              source={{ uri : user?.image ? user?.image : images.noneUser}}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              paddingRight: 80,
              height: 80,
              justifyContent: 'center',
            }}>
            <Text style={{...FONTS.h4, marginVertical: 6}}>{user?.username}</Text>
            <Text style={{...FONTS.body3, color: COLORS.gray}}>{user?.email}</Text>
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
              if (user?.token) {
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
              if (user?.token) {
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
              <Text style={{...FONTS.h4, marginLeft: 12}}>Help</Text>
              <RightSVG width={20} height={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowModal(true)
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
