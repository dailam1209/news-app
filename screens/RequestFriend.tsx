import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
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
import {COLORS, FONTS} from '../constants';
import UserImage = require('../assets/images/user-image.png');


export interface RequestFriendProps {
  token: any,
  isGet: boolean
}

const RequestFriend: React.FC<RequestFriendProps> = ({ isGet, token}) => {
  const [filteredUsers, setFilteredUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  

  const getData = async () => {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    if (token) {
      setIsLoading(true);
      await axios
        .get('https://news-1.onrender.com/get-all-request-add', config)
        .then(res => {
          setFilteredUsers(res.data.listUserRequest);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setFilteredUsers([]);
          console.log(error);
        });
    }
  };

  useEffect(() => {
        console.log('vao');
        setFilteredUsers([]);
        getData();
  }, []);

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
              source={item.image !== undefined ? {uri: `${item.image}`} : UserImage}
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
            <Text style={{fontSize: 14, marginBottom: 4, color: COLORS.secondaryGray}}>
              {item.email}
            </Text>
            <Text style={{fontSize: 14,  color: COLORS.secondaryGray}}>
              {/* {formatDate(item.date)} */}
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
              color: 'white'
            }}>
            Declines
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
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
              color: 'white'
            }}>
            Accept
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            left: 0,
            right: 0,
            top: -100,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(100, 100, 100, 0.6)',
          }}>
          <ActivityIndicator size="large" />
          <Text style={{fontSize: 18, marginTop: 12}}>Loading...</Text>
        </View>
      ) : (
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
      )}
    </SafeAreaView>
  );
};

export default RequestFriend;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    margin: 20,
    borderRadius: 10,
  },
  touch: {
    flex: 1,
    backgroundColor: '#3968d4',
    alignItems: 'center',
    margin: 10,
    height: '100%',
    borderRadius: 10,
  },
  button: {
    textAlign: 'center',
    height: 60,
    lineHeight: 60,
    fontSize: 16,
    color: COLORS.white,
  },
});
