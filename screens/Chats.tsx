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
import {images} from '../constants';
import AcceptSVG from '../assets/misc/accepct-icon.svg';
import {formatTime} from '../untils/formatDate';
import {useAppDispatch, useAppSelector} from '../untils/useHooks';
import {fetchAllChats, fetchAllFriend} from '../reducer/User/userRedux';
import {useSelector} from 'react-redux';
import {checkHaveRoom} from '../reducer/User/userService';
import {REACT_APP_API_URL} from '@env';
import {isExpiresIn} from '../helpers/isExpried';

const Chats: React.FC<{navigation: any}> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);
  const friends = useSelector((state: any) => state.user.list.friend);
  const chats = useAppSelector((state: any) => state.user.list.chat);
  const sortedChats = chats?.slice().sort((a: any, b: any) => b.createAt.localeCompare(a.createAt));

  const isLoading = useAppSelector(state => state.user.isLoading);
  const numberMessage = 0;

  const [search, setSearch] = useState('');
  const [filteredUser, setFilteredUsers] = useState([] as any);
  const isFocused = useIsFocused();

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filteredData = sortedChats.filter(user =>
        user.username.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredUsers(filteredData);
    } else {
      setFilteredUsers(sortedChats);
    }
  };

  const onRoom = async (idRoom: string) => {
    axios
      .post(
        `${REACT_APP_API_URL}/on-room/${idRoom}`,
        {},
        {
          headers: {Authorization: `Bearer ${user?.token}`},
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
    const idOfRoom = await checkHaveRoom(
      received,
      idOfUser,
      [],
      '',
      '',
      user.token,
    );
    if (idOfRoom) {
      navigation.navigate('PersonalChat', {
        userName: item.username,
        reciever: item.id,
        roomId: idOfRoom,
        imageRecever: item.imageUser,
        fcmReciever: item.fcmToken,
        isOnline: item.isOnline,
      });
    }
  };

  async function fetchData() {
    try {
      await Promise.all([
        dispatch(fetchAllChats(user)),
        dispatch(fetchAllFriend(user)),
      ]);
    } catch (error) {
      console.error('Error dispatching actions:', error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const renderItem = ({item, index}: any) => (
    <TouchableOpacity
      key={index}
      onPress={async () => {
        await onRoom(item.roomId);
        navigation.navigate('PersonalChat', item);
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
              source={{uri: item?.imageUser ? item.imageUser : images.noneUser}}
              resizeMode="contain"
              style={{
                height: 50,
                width: 50,
                borderRadius: 50, // Bo tròn ảnh thành hình tròn
                borderColor: 'lightgray', // Màu xám nhẹ
                borderWidth: 1, // Độ dày của viền
                shadowColor: 'gray', // Màu đổ bóng
                shadowOffset: {width: 0, height: 2}, // Độ dịch chuyển đổ bóng
                shadowOpacity: 0.5, // Độ trong suốt của đổ bóng
                shadowRadius: 2, // Bán kính của đổ bóng
                elevation: 5, // Độ nâng của đổ bóng (cho Android)
              }}
            />
          </View>
          <View
            style={{
              alignItems: 'left',
              justifyContent: 'center',
            }}>
            <Text style={{...FONTS.h4, marginBottom: 4}}>
              {item.nameRoom}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                height: 20,
              }}>
              <Text
                style={[
                  {
                    fontSize: 14,
                    width: 'auto',
                    maxWidth: 210,
                    overflow: 'hidden',
                  },
                  numberMessage > 0
                    ? {
                        color: COLORS.black,
                      }
                    : {color: COLORS.secondaryGray},
                ]}>
                {item.type == 'group' && item.nameRoom}
                {user?.username?.localeCompare(item?.sender?.username) === 0 &&
                item.sender.id === user._id
                  ? 'Bạn:'
                  : `${item.sender.username}:`}{' '}
                {item.text !== '' && item.image === ''
                  ? item.text.length > 21
                    ? `${item.text.substring(0, 21)}...`
                    : item.text
                  : 'Đã gửi hình ảnh'}
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: 3.2,
                    height: 3.2,
                    backgroundColor: COLORS.secondaryGray,
                    top: '6.4%',
                    marginLeft: 8,
                    marginRight: 4,
                    borderRadius: 3,
                  }}></View>
              </View>
              <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
                {formatTime(item.createAt)}
              </Text>
            </View>
          </View>
        </View>
        <View>
          {item.count < 1 && <AcceptSVG width={10} height={60} backgroundColor={COLORS.secondaryGray} color={COLORS.secondaryGray}/>}

          {item.count !== 0 && item.sender.id !== user._id && (
            <Text
              style={{
                width: 'auto',
                height: 'auto',
                padding: 2,
                textAlign: 'center',
                alignItems: 'center',
                fontSize: 14,
                borderRadius: 10,
                backgroundColor: COLORS.green,
                color: COLORS.secondaryWhite,
              }}>
              {' '}
              {item.count > 5   ? '+5' : item.count}{' '}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      {isLoading == false ? (
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
                  backgroundColor: COLORS.secondaryGray,
                 
                  borderRadius: 8,
                  padding: 4,
                  elevation: 10,
                }}
                onPress={async () => {
                  navigation.navigate('AddGroup');
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: COLORS.secondaryWhite,
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
                        alignItems: 'left',
                        justifyContent: 'center',
                      }}>
                         <View
                style={{
                  height: 14,
                  width: 14,
                  borderRadius: 7,
                  backgroundColor: COLORS.green,
                  borderColor: COLORS.white,
                  borderWidth: 2,
                  position: 'absolute',
                  bottom: '35%',
                  right: 19.8,
                  zIndex: 1000,
                }}></View>
                      <TouchableOpacity
                        onPress={() =>
                          checkhaveRoomInDatabase(item.id, user._id, item)
                        }
                        style={{
                          paddingVertical: 15,
                          marginRight: 22,
                        }}>
                        <Image
                          source={{
                            uri: item.image ? item.image : images.noneUser,
                          }}
                          resizeMode="contain"
                          style={{
                            height: 50,
                            width: 50,
                            borderRadius: 50, // Bo tròn ảnh thành hình tròn
                            borderColor: 'lightgray', // Màu xám nhẹ
                            borderWidth: 1, // Độ dày của viền
                            shadowColor: 'gray', // Màu đổ bóng
                            shadowOffset: {width: 0, height: 2}, // Độ dịch chuyển đổ bóng
                            shadowOpacity: 0.5, // Độ trong suốt của đổ bóng
                            shadowRadius: 2, // Bán kính của đổ bóng
                            elevation: 5, // Độ nâng của đổ bóng (cho Android)
                          }}
                        />
                      </TouchableOpacity>
                      <Text>{item.username?.substring(0, 8)}...</Text>
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
                placeholder="Search friend in chats..."
              />
            </View>

            {/* // Chated */}
            <View
              style={{
                paddingBottom: 100,
              }}>
              <FlatList
                data={search.length > 0 ? filteredUser : sortedChats}
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
