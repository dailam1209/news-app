import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import {MaterialCommunityIcons, AntDesign, Ionicons} from '@expo/vector-icons';
import {FONTS, COLORS} from '../constants';
import {contacts} from '../constants/data';

interface Contact {
  id: number;
  userName: string;
  userImg: any; // You can replace 'any' with the correct type for your image data
  isOnline: boolean;
  lastSeen: string;
}

const Chats: React.FC<{navigation: any}> = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(contacts);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = contacts.filter(user =>
      user.userName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredUsers(filteredData);
  };

  const renderItem = ({item, index}: any) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate('PersonalChat', {
          userName: item.userName,
        })
      }
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
          paddingVertical: 15,
          marginRight: 22,
        }}>
        {item.isOnline && item.isOnline == true && (
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
          source={{uri: item.userImg}}
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
        <Text style={{...FONTS.h4, marginBottom: 4}}>{item.userName}</Text>
        <Text style={{fontSize: 14, color: COLORS.secondaryGray}}>
          {item.lastSeen}
        </Text>
      </View>
    </TouchableOpacity>
  );
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
            <Text style={{...FONTS.h4}}>Chats</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => console.log('Add contacts')}>
                <MaterialCommunityIcons
                  name="message-badge-outline"
                  size={20}
                  color={COLORS.secondaryBlack}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginLeft: 12,
                }}
                onPress={() => console.log('Add contacts')}>
                <MaterialCommunityIcons
                  name="playlist-check"
                  size={20}
                  color={COLORS.secondaryBlack}
                />
              </TouchableOpacity>
            </View>
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
              data={contacts}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              style={{
                marginLeft: 20,
              }}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 15,
                      marginRight: 22,
                    }}>
                    <Image
                      source={{uri: item.userImg}}
                      resizeMode="contain"
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                      }}
                    />
                  </TouchableOpacity>
                  <Text>{item.userName.substring(0, 5)}...</Text>
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

          {/* // Chated */}
          <View
            style={{
              paddingBottom: 100,
            }}>
            <FlatList
              data={filteredUsers}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
};

export default Chats;
