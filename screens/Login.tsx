import React, {useState} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import InputField from '../components/InputFiled';
import LinearGradient from 'react-native-linear-gradient';
import EmailSVG from '../assets/misc/envelope-line-icon.svg';
import LoginSVG from '../assets/misc/login.svg';
import Lock from '../assets/misc/lock-line-icon.svg';
import Eye from '../assets/misc/9041325_eye_fill_icon.svg';
import Eye2 from '../assets/misc/9041353_eye_slash_fill_icon.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../hooks/useHooks';
import {emailRegex, passwordRegex} from '../untils/regex';
import {changeUser} from '../reducer/User/userRedux';
import {requestConfig} from '../helpers/newApi';
import {userWithout} from '../helpers/fixDataLocal';
import {AnimatedToast} from '../common/AnimatedToast';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';



interface LoginProps {
  navigation: any;
}

const appSign = "ba578a7aef466939f6d0fd86b8aa91a0205b562a91a333888fb80bc84eb5b142"
const appId = 649896294;

const Login: React.FC<LoginProps> = ({navigation}) => {
  const [changeEye, setChangeEye] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<String>('');
  const [errorEmail, setErrorEmail] = useState<String>('');
  const [errorPassword, setErrorPassword] = useState<String>('');

  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [warring, setWarring] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const emailChange = (value: string) => {
    setEmail(value);
  };

  const passChange = (value: string) => {
    setPassword(value);
  };

  const emailOnblur = () => {
    if (emailRegex.test(email as string) === false) {
      setErrorEmail('Please enter email again.');
      return false;
    } else {
      setEmail('');
      setErrorEmail('');
      emailChange(email as string);
      return true;
    }
  };

  const passwordOnblur = () => {
    if (!password) {
      setErrorPassword('Please enter password.');
      return false;
    } else {
      setErrorPassword('');
      setErrorPassword('');
      passChange(password as string);
      return true;
    }
  };

  // submitLogin
  const submitHandle = async () => {
    const isEmail = emailOnblur();
    const isPassword = passwordOnblur();
    if (isEmail && isPassword) {
      setIsLoading(true);
      const reponse = await requestConfig(
        'POST',
        '',
        null,
        'login',
        {
          email: email,
          password: password,
        },
        null,
        false,
      );
      console.log('reponse reponse', reponse);
      if (reponse.status == 200) {
        setIsLoading(false);
        setWarring(false);
        let user = reponse.data.user;
        user.token = reponse.data.token;

        ZegoUIKitPrebuiltCallService.init(
          appId,
          appSign,
          user._id,
          user.username,
          [ZIM, ZPNs],
          {
            ringtoneConfig: {
              incomingCallFileName: 'zego_incoming.mp3',
              outgoingCallFileName: 'zego_outgoing.mp3',
            },
            notifyWhenAppRunningInBackgroundOrQuit: true,
            androidNotificationConfig: {
              channelID: 'ZegoUIKit',
              channelName: 'ZegoUIKit',
            },
          },
        );
        

        await requestConfig(
          'POST',
          user.token,
          null,
          'online',
          {
            state: true,
          },
          null,
          true,
        );
        const formatUser = await userWithout(user);
        dispatch(changeUser(formatUser));
        navigation.navigate('Home');
      } else {
        setWarring(true);
        setIsLoading(false);
        setErrorEmail('Please check email again.');
        setErrorPassword('Please check password again.');
        setErrorLogin(reponse.message);
        setShowToast(true);
      }
    }
  };

  const tongleChangeEye = () => {
    setChangeEye(!changeEye);
  };
  return (
    <>
      <AnimatedToast
        warring={warring}
        text={errorLogin as string}
        onPress={() => setShowToast(false)}
        show={showToast}
      />
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
              onBlur={() => emailOnblur()}
              valueChangeFunction={emailChange}
              isBorderRadius={undefined}
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
              error={errorPassword}
              onBlur={passwordOnblur}
              valueChangeFunction={passChange}
              isBorderRadius={undefined}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
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
                {!isLoading && (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: 20,
                      padding: 6,
                      color: 'white',
                    }}>
                    Login
                  </Text>
                )}
                {isLoading && (
                  <ActivityIndicator
                    style={{
                      padding: 2,
                    }}
                    size="large"
                    color="white"
                  />
                )}
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
    </>
  );
};

export default Login;
