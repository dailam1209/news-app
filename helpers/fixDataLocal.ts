import AsyncStorage from "@react-native-async-storage/async-storage";

export const userWithout = async (user: any): Promise<any> => {
   return await Object.keys(user).reduce((result, key) => {
        if (key !== "password" && key !== "friend" && key !== "sentFriendRequest" ) {
          result[key] = user[key];
        }
        AsyncStorage.setItem('user', JSON.stringify(result));
        return result;
      }, {});
}