import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLocalStorage = async (key: string) => {
    const getValue = await AsyncStorage.getItem(key).then(res => res);
    return getValue;
  }
