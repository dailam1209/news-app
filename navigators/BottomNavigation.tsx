import {View, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, FONTS} from '../constants';
import {Chats, Contacts, More} from '../screens';
import Home from '../screens/Home';
import {ListIconBottomNavigation} from '../constants/BottomNavigation';
import Login from '../screens/Login';
import {useIsFocused} from '@react-navigation/native';
import {useAppSelector} from '../hooks/useHooks';
import IconShare from '../common/IconShare';

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

const BottomTabNavigation = ({navigation}) => {
  const isFocused = useIsFocused();
  const user = useAppSelector(state => state.user?.user);

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
        tabBarActiveTintColor: 'red',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          title: 'VietNam News Online',
          headerStyle: {
            backgroundColor: 'yellow',
          },
          headerRight: () => <IconShare />,
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
        name={'Contacts'}
        component={user ? Contacts : Login}
        options={{
          title: 'Chats',
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
        component={user ? Chats : Login}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
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
