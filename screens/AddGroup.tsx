import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Keyboard,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import {COLORS, FONTS} from '../constants';
import UserImage = require('../assets/images/user-image.png');
import SearchSVG from '../assets/misc/search-icon.svg'
import {useAppSelector} from '../untils/useHooks';
import { checkHaveRoom } from '../reducer/User/userService';
import { getId } from '../helpers/userApi';


const AddGroup = () => {
  const friends = useAppSelector(state => state.user.list.friend);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(friends);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<String>();
  const [isMargin, setIsMargin] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [id, setId] = useState<String>('');
  const [ nameGroup, setNameGroup ] = useState<String>();

  const isItemSelected = (itemId: string) => {
    return selectedItems.includes(itemId);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
  };
  const getData = () => {
    if (!search.trim()) {
      setFilteredUsers(friends);
    } else {
      const friendsFilter = filteredUsers.filter(user =>
        user.username.includes(search),
      );
      setFilteredUsers(friendsFilter);
    }
  };

  const changeNameGroup = (value) => {
    setNameGroup(value)
  }

  // Hàm xử lý khi radio button được chọn
  const renderItem = ({item, index}: any) => {
    const isSelected = isItemSelected(item.id);
    const toggleSelection = (itemId: string) => {
      if (selectedItems.includes(itemId)) {
        // Nếu itemId đã được chọn, hãy loại bỏ nó ra khỏi mảng selectedItems
        setSelectedItems(selectedItems.filter(id => id !== itemId));
        return false;
      } else {
        // Nếu itemId chưa được chọn, thêm nó vào mảng selectedItems
        setSelectedItems([...selectedItems, itemId]);
        return true
      }
    };
    return (
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
      <TouchableOpacity style={{ width: '100%'}} onPress={() =>  toggleSelection(item.id)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between'
          }}>
            <View style={{
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

            <View style={{marginVertical: 20}}>
          <TouchableOpacity onPress={() => toggleSelection(item.id)}>
            <View style={{marginVertical: 20}}>
              <RadioButton
                status={isSelected ? 'checked' : 'unchecked'}
                onPress={() => toggleSelection(item.id)} value={''} />
            </View>
          </TouchableOpacity>
        </View>
        </View>
            </TouchableOpacity>
        
      </View>
    );
  };

  const submitCreateGroup = async () => {
    if(selectedItems.length > 1 && nameGroup) {
      await checkHaveRoom(id , id, selectedItems,'group',  nameGroup );
    } else {
      Alert.alert('Please choose more than 2 user');
    }
  };

  const handleCancel = () => {
    setSelectedItems([]);
  }

  const valueId = async () => {
    const newId = await getId();
    setId(newId as string)
  }

  useEffect(() => {
    valueId();
    getData();
  }, [search]);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setIsMargin(false);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setIsMargin(true);
    });
  }, []);

  return (
    <SafeAreaView style={{
      position: 'relative',
      height: '100%',
      marginTop: 10
    }}>
      <View style={{
        width: '100%',
        alignItems: 'center',
      }}>
      <TextInput
        placeholder="Name your group"
        style={[
          {borderBottomWidth: 0,
          width: '50%',
          marginBottom: 6},
          FONTS.body3
        ]}
        value={nameGroup}
        onChange={(value) => changeNameGroup(value)}
      />
      <View style={{
        position: 'absolute',
        bottom: 10, 
        left: 0,
        right: 0,
        width: '50%',
        marginLeft: '25%',
        height: 1, 
        borderWidth: 1, 
        borderColor: 'gray', 
        borderStyle: 'dashed', 
      }} />
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
        <SearchSVG
              width={30}
              height={48}
              color={COLORS.gray}
            />

        <TextInput
          style={{
            width: '100%',
            height: '100%',
            marginHorizontal: 12,
          }}
          value={search}
          onChangeText={handleSearch}
          placeholder="Search for people to add"
        />
      </View>
      <View style={isMargin && styles.marginView}>
          <FlatList
            style={{
              marginBottom: 100,
            }}
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
      </View>
      {
        filteredUsers.length > 0 &&
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 100,
        bottom: 0,
        right: 0,
        left: 0,
        marginLeft: 'auto',
      }}>
        <TouchableOpacity style={{
          width: 70,
          height: 40,
          padding: 10,
          marginRight: 20,
          borderRadius: 4,
          
        }}
        onPress={() => {
          handleCancel()
        }}
        >
          <Text style={{
            textAlign: 'center',
            
          }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          width: 70,
          height: 40,
          padding: 10,
          marginRight: 20,
          borderRadius: 4,
          backgroundColor: COLORS.primary,
        }}
        onPress={() => {
          submitCreateGroup();
        }}
        >
          <Text style={{
            textAlign: 'center',
            color: COLORS.secondaryWhite
          }}>Create</Text>
        </TouchableOpacity>
      </View>
      }
    </SafeAreaView>
  );
};

export default AddGroup;

const styles = StyleSheet.create({
  marginView: {marginBottom: 100},
});
