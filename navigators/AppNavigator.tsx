import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from '../components/Home';
import Detail from '../components/Detail';
import IconShare from '../common/IconShare';
import BottomTabNavigation from './BottomNavigation';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import ChangePass from '../screens/ChangePass';
import { Chats, Contacts, More } from '../screens';
import ProfileUser from '../screens/ProfileUser';
import EditProfile from '../screens/EditProfile';
import PersonalChat from '../screens/PersonalChat';
import AddFriend from '../screens/AddFriend';

const Stack = createStackNavigator();

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    background: 'white',
    card: 'white',
    text: 'black',
    height: 80,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: 0,
    marginRight: 0,
    maxWidth: '100%',
  },
};

function AppNavigator() {
  const handleShareIcon = () => {
    console.log('share');
  };

  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'yellow',
          },
        }}
        initialRouteName="BottomTabNavigation">
        <Stack.Screen
          name="Home"
          options={{
            title: 'VietNam News Online',
            // headerShown: false,
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          }}
          component={Home}
        />
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
          options={({route}: any) => ({
            // headerShown: false,
            headerLargeTitle: true,
            title: 'VietNam News Online',
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={({route}: any) => ({
            headerLargeTitle: true,
            title: 'VietNam News Online',
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={({route}: any) => ({
            headerLargeTitle: true,
            title: 'VietNam News Online',
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="ChangePass"
          component={ChangePass}
          options={({route}: any) => ({
            headerLargeTitle: true,
            title: 'VietNam News Online',
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="ProfileUser"
          component={ProfileUser}
          options={{
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="PersonalChat"
          component={PersonalChat}
          options={{
            headerShown: false,
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="AddFriend"
          component={AddFriend}
          options={{
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="Detail"
          options={{
            title: 'VietNam News Online',
            headerRight: () => (
              <View>
                <TouchableOpacity onPress={() => handleShareIcon()}>
                  <IconShare />
                </TouchableOpacity>
              </View>
            ),
          }}
          component={Detail}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
