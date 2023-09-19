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
} from 'react-native';
import {contacts} from '../constants/data';
import {COLORS, FONTS} from '../constants';
import RequestFriend from './RequestFriend';
import SentFriend from './SentFriend';
import {getLocalStorage} from '../untils/getLocalStorage';

const AddFriend = () => {
  const [changePage, setChangepage] = useState(true);
  const [token, setToken] = useState<String>();

  const getToken = async () => {
    const tokenUser = await getLocalStorage('token');
    console.log('asdsadfasfasdfasd');
    if (typeof tokenUser === typeof 'asdasdf' && tokenUser !== null) {
      await setToken(tokenUser.replace(/"/g, ''));
    } else {
      setToken('');
    }
  };
  const onChange = (change: boolean) => {
    setChangepage(change);
  };

  useEffect(() => {
    getToken();
  }, [])
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Button */}
      <View>
        <Animated.View style={[styles.container]}>
          <View  style={[styles.touch, changePage == true ? styles.changeBackground : styles.noneChangeBackground ]}>

          <TouchableOpacity
            onPress={() => onChange(true)}
           >
            <Text style={styles.button}>Request Friend</Text>
          </TouchableOpacity>
          </View>
          <View  style={[styles.touch, changePage == false ? styles.changeBackground : styles.noneChangeBackground ]}>

            <TouchableOpacity 
            onPress={() => onChange(false)}>
              <Text style={styles.button}>Added Friend</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
      {
        changePage ? (
          <RequestFriend isGet={changePage} token={token}/>
        ) : (
          <SentFriend token={token}/>
        )
      }
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
    borderRadius: 10
  },
  button: {
    textAlign: 'center',
    height: 60,
    lineHeight: 60,
    fontSize: 16,
    color: COLORS.white
  },
  changeBackground: {
    backgroundColor: '#3968d4'
  },
  noneChangeBackground: {
  }
});
