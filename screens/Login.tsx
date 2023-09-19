import React, {useState} from 'react';
import {Text, SafeAreaView, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import InputField from '../components/InputFiled';
import {MaterialIcons} from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Google from '../assets/misc/Google.svg';
import Facebook from '../assets/misc/facebook.svg';
import EmailSVG from '../assets/misc/envelope-line-icon.svg';
import LoginSVG from '../assets/misc/login.svg';
import Lock from '../assets/misc/lock-line-icon.svg';
import Eye from '../assets/misc/9041325_eye_fill_icon.svg';
import Eye2 from '../assets/misc/9041353_eye_slash_fill_icon.svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginProps {
  navigation: any;
}

const Login: React.FC<LoginProps> = ({navigation}) => {
  const [changeEye, setChangeEye] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const [ errorEmail, setErrorEmail ] = useState<String>('');
  const [ errorPassword, setErrorPassword ] = useState<String>('');

  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');

  const emailChange = (value: string) => {
    setEmail(value);
  };

  const passChange = (value: string) => {
    setPassword(value);
  };

  const emailOnblur = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email as string) === false) {
      setErrorEmail('Please enter email again.')
      return false;
    }
    else {
      setEmail('');
      emailChange(email as string);
      return true;
    }
  };

  const passwordOnblur = () => {
    let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
    if(!password || password.length < 8 || reg.test(password as string) === false) {
      setErrorPassword('Please enter password same: Lamdai1209@');
      return false;
    } else {
      setErrorPassword('');
      passChange(password as string);
      return true;
    }
  }

  const submitHandle = async () => {

    const isEmail = emailOnblur();
    const isPassword = passwordOnblur();
    if(isEmail && isPassword) {
      setIsLoading(true);
      const user = await axios({
        method: 'post',
        url: "https://news-1.onrender.com/login",
        headers: {
          
        },
        data: {
          email: email,
          password: password
        }
      });
      if(user.status == 200) {
        setIsLoading(false);
        AsyncStorage.setItem("username", JSON.stringify(user.data.user.username));
        AsyncStorage.setItem("_id", JSON.stringify(user.data.user._id));
        AsyncStorage.setItem("refresh-token", JSON.stringify(user.data.user.refreshToken));
        AsyncStorage.setItem("token", JSON.stringify(user.data.token));
        AsyncStorage.setItem("image", JSON.stringify(user.data.user.image));
        AsyncStorage.setItem("email", JSON.stringify(user.data.user.email));
        AsyncStorage.setItem("phone", JSON.stringify(user.data.user.phone));
        
        navigation.navigate('Home'); 
      }
    } else {
      console.log('Fail');
    }

  }

  const tongleChangeEye = () => {
    console.log('change');
    setChangeEye(!changeEye);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <View
        style={{
          paddingHorizontal: 25,
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          {/* image */}
          <LoginSVG
            style={{
              width: 300,
              height: 200,
              marginBottom: 20,
            }}
          />
          {/*  title */}
          <Text
            style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 32,
              fontWeight: '800',
              color: '#333',
              marginBottom: 10,
            }}>
            Login
          </Text>

          {/* Body input */}
          <InputField
            label={'Email ID'}
            icon={
              <EmailSVG
                color="#666"
                style={{
                  marginRight: 5,
                  width: 20,
                  height: 30,
                }}
              />
            }
            icon1={''}
            icon2={''}
            isChange={false}
            fieldButtonFunction={() => {}}
            inputType={undefined}
            keyboardType={undefined}
            value={email}
            error={errorEmail}
            onBlur={emailOnblur}
            valueChangeFunction={emailChange}
          />
          <InputField
            label={'Password'}
            icon={
              <Lock
                color="red"
                style={{
                  marginRight: 5,
                  width: 20,
                  height: 30,
                }}
              />
            }
            icon1={
              <Eye
                color="#666"
                style={{
                  marginRight: 5,
                  width: 20,
                  height: 30,
                }}
              />
            }
            icon2={
              <Eye2
                color="red"
                style={{
                  marginRight: 5,
                  width: 20,
                  height: 30,
                }}
              />
            }
            isChange={changeEye}
            inputType={changeEye ? 'showpass' : 'password'}
            fieldButtonFunction={() => tongleChangeEye()}
            keyboardType={undefined}
            value={password}
            error={errorEmail}
            onBlur={passwordOnblur}
            valueChangeFunction={passChange}
          />

          <TouchableOpacity
            onPress={() =>navigation.navigate('ForgotPassword')}
            style={{
              display: 'flex',
              marginLeft: 'auto',
              marginTop: 6,
            }}>
            <Text
              style={{
                fontSize: 13,
                color: '#666',
                fontWeight: '700',
                textAlign: 'right',
              }}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
        {/* login button */}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 25,
            width: '100%',
            height: 40,
            marginTop: 50,
            marginBottom: 40,
          }}>
          <LinearGradient
            colors={['#AED6F1', '#3498DB']}
            style={{
              display: 'flex',
              width: '100%',
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 20,
            }}>
            <TouchableOpacity onPress={() => submitHandle()}>
              {!isLoading && <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 20,
                  padding: 6,
                  color: 'white',
                }}>
                Login
              </Text> }
              {isLoading && <ActivityIndicator style={{
                padding: 2
              }} size="large" color="white" />}
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 16, color: '#666', marginRight: 6}}>
            Don't you have account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{
              display: 'flex',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#666',
                fontWeight: '700',
                textAlign: 'right',
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
