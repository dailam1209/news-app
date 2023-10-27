import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import {useAppDispatch} from '../hooks/useHooks';
import {changeNumber} from '../reducer/numberRedux';
import {changeTongle} from '../reducer/tongleShareRedux';
import {IconModal} from '../constants/IconModal';

export const ShowIconModel = () => {
  const dispatch = useAppDispatch();
  const changeNumberRedux = (number: Number) => {
    console.log(number);
    dispatch(changeNumber(number));
    changeTongle(false);
  };
  return (
    <View style={styles.modalView}>
      {Array.from(IconModal).map((icon, index) => (
        <TouchableOpacity
          key={index}
          style={styles.touch}
          onPress={() => changeNumberRedux(index + 1)}>
          <Image
            source={{uri: icon.url}}
            resizeMode="contain"
            style={{
              height: 30,
              width: 30,
              borderRadius: 25,
            }}
          />
          <Text style={styles.text}>{icon.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginTop: 'auto',
  },
  modalView: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  touch: {
    display: 'flex',
    width: '26%',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  modalContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2f3a4240',
    flex: 1,
    height: '100%',
    position: 'absolute',
  },
  modal: {
    width: '100%',
    height: 500,
    marginTop: 'auto',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  icon: {
    width: 100,
    height: 50,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 30,
    lineHeight: 50,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
