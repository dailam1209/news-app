import axios from 'axios';
import React from 'react';
import {getLocalStorage} from '../untils/getLocalStorage';

interface Params {
  baseUrl: any;
  headers: any;
  method: string;
}

export const config: Params = {
  baseUrl: 'http://192.168.0.102:3000',
  headers: {
    Authorization: '',
  },
  method: 'get',
};

interface OptionProps {
  url: string;
  method: string;
  baseUrl: string;
  header: object;
  params: object;
  data: any;
  timeout: number;
  withCredentials: boolean;
}

export const requestOption: React.FC<OptionProps> = async ({
  url,
  method,
  baseUrl,
  header,
  params,
  data,
  timeout,
  withCredentials,
}) => {
  try {
    const addRequest = await axios({
      url: url,
      method: method,
      baseURL: baseUrl,
      headers: header,
      params: params,
      data: data,
      timeout: timeout,
      withCredentials: withCredentials,
    });
    if (addRequest.status == 200) {
      return addRequest.data;
    }
  } catch (error) {
    return error;
  }
};

export const getToken = async () => {
  const tokenUser = await getLocalStorage('token');
  if (typeof tokenUser === typeof 'asdasdf' && tokenUser !== null) {
    return tokenUser.replace(/"/g, '');
  } else {
    return '';
  }
};

export const getId = async () => {
  const getId = await getLocalStorage('_id');
  if (typeof getId === typeof 'asdasdf' && getId !== null) {
    return getId.replace(/"/g, '');
  } else {
    return 0;
  }
};

// get userName in storage
export const getUsername = async () => {
  const name = await getLocalStorage('username');
  if (typeof name === typeof 'asdasdf' && name !== null) {
    return name.replace(/"/g, '');
  } else {
    return 0;
  }
};

// get refresh token
export const getRefreshToken = async () => {
  const refreshTokenUser = await getLocalStorage('refresh-token');
  if (
    typeof refreshTokenUser === typeof 'asdasdf' &&
    refreshTokenUser !== null
  ) {
    return refreshTokenUser.replace(/"/g, '');
  } else {
    return 0;
  }
};

// get image in storage
export const getImage = async () => {
  const imageUser = await getLocalStorage('image');
  if (typeof imageUser === typeof 'string' && imageUser !== null) {
    return imageUser.replace(/"/g, '');
  } else {
    return 0;
  }
};

// get email in storage
export const getEmail = async () => {
  const emailUser = await getLocalStorage('email');
  if (typeof emailUser === typeof 'asdasdf' && emailUser !== null) {
    return emailUser.replace(/"/g, '');
  } else {
    return 0;
  }
};

export const getPhone = async () => {
  const phoneUser = await getLocalStorage('phone');
  if (typeof phoneUser === typeof 'asdasdf' && phoneUser !== null) {
    return phoneUser.replace(/"/g, '');
  } else {
    return 0;
  }
};
