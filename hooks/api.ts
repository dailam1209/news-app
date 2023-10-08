import axios from 'axios';
import React from 'react';
import  {REACT_APP_API_URL}  from '@env';






export interface OptionProps {
  url: string;
  method: string;
  customConfig: any;
  baseUrl: string;
  token: string,
  headers: any;
  params: object;
  data: any;
  timeout: number;
  withCredentials: boolean;
}

export const requestOption: React.FC<OptionProps> = async ({
  method,
  url,
  data,
  headers,
  customConfig,
  params,
  timeout,
  withCredentials,
}) => {
  try {
   
    const addRequest = await axios({
      method: method,
      baseURL: `${REACT_APP_API_URL}`,
      url: url,
      headers: headers ,
      params: params,
      data: data,
      timeout: timeout,
      withCredentials: withCredentials,
    });
    if (addRequest.status == 200) {
      return {
        status: addRequest.status,
        data: addRequest?.data
      };
    }
  } catch (error) {
    return error.message;
  }
};