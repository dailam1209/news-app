import React from "react";
import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RefreshTokenProps {
    headers: { Authorization: string; "content-type": string; };
    requestConfig:  any,
    refreshToken: string,
}

const RefreshTokenAgain: React.FC<RefreshTokenProps> = async ( requestConfig, refreshToken) => {
    try {
        console.log(requestConfig, refreshToken);
        if(refreshToken) {
            await axios.post('https://news-1.onrender.com/refresh-token', { refreshToken: refreshToken })
            .then(async (response) => {
                if(response.status == 200) {
                    const newAccessToken = response?.data?.accessToken;
                    if(newAccessToken) {
                        AsyncStorage.setItem('token', newAccessToken);
                    }
                }
                // Lưu trữ accessToken mới
                // Thực hiện lại yêu cầu trước
                requestConfig.headers = {
                        Authorization: `Bearer ${response?.data?.accessToken}`,
                        "content-type": "multipart/form-data"
                };
                await axios(requestConfig as any)
                .then((response) => {
                    console.log('response',response);
                    return response;
                })
                .catch((error) => {
                    console.log(`${requestConfig} is ${ error}`)
                })
            })
        }
    } catch (error) {
        console.error('sai o buoc 2:', error);
    }
    
    
}

export default RefreshTokenAgain;