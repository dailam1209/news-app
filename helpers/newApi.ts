import {REACT_APP_API_URL} from '@env';
import axios from 'axios';
import { getRefreshToken, isExpiresIn } from './isExpried';
import { userWithout } from './fixDataLocal';


export const requestConfig = async (
  method: string,
  token: string,
  header: any,
  url: string,
  data: any,
  addconfig: any,
  isAuth: boolean
): Promise<any> => {

  
  const isEx = await isExpiresIn();
  let newToken = token;
  try {
    if(!isEx && isAuth) {
      const refresh = await getRefreshToken();
      newToken = await refreshToken(refresh);
    } 
    const headers = {
      Authorization: `Bearer ${newToken ? newToken : ''}`,
    };
    
    if (header == 'have') {
      headers['Accept'] = 'application/json';
      headers['Content-type'] = 'multipart/form-data';
    }
      return await axios
        .request({
          headers,
          method: method,
          url: `${REACT_APP_API_URL}/${url}`,
          data: data,
          ...addconfig
        })
        .then(response => {
          return {
            status: response.status,
            data: response.data,
          };
        });
  } catch (error) {
    return error.response.data

  }
};

const refreshToken = async (refreshToken: string) => {
    let reponse = await axios.post(`${REACT_APP_API_URL}/refresh-token`,{
      refreshToken: refreshToken
    }, {}
    )
    if(reponse.status == 200) {
      console.log();
      const user = reponse.data.user;
      user.token = reponse.data.accessToken;
      await userWithout(user);
      return reponse.data.accessToken;
    }
}
