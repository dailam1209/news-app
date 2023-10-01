import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Animated,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {COLORS } from '../constants';
import RequestFriend from './RequestFriend';
import SentFriend from './SentFriend';
import {getLocalStorage} from '../untils/getLocalStorage';
import CustomSwitch from '../components/CustomSwitch';
import Loading from '../common/Loading';
import  {REACT_APP_API_URL}  from '@env'


const AddFriend = () => {
  const [valueSwitch, setValueSwitch] = useState<Number>(1);
  const [token, setToken] = useState<String>('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any>([]);

  // change switch button
  const onSelectSwitch = (valueSwitch: number) => {
    if (valueSwitch !== 1) {
      getDataSentFriend();
    } else {
      getDataOrtherFriendSent(token as string);
    }
    setValueSwitch(valueSwitch);
  };

  // get token
  const getToken = async () => {
    const tokenUser = await getLocalStorage('token');
    console.log('asdsadfasfasdfasd');
    if (typeof tokenUser === typeof 'asdasdf' && tokenUser !== null) {
      setToken(tokenUser.replace(/"/g, ''));
      return tokenUser.replace(/"/g, '');
    } else {
      setToken('');
      return 0;
    }
  };

  // you send friend others
  const getDataSentFriend = async () => {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    if (token) {
      setIsLoading(true);
      await axios
        .get(`${REACT_APP_API_URL}/get-all-sent-add', config`)
        .then(res => {
          console.log(res.data.listUserRequest);
          setFilteredUsers(() => res.data.listUserRequest);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setFilteredUsers([]);
          console.log(error);
        });
    }
  };

  // orther sent for you
  const getDataOrtherFriendSent = async (token: string) => {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    if (token) {
      setIsLoading(true);
      await axios
        .get(`${REACT_APP_API_URL}/get-all-request-add`, config)
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
    (async () => {
      const tokenCurrent = await getToken();
      getDataOrtherFriendSent(tokenCurrent as string);
    })();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Button */}
      <View>
        <Animated.View style={[styles.container]}>
          {
            <CustomSwitch
              selectionMode={1}
              option1="Request Friend"
              option2="Added Friend"
              onSelectSwitch={onSelectSwitch}
            />
          }
        </Animated.View>
      </View>
      {isLoading && <Loading />}
      {valueSwitch == 1 && isLoading == false && (
        <RequestFriend listUser={filteredUsers} token={token} />
      )}
      {valueSwitch !== 1 && isLoading == false && (
        <SentFriend listUser={filteredUsers} token={token} />
      )}
    </SafeAreaView>
  );
};

export default AddFriend;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    margin: 20,
    borderRadius: 10,
  },
  touch: {
    flex: 1,
    backgroundColor: '#d6c9c9',
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
  changeBackground: {
    backgroundColor: '#3968d4',
  },
  noneChangeBackground: {},
});
