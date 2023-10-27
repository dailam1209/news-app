import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {COLORS, FONTS, images} from '../constants';
import { AnimatedToast } from '../common/AnimatedToast';
import { formatDate } from '../untils/formatDate';
import { requestConfig } from '../helpers/newApi';

export interface RequestFriendProps {
  listUser: any;
  token: any;
}

const RequestFriend: React.FC<RequestFriendProps> = ({listUser, token}) => {
  const [filteredUsers, setFilteredUsers] = useState<any>(listUser);
  const [ showAnimatedToast, setShowAnimatedToast ] = useState<any>(false);

  const acceptAddFriend = async (id: string) => {
    const add = await requestConfig("POST", token, null, `accept-friend/${id}`,null, null, true);
    if (add.status == 200) {
      const newData = filteredUsers.filter((item) => item._id !== id);
      setFilteredUsers(newData); 
      setShowAnimatedToast(true)
    }
  };


  const renderItem = ({item, index}: any) => (
    <View
      style={[
        {
          flexDirection: 'row',
        },
        index % 2 !== 0
          ? {
              backgroundColor: COLORS.tertiaryWhite,
            }
          : null,
      ]}>
      <View
        style={{
          flex: 1,
        }}>
        <TouchableOpacity
          key={index}
          onPress={() => {}}
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 22,
            borderBottomColor: COLORS.secondaryWhite,
            borderBottomWidth: 1,
          }}>
          <View
            style={{
              paddingVertical: 15,
              marginRight: 10,
            }}>
            <Image
              source={{
                uri: item.image !== '' && item.image !== undefined
                ? item.image
                : images.noneUser
              }}
              resizeMode="contain"
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text style={{...FONTS.h4}}>{item.username}</Text>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 4,
                color: COLORS.secondaryGray,
              }}>
              {item.email}
            </Text>
            <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
              {item.date ? formatDate(item.date) : ''}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: 70,
            height: 40,
            backgroundColor: '#d6c9c9',
            borderRadius: 4,
            marginRight: 16,
            alignItems: 'center',
            paddingLeft: 4,
            paddingRight: 4,
          }}>
          <Text
            style={{
              width: '100%',
              height: 40,
              lineHeight: 40,
              textAlign: 'center',
              color: 'white',
            }}>
            Declines
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => acceptAddFriend(item._id)}
          style={{
            width: 70,
            height: 40,
            backgroundColor: '#3968d4',
            borderRadius: 4,
            marginRight: 16,
            alignItems: 'center',
            paddingLeft: 4,
            paddingRight: 4,
          }}>
          <Text
            style={{
              width: '100%',
              height: 40,
              lineHeight: 40,
              textAlign: 'center',
              color: 'white',
            }}>
            Accept
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
     <AnimatedToast warring={false} show={showAnimatedToast} onPress={() => setShowAnimatedToast(false)} text='Đã thêm bạn mới thành công.'/>
    <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            paddingBottom: 100,
          }}>
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={item => item._id.toString()}
          />
        </View>
    </SafeAreaView>
    </>
  );
};

export default RequestFriend;

