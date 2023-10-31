import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Animated,
  StyleSheet,
} from 'react-native';
import {COLORS } from '../constants';
import RequestFriend from './RequestFriend';
import SentFriend from './SentFriend';
import CustomSwitch from '../components/CustomSwitch';
import Loading from '../common/Loading';
import { useAppSelector } from '../hooks/useHooks';
import { requestConfig } from '../helpers/newApi';

const AddFriend = () => {
  
  const user = useAppSelector(state => state.user.user)
  const [valueSwitch, setValueSwitch] = useState<Number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any>([]);

  // change switch button
  const onSelectSwitch = (valueSwitch: number) => {
    if (valueSwitch !== 1) {
      getDataSentFriend();
    } else {
      getDataOrtherFriendSent();
    }
    setValueSwitch(valueSwitch);
  };

  // you send friend others
  const getDataSentFriend = async () => {
    if (user.token) {
      setIsLoading(true);
      let reponse  = await requestConfig("GET", user?.token, null,  "get-all-sent-add", {}, null, true);
      if(reponse.status == 200) {
        setFilteredUsers(() => reponse.data.listUserRequest);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setFilteredUsers([]);
      }
    }
  };

  // orther sent for you
  async function getDataOrtherFriendSent () {
    if (user.token) {
      setIsLoading(true);
      let reponse = await requestConfig("GET", user?.token, null, "get-all-request-add", {}, null, true);
      if(reponse.status === 200) {
        setFilteredUsers(reponse.data.listUserRequest);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setFilteredUsers([]);
      }
    }
  };

  useEffect(() => {
      getDataOrtherFriendSent();
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
      {valueSwitch == 1 && !isLoading && (
        <RequestFriend listUser={filteredUsers} token={user?.token} />
      )}
      {valueSwitch !== 1 && !isLoading && (
        <SentFriend listUser={filteredUsers} token={user?.token} />
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
