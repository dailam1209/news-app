import { compareDate } from '../untils/compareDate';
import { getLocalStorage } from '../untils/getLocalStorage';

export const isExpiresIn = async () => {
  const user = await getLocalStorage('user');
  if (user !== null) {
    const userObj = JSON.parse(user); 
    let time = await userObj.expiresIn;
    let isEx =compareDate(time);
    // true or false to refresh token
    return isEx;
  } 
  return '';
};

export const getRefreshToken = async () => {
    const user = await getLocalStorage('user');
    if (user !== null) {
      const userObj = JSON.parse(user); 
      return userObj.refreshToken;
    } 
    return 0;
  };