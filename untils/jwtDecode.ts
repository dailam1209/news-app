import {getLocalStorage} from './getLocalStorage';
import axios from 'axios';
import  {REACT_APP_API_URL}  from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';

const expiresInToken = async () => {
  const expiresIn = await getLocalStorage('create-at');
  if (typeof expiresIn === typeof 'asdasdf' && expiresIn !== null) {
    return expiresIn.replace(/"/g, '');
  } else {
    return 0;
  }
};

const refreshToken = async () => {
  const expiresIn = await getLocalStorage('refresh-token');
  if (typeof expiresIn === typeof 'asdasdf' && expiresIn !== null) {
    return expiresIn.replace(/"/g, '');
  } else {
    return 0;
  }
};

const token = async () => {
    const expiresIn = await getLocalStorage('token');
    if (typeof expiresIn === typeof 'asdasdf' && expiresIn !== null) {
      return expiresIn.replace(/"/g, '');
    } else {
      return 0;
    }
  };

export async function isTokenExpired() {
  const timeToken = await expiresInToken();
  console.log("timeToken", timeToken);

//   const timeDate = new Date(new Date(new Date(Date.now())));

//   const gio = timeDate.getUTCHours(); // Lấy giờ
// const phut = timeDate.getUTCMinutes(); // Lấy phút
// const giay = timeDate.getUTCSeconds(); // Lấy giây
// const ngay = timeDate.getUTCDate(); // Lấy ngày
// const thang = timeDate.getUTCMonth() + 1; // Lấy tháng (lưu ý rằng tháng trong JavaScript bắt đầu từ 0, vì vậy chúng tôi cộng thêm 1)
// const nam = timeDate.getUTCFullYear(); // Lấy năm

// console.log(`Giờ: ${gio}, Phút: ${phut}, Giây: ${giay}`);
// console.log(`Ngày: ${ngay}, Tháng: ${thang}, Năm: ${nam}`);
// console.log(new Date(Date.now()), new Date(new Date(Date.now())).getTime() / 1000);
  
  const timeMini = new Date(timeToken).getTime() / 1000
  const now = Date.now()
  
  if (!(now < timeMini)) {
    const refresh = await refreshToken();
    await axios
      .post(`${REACT_APP_API_URL}/refresh-token`, {refreshToken: refresh})
      .then(async response => {
        if (response.status == 200) {
          const newAccessToken = response?.data?.accessToken;
          if (newAccessToken) {
            AsyncStorage.setItem('token', newAccessToken);
            return newAccessToken;
          }
        }
      })
      .catch(error => {
        console.log(`${error}`);
      });
  } else {
     const tokenLast = await token();
     return tokenLast;
  }
}
