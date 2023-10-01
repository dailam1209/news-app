import axios from 'axios';
import {getLocalStorage} from '../../untils/getLocalStorage';
import {
  getToken,
  getId,
  getImage,
  getRefreshToken,
  getUsername,
} from '../../helpers/userApi';
import  {REACT_APP_API_URL}  from '@env';

const config = (token: string) => {
  return {headers: {Authorization: `Bearer ${token}`}};
};

export const getAllUser = async (url: string): Promise<any> => {
  const token = await getToken();
  const id = await getId();
  return await axios
    .get(`${REACT_APP_API_URL}/${url}/${id}`, config(token))
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

export const getAllChat = async (url: string): Promise<any> => {
  const token = await getToken();
  return await axios
    .get(`${REACT_APP_API_URL}/${url}`, config(token))
    .then(response => {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(error => {
      return {
        status: error.status,
        message: error.message,
      };
    });
};

export const checkHaveRoom = async (
  receverId,
  senderId,
  arrayIdAdd,
  typeRoom,
  name,
) => {
  try {
    const token = await getToken();
    const response = await axios.post(
      '${REACT_APP_API_URL}/api/create-room',
      {
        receverId: receverId,
        senderId: senderId,
        typeRoom: typeRoom,
        arrayIdAdd: arrayIdAdd,
        nameRoom: name,
      },
      config(token)
    );

    if (response.status === 200) {
      // No have room in database
      const id = response?.data?.id;
      if (response.data.message !== 'Haved Room') {
        console.log(receverId, senderId, id, typeRoom);
        await createMessageApi(receverId, senderId, id, typeRoom);
      }
      console.log('response.data', response.data);
      return id.toString(); // Trả về id dưới dạng chuỗi
    } else {
      throw new Error(`API returned status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Rethrow the error so it can be caught by the caller if needed.
  }
};

export const createMessageApi = async (
  receverId: string,
  senderId: string,
  idRoom: string,
  type: string,
) => {

  const user =   {
    _id: senderId,
    name: '',
    avatar: '',
  }
  const token = await getToken();
  await axios
    .post(
      `${REACT_APP_API_URL}/api/create-message/${receverId}`,
      {
        sender: receverId,
        reciever: senderId,
        roomId: idRoom,
        messages: [
          {
            system: type == 'group' ? true : false,
            text: type == 'group' ? 'Well come to group chat' : '',
            createdAt: Date.now(),
            user:  
              type == 'group' ? '' : user
            ,
            image: '',
            sent: true,
            received: false,
            seen: false,
            deleteAt: '',
            hiddenTo: [],
            isReply: {},
          },
        ],
      },
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    )
    .then(response => {
      if (response.status == 200) {
        console.log(`create Module success`);
      }
    })
    .catch(error => {
      console.log(`${error.message}`);
    });
};

export const getAllMessageOfRoom = async (roomId: string): Promise<any> => {
  const token = await getToken();
  return await axios
    .get(`${REACT_APP_API_URL}/api/get-all-message/${roomId}`, config(token))
    .then(async response => {
      if (response.status == 200) {
        const json = response.data.listMessage[0];
        return json;
      }
    })
    .catch(error => {
      console.log(error);
    });
};

  // post message in database if not image -> image = ''
  export  const submitMessage = async (data: any) => {

    const token = await getToken();
    await axios
      .post(
        `${REACT_APP_API_URL}/api/create-message/${data.reciever}`,
        data,
        config(token)
      )
      .then(response => {
        if (response.status == 200) {
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
