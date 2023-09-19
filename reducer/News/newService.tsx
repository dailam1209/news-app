import { config } from "../../helpers/newApi";
import axios from "axios";

interface Params {
    baseUrl: any
    headers : any
    method: string
}


export  const allNew = async (url: string): Promise<any> =>{
    return await axios({
        ...config,
        url: `https://news-1.onrender.com/api/news`,
        // data
    }).then ( (response) => {
        return {
            status: response.status,
            data: response.data
        }
    }).catch((error) =>{
        console.log(error)
        return {
            status: error.status,
            data: error.response
        }
    })
}