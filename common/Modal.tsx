import React, {useState} from 'react';
import {Modal, View, Pressable, Text, Alert, StyleSheet} from 'react-native';
import {FONTS} from '../constants';

export interface ModalProps {
  onPress1: () => void;
  onPress2: () => void;
  title: string;
}

export const ModalModule: React.FC<ModalProps> = ({onPress1, onPress2, title}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          Alert.alert(`${title}`);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{marginBottom: 15, textAlign: 'center', ...FONTS.h3}}>
              {title}
            </Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                width: '100%',
                marginTop: 20
            }}>
                <Pressable
                style={styles.button}
                onPress={() => onPress1()}>
                <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => onPress2()}>
                <Text style={styles.textStyle}>Đăng xuất</Text>
                </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    top: '30%',
    width: '70%',
    marginLeft: '15%',
    margin: 'auto',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    marginLeft: 16
  },
  textStyle: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  }
});
