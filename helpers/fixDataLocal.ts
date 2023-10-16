import AsyncStorage from "@react-native-async-storage/async-storage";

export const userWithout = async (user: any): Promise<any> => {
  const result = {};

  for (const key in user) {
    if (key !== "password" && key !== "friend" && key !== "sentFriendRequest") {
      result[key] = user[key];
    }
  }
  await AsyncStorage.setItem('user', JSON.stringify(result));
  return result;
}