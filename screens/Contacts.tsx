import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  Alert
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {COLORS, FONTS} from '../constants';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import UserImage = require('../assets/images/user-image.png');
import UserCount = require('../assets/images/count-user-image.png');
import {useDebounce} from '../untils/useDebounce';
import  {REACT_APP_API_URL}  from '@env';
import { useAppSelector } from '../untils/useHooks';

const Contacts: React.FC<{navigation: any}> = ({navigation}) => {

  
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ isMargin , setIsMargin ] = useState(true);
  const user = useAppSelector(state => state.user.user)

  const debounce = useDebounce(search.toLocaleLowerCase(), 500);

  const handleSearch = (text: string) => {
      setSearch(text);
  };

  const generateRandomString = (length: number) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  };

  // Generate a random Base64 string
  const generateRandomBase64String = (length: number) => {
    const randomString = generateRandomString(length);
    const base64String = btoa(randomString);
    return base64String;
  };

  const createRoomId = async () => {
    const result = generateRandomBase64String(20);
    console.log('result', result);
  };

  const renderItem = ({item, index}: any) => (
    
    <View
      key={index}
      style={[
        {
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 22,
          borderBottomColor: COLORS.secondaryWhite,
          borderBottomWidth: 1,
          justifyContent: 'space-between',
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
          alignItems: 'center',
        }}>
        <View
          style={{
            paddingVertical: 15,
            marginRight: 22,
          }}>
          <Image
            source={item.image !== '' ? {uri: `${item.image}`} : UserImage}
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
          <Text style={{...FONTS.h4, marginBottom: 4}}>{item.username}</Text>
          <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
            {item.email}
          </Text>
        </View>
      </View>
      <View style={{ marginVertical: 20}}>
        {!item.isFriend ? (
          <TouchableOpacity
          onPress={() => addFriendRequest(item.id)}
            style={{
              width: 80,
              height: 30,
              backgroundColor: '#3260d6',
              borderRadius: 4,
            }}>
            <Text
              style={{
                color: 'white',
                lineHeight: 30,
                textAlign: 'center',
              }}>
              Add Friend
            </Text>
          </TouchableOpacity>
        ) : (
          <>
          </>
        )}
       
      </View>
    </View>
  );



  const addFriendRequest = async (idAdd: string) => {
    const config = {
      headers: { Authorization: `Bearer ${user?.token}` }
  };
    const data = {}
    try {
      const postAdd = await axios.post(`${REACT_APP_API_URL}/add-friend/${idAdd}`,data, config);
      if(postAdd.status == 200 ){
        Alert.alert('Send add friend successfully.')
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  const getData = async () => {
    if (!debounce.trim()) {
      setFilteredUsers([]);
      setIsLoading(false)
      return;
    }
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
  };
    setIsLoading(true);
    const listUser = await axios.get(
      `${REACT_APP_API_URL}/search?name=${debounce}`,
      config,
    );
    if (listUser.status == 200) {
      console.log(listUser.data);
      const users = await listUser.data;
      setFilteredUsers(listUser.data.users);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFilteredUsers([]);
    getData();
  }, [debounce]);

  useEffect(() => {
    Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsMargin(false)
      }
    );
    Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsMargin(true) 
      }
    );
   
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
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
            <Text style={{...FONTS.h2}}>Contacts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddFriend')}>
              {true && (
                <View
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    backgroundColor: COLORS.red,
                    borderColor: COLORS.white,
                    borderWidth: 2,
                    position: 'absolute',
                    top: -4,
                    right: -5,
                    zIndex: 1000,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      height: 20,
                      width: 12,
                      fontSize: 12,
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    2
                  </Text>
                </View>
              )}
              <Image
                source={UserCount}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          </View>
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
            <Ionicons
              name="ios-search-outline"
              size={24}
              color={COLORS.black}
            />

            <TextInput
              style={{
                width: '100%',
                height: '100%',
                marginHorizontal: 12,
              }}
              value={search}
              onChangeText={handleSearch}
              placeholder="Search contact..."
            />
          </View>

          <View
            style={isMargin && styles.marginView}>
            {!isLoading ? (
              <FlatList
              style={{
                marginBottom: 100
              }}
                data={filteredUsers}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
              />
            ) : (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 150,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(100, 100, 100, 0.6)',
                }}>
                <ActivityIndicator size="large" />
                <Text style={{fontSize: 18, marginTop: 12}}>Loading...</Text>
              </View>
            )}
          </View>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  marginView: {marginBottom: 100},

})
