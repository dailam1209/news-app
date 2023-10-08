import {getLocalStorage} from './getLocalStorage';

export const getToken = async () => {
    const tokenUser = await getLocalStorage('token');
    if (typeof tokenUser === typeof 'asdasdf' && tokenUser !== null) {
        return tokenUser.replace(/"/g, '')
    } else {
      return '';
    }
  };