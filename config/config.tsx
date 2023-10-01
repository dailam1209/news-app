import { io } from "socket.io-client";
import  {REACT_APP_API_URL} from '@env';

export const API_URL = `${REACT_APP_API_URL}`
export const socket = io(API_URL);