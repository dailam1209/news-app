import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, View, TouchableOpacity} from 'react-native';
import {ShowIconModel} from './ShowIconModel';
import {useAppDispatch, useAppSelector} from '../untils/useHooks';
import {changeTongle} from '../reducer/tongleShareRedux';
import {Face} from '../components/Facebook/Face';
import BluePLR from '../components/Bluetooth/Blue';
import {changeNumber} from '../reducer/numberRedux';

const ModalShare = () => {
  const [hidden, setHidden] = useState(true);
  const isTrue = useAppSelector(state => state.tongle.tongle);
  const numberCurrent = useAppSelector(state => state.number.number);

  const dispatch = useAppDispatch();
  const showValueContext = () => {
    dispatch(changeTongle(false));
    setHidden(false);
    dispatch(changeNumber(0));
  };

  return (
    <View style={styles.under}>
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isTrue}
          presentationStyle="overFullScreen"
          style={styles.under}>
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => showValueContext()}>
            <View style={styles.view}>
              {numberCurrent === 0 && (
                <TouchableOpacity onPress={() => setHidden(true)}>
                  <ShowIconModel />
                </TouchableOpacity>
              )}
              {numberCurrent === 1 && (
                <TouchableOpacity onPress={() => setHidden(true)}>
                  <Face onPress={() => showValueContext()} />
                </TouchableOpacity>
              )}
              {numberCurrent === 2 && (
                <TouchableOpacity onPress={() => setHidden(true)}>
                  <BluePLR />
                </TouchableOpacity>
              )}
              {numberCurrent === 3 && (
                <TouchableOpacity onPress={() => setHidden(true)}>
                  <Face onPress={() => showValueContext()} />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  under: {
    position: 'relative',
  },
  view: {
    minHeight: 160,
    marginTop: 'auto',
    margin: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
  },
  modalContainer: {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#2f3a4240',
    position: 'absolute',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default ModalShare;
