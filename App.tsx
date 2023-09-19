import React, {useEffect, useState, createContext, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import AppNavigator from './navigators/AppNavigator';
import ModalShare from './common/ModelShare';

import {useAppDispatch, useAppSelector} from './untils/useHooks';
import tongleShareRedux, {changeTongle} from './reducer/tongleShareRedux';
import SplashScreen from 'react-native-splash-screen';
import {allNew} from './reducer/News/newService';
import { fetchAllNews, fetchEmpty} from './reducer/News/newRedux';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const isTongle = useAppSelector(state => state.tongle.tongle);
  const dispatch = useAppDispatch();

  const getData = async () => {
    dispatch(fetchAllNews());
  };

  useEffect(() => {
    getData();
    dispatch(changeTongle(false));
  }, []);

  return (
    <React.Fragment>
      <AppNavigator />
      {isTongle ? (
        <View>
          <ModalShare />
        </View>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  textClicked: {
    color: 'red',
    textDecorationLine: 'underline',
  },
  modal: {
    height: 200,
  },
});

export default App;
