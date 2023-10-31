import axios from 'axios';
import  {REACT_APP_API_URL}  from '@env';
import { requestConfig } from '../../helpers/newApi';

const config = (token: string) => {
  return {headers: {Authorization: `Bearer ${token}`}};
};

export const getAllUser = async (url: string, token: string, _id: string): Promise<any> => {
  return await axios
    .get(`${REACT_APP_API_URL}/${url}/${_id}`, config(token))
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

export const getAllChat = async (url: string, token: string): Promise<any> => {
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
  receverId: string,
  senderId: string,
  arrayIdAdd: any,
  typeRoom: string,
  name: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${REACT_APP_API_URL}/api/create-room`,
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
        await createMessageApi(receverId, senderId, id, typeRoom, token);
        await requestConfig("POST", token, null, `push-fcm/${id}`,null, null, true);
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
  token: string
) => {

  const userMessage =   {
    _id: senderId,
    name: '',
    avatar: '',
  }
  return await axios
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
              type == 'group' ? '' : userMessage
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
      return response
    })
    .catch(error => {
      return error
    });
};

// export const getAllMessageOfRoom = async (roomId: string, user: any): Promise<any> => {
//   return await axios
//     .post(`${REACT_APP_API_URL}/api/get-all-message/${roomId}`, data: { user.fcmToken }, config(user.token))
//     .then(async response => {
//       if (response.status == 200) {
//         const json = response.data.listMessage[0];
//         return json;
//       }
//     })
//     .catch(error => {
//       console.log(error);
//     });
// };

  // post message in database if not image -> image = ''
  export  const submitMessage = async (data: any, token: string) => {
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
