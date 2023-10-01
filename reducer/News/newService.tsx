import {config} from '../../helpers/newApi';
import axios from 'axios';
import  {REACT_APP_API_URL}  from '@env'

interface Params {
  baseUrl: any;
  headers: any;
  method: string;
}

export const allNew = async (url: string): Promise<any> => {
  return await axios({
    ...config,
    url: `${REACT_APP_API_URL}/api/news`,
    // data
  })
    .then(response => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(error => {
      console.log(error);
      return {
        status: error.status,
        data: error.response,
      };
    });
};
