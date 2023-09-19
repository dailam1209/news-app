import axios from "axios";
import React from "react";

interface Params {
	baseUrl: any
	headers : any
	method: string
}


export const config: Params = {
    baseUrl: process.env.REACT_APP_API_URL,
    headers: {
        "Authorization": "",
            },
    method: 'get'
}

interface OptionProps {
    url: string,
    method: string,
    baseUrl: string,
    header: object,
    params: object,
    data: any,
    timeout: number,
    withCredentials: boolean
}

export const requestOption: React.FC<OptionProps>  = async ({url, method, baseUrl, header, params, data, timeout, withCredentials }) => {
    try {
        const addRequest = await axios({
            url: url,
            method: method,
            baseURL: baseUrl,
            headers: header,
            params: params,
            data: data,
            timeout: timeout,
            withCredentials: withCredentials
            });
        if(addRequest.status == 200) {
            return addRequest.data;
        }
    } catch (error) {
        return error;
    }
}