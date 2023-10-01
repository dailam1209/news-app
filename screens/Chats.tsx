import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {FONTS, COLORS} from '../constants';
import {contacts} from '../constants/data';
import {getLocalStorage} from '../untils/getLocalStorage';
import UserImage = require('../assets/images/user-image.png');
import AcceptSVG from '../assets/misc/accepct-icon.svg';
import { formatTime} from '../untils/formatDate';
import {socket} from '../config/config';
import {useAppDispatch, useAppSelector} from '../untils/useHooks';
import { fetchAllChats, fetchAllFriend } from '../reducer/User/userRedux';
import { useSelector } from 'react-redux';
import { checkHaveRoom, createMessageApi } from '../reducer/User/userService';
import { getImage, getToken, getUsername } from '../helpers/userApi';
import Iterm from '../components/Iterm';
import  {REACT_APP_API_URL}  from '@env'


const Chats: React.FC<{navigation: any}> = ({navigation}) => {

  const dispatch = useAppDispatch();
  const friends = useSelector((state: any) => state.user.list.friend);
  const chats = useAppSelector((state: any) => state.user.list.chat);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  console.log('chats', chats);

  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const [username, setUsername] = useState<String>('');
  const [idUser, setIdUser] = useState<String>();
  const [ token, setToken ] = useState<String>();

  const id = async () => {
    const getId = await getLocalStorage('_id');
    if (typeof getId === typeof 'asdasdf' && getId !== null) {
      setIdUser(getId.replace(/"/g, ''));
      return getId.replace(/"/g, '');
    } else {
      setIdUser('');
      return 0;
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = chats.filter(user =>
      user.userName.toLowerCase().includes(text.toLowerCase()),
    );
    // setFilteredUsers(filteredData as any);
  };

  const getImageUser = async () => {
      const image = await getImage();
  };

  const onRoom = async (idRoom: string) => {
    axios
      .post(
        `${REACT_APP_API_URL}/on-room/${idRoom}`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(response => {
        if (response.status == 200) {
          // Alert.alert('vao phong');
        }
      })
      .catch(error => {
        Alert.alert(`${error.message}`);
      });
  };

  const checkhaveRoomInDatabase = async (received, idOfUser, item) => {
    const idOfRoom = await checkHaveRoom(received, idOfUser, [], '');
    if(idOfRoom) {
      navigation.navigate('PersonalChat', {
        userName: item.username,
        idReciever:item.id,
        roomId: idOfRoom,
        imageRecever: item.image,
        fcmReciever: item.fcmToken,
        isOnline: item.isOnline,
      });
    }
  }

  const fetchData = async () => {
    const name = await getUsername();
    const newToken = await getToken();
    setToken(newToken);
    setUsername(name as string)
    try {
      await Promise.all([
        dispatch(fetchAllChats()),
        dispatch(fetchAllFriend()),
      ]);
    } catch (error) {
      console.error('Error dispatching actions:', error);
    }
  };

  useEffect(() => {
    fetchData();
    if (isFocused) {
      (async () => {
        const idOfUser = await id();
        socket.connect();
        socket.emit('connected', idOfUser);
      })();
    }
  }, [isFocused]);

  const renderItem = ({item, index}: any) => (
    <TouchableOpacity
      key={index}
      onPress={async () => {
        await onRoom(item.roomId);
        navigation.navigate('PersonalChat', {
          userName: item.username,
          // idReciever: item.reciever !== idUser ? item.reciever : item.sender,
          idReciever: item.reciever ,
          imageRecever: item.image,
          roomId: item.roomId,
          fcmReciever: item.fcmToken,
          isOnline: item.isOnline,
        });
      }}
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 22,
          borderBottomColor: COLORS.secondaryWhite,
          borderBottomWidth: 1,
        },
        index % 2 !== 0
          ? {
              backgroundColor: COLORS.tertiaryWhite,
            }
          : null,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View
            style={{
              paddingVertical: 15,
              marginRight: 22,
            }}>
            {item?.isOnline == false && (
              <View
                style={{
                  height: 14,
                  width: 14,
                  borderRadius: 7,
                  backgroundColor: COLORS.green,
                  borderColor: COLORS.white,
                  borderWidth: 2,
                  position: 'absolute',
                  top: 14,
                  right: 2,
                  zIndex: 1000,
                }}></View>
            )}

            <Image
              source={item.image ? {uri: item.image} : UserImage}
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
              alignItems: 'left',
              justifyContent: 'center',
            }}>
            <Text style={{...FONTS.h4, marginBottom: 4}}>
            { item.type == 'group' && item.nameRoom}
              {item.type == 'one' && item.username}
              </Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text>
                { item.type == 'group' && item.nameRoom}
                {item.type == 'one' && username.trim() == item.username.trim() ? 'Bạn:' : `${item.username}:`}{' '}
                {item.text}
              </Text>
              <View
                style={{
                  width: 3.2,
                  height: 3.2,
                  backgroundColor: COLORS.secondaryGray,
                  top: '6.2%',
                  marginLeft: 4,
                  marginRight: 4,
                  borderRadius: 3,
                }}></View>
              <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
                {formatTime(item.createAt)}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <AcceptSVG width={10} height={60} />
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      { isLoading == false ? (
        <PageContainer>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 22,
                marginTop: 22,
              }}>
              <Text style={{...FONTS.h4}}>Chats</Text>
              <TouchableOpacity
                style={{
                  width: 'auto',
                  height: 30,
                  backgroundColor: '#ccc',
                  borderRadius: 8,
                  padding: 4,
                }}
                onPress={() => {
                  navigation.navigate('AddGroup');
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                  Add group
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginHorizontal: 22,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginRight: 4,
                }}>
                <TouchableOpacity
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    alignItems: 'center',
                    backgroundColor: '#e6edff',
                    marginBottom: 4,
                  }}>
                  <Image
                    source={{
                      uri: 'https://img.icons8.com/material-outlined/24/plus-math--v1.png',
                    }}
                    resizeMode="contain"
                    style={{
                      height: 60,
                      width: 30,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal={true}
                data={friends}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                style={{
                  marginLeft: 20,
                }}
                renderItem={({item, index}) => (
                  <View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={ () => 
                          checkhaveRoomInDatabase(item.id, idUser, item)
                        }
                        style={{
                          paddingVertical: 15,
                          marginRight: 22,
                        }}>
                        <Image
                          source={item.image ? {uri: item.image} : UserImage}
                          resizeMode="cover"
                          style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25,
                          }}
                        />
                      </TouchableOpacity>
                      <Text>{item.username?.substring(0, 5)}...</Text>
                    </View>
                  </View>
                )}
              />
            </View>
            {/* Input  */}
            <View
              style={{
                marginHorizontal: 22,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.secondaryWhite,
                height: 48,
                marginVertical: 22,
                paddingHorizontal: 12,
                borderRadius: 20,
              }}>
              <TextInput
                style={{
                  width: '100%',
                  height: '100%',
                  marginHorizontal: 12,
                }}
                value={search}
                onChangeText={handleSearch}
                placeholder="Search friends..."
              />
            </View>

            {/* // Chated */}
            <View
              style={{
                paddingBottom: 100,
              }}>
              <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={item => item.roomId?.toString()}
              />
            </View>
          </View>
        </PageContainer>
      ) : (
        <></>
        // <Loading/>
      )}
    </SafeAreaView>
  );
};

export default Chats;
