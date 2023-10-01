import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTS} from '../constants';
import {Chats, Contacts, More} from '../screens';
import Home from '../components/Home';
import {ListIconBottomNavigation} from '../constants/BottomNavigation';
import ProfileUser from '../screens/ProfileUser';
import EditProfile from '../screens/EditProfile';
import Login from '../screens/Login';
import { getLocalStorage } from '../untils/getLocalStorage';
import { useIsFocused } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export interface IconTabProps {
  focused: boolean;
  url: string;
}

const IconTab: React.FC<IconTabProps> = ({focused, url}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {focused ? (
        <>
          <Image
            source={{uri: url}}
            resizeMode="contain"
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          />
        </>
      ) : (
        <Image
          source={{uri: url}}
          resizeMode="contain"
          style={{
            height: 30,
            width: 30,
            borderRadius: 25,
          }}
        />
      )}
    </View>
  );
};

const BottomTabNavigation = ({ navigation }) => {
  const [ haveUser, setHaveUser ] = useState(false);
  const isFocused = useIsFocused();

  const getToken = async () => {
    let token = await getLocalStorage('token');
    if(token) {
      setHaveUser(true);
    } else {
      setHaveUser(false);
    }
  };

  useEffect(() => {
    getToken();
  }, [])

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLORS.white,
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}: any) => {
            return (
              <IconTab
                focused={focused}
                url={ListIconBottomNavigation[0].url}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={"Contacts"}
        component={haveUser ? Contacts : Login}
        listeners={{
          tabPress: () => {
            getToken();
          },
        }}
        options={{
          title:  "Chats" ,
          headerShown: false,
          tabBarIcon: ({focused}: any) => {
            return (
              <IconTab
                focused={focused}
                url={ListIconBottomNavigation[1].url}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Chats"
        component={haveUser ? Chats : Login}
        listeners={{
          tabPress: () => {
            getToken();
          },
        }}
        options={{
            headerShown: false,
            headerTitleAlign: "center",
          tabBarIcon: ({focused}: any) => {
            return (
              <IconTab
                focused={focused}
                url={ListIconBottomNavigation[2].url}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{
          tabBarIcon: ({focused}: any) => {
            return (
              <IconTab
                focused={focused}
                url={ListIconBottomNavigation[3].url}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
