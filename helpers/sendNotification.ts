import { SEND_NOTIFICATION, KEY_SERVER_FIREBASE } from '@env';
import axios from 'axios';


export const sendNotification = async (arrayListUser: any, messages) => {
    await axios.post(
    `${SEND_NOTIFICATION}`,
    {
        notification: {
        body: messages[0].text,
        title: messages[0].user.name,
        },
        registration_ids: arrayListUser
    },
    {
        headers: {
        Authorization: `${KEY_SERVER_FIREBASE}`,
        'Content-Type': 'application/json',
        },
    },
    )
}