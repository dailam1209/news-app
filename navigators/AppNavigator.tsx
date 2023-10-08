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
import ProfileUser from '../screens/ProfileUser';
import EditProfile from '../screens/EditProfile';
import PersonalChat from '../screens/PersonalChat';
import AddFriend from '../screens/AddFriend';
import AddGroup from '../screens/AddGroup';

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
    <NavigationContainer theme={customTheme} >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'yellow',
          },
          headerRight: () => (
            <IconShare />
      ),
        }}
        initialRouteName="BottomTabNavigation">
        <Stack.Screen
          name="Home"
          options={{
            title: 'VietNam News Online',
          }}
          component={Home}
        />
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
          options={({route}: any) => ({
            headerLargeTitle: true,
            title: 'VietNam News Online',
          })}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={({route}: any) => ({
            headerLargeTitle: true,
            
            title: 'VietNam News Online',
          })}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={({route}: any) => ({
            headerLargeTitle: true,
            title: 'VietNam News Online',
          })}
        />
        <Stack.Screen
          name="ChangePass"
          component={ChangePass}
          options={({route}: any) => ({
            headerLargeTitle: true,
            headerShown: false,
            title: 'VietNam News Online',
            headerRight: () => (
                  <IconShare />
            ),
          })}
        />
        <Stack.Screen
          name="ProfileUser"
          component={ProfileUser}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen
          name="AddGroup"
          component={AddGroup}
        />
        <Stack.Screen
          name="PersonalChat"
          options={({route}: any) => ({
            headerShown: false,
          })}
          component={PersonalChat}
        />
        <Stack.Screen
          name="AddFriend"
          component={AddFriend}
        />

        <Stack.Screen
          name="Detail"
          options={{
            title: 'VietNam News Online',
          }}
          component={Detail}
        />
        <Stack.Screen
          name="Login"
          options={{
            title: 'VietNam News Online',
          }}
          component={Login}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
