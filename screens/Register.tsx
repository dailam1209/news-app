import React, {useState} from 'react';
import  {REACT_APP_API_URL}  from '@env'
import {Text, SafeAreaView, View, TouchableOpacity, ToastAndroid} from 'react-native';
import InputField from '../components/InputFiled';
import LinearGradient from 'react-native-linear-gradient';
import EmailSVG from '../assets/misc/envelope-line-icon.svg';
import LoginSVG from '../assets/misc/login.svg';
import Lock from '../assets/misc/lock-line-icon.svg';
import Eye from '../assets/misc/9041325_eye_fill_icon.svg';
import Eye2 from '../assets/misc/9041353_eye_slash_fill_icon.svg';
import UserSVG from '../assets/misc/4092564_profile_about_mobile ui_user_icon.svg';
import axios from 'axios';

interface RegisterProps {
  navigation: any;
}

const Register: React.FC<RegisterProps> = ({navigation}) => {
  
  const [ message, setMessage ] = useState('');

  //error
  const [erroName, setErrorName] = useState<String>('');
  const [ errorEmail, setErrorEmail ] = useState<String>('');
  const [ errorPassword, setErrorPassword ] = useState<String>('');
  const [ errorConfirm, setErrorConfirm] = useState<String>('');

  //icon
  const [changeEye1, setChangeEye1] = useState<any>(true);
  const [changeEye2, setChangeEye2] = useState<any>(true);

  // value
  const [username, setUsername] = useState<String>('');
  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [confirmPassword, setConfirmPassword] = useState<String>('');

  // change
  const userChange = (value: string) => {
    setUsername(value);
  };

  const emailChange = (value: string) => {
    setEmail(value);
  }

  const passChange = (value: string) => {
    setPassword(value);
  }

  const confirmPassChange = (value: string) => {
    setConfirmPassword(value);
  }

  const showToast  =  (message) => {
    ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.TOP, 0, 100 );
  }


  const submitHandle = async () => {
    // check username
    try {
      const isUser = usernameOnblur();

      const isEmail = emailOnblur();
      const isPassword = passwordOnblur();
      if(isUser && isEmail && isPassword) {
        const register = await axios({
          method: 'post',
          url: `${REACT_APP_API_URL}/register`,
          headers: {
          },
          data: {
            username: username,
            email: email,
            password: password
          }
        });
        console.log(register.status);
        if(register.data.success == true && register.status == 200) {
          showToast(message);
          setInterval(() => {
            navigation.navigate('Login'); 
          }, [2000])
        }
      }
    } catch (error) {
          showToast(error.message)
    }
   

  }

  // onBlur
  const usernameOnblur = () => {
    if(username.length <= 4) {
      setErrorName('Please enter username more than 4 characters.');
      return false;
    } else {
      setErrorName('');
      userChange(username as string);
      return true;
    }
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
  }

  const passwordOnblur = () => {
    let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/
    if(!password || password.length < 8 || reg.test(password as string) === false) {
      console.log('password wrong', reg.test(password as string));
      setErrorPassword('Please enter password same: Lamdai1209@');
      return false;
    } else {
      console.log('password', reg.test(password as string));
      setErrorPassword('');
      passChange(password as string);
      return true;
    }
  }

  const confirmPasswordOnblur = () => {
    if(!confirmPassword || password !== confirmPassword) {
      setErrorConfirm('Please enter confirmpassword again.');
      return false;
    } else {
      setErrorConfirm('');
      confirmPassChange(confirmPassword as string);
      return true;
    }
  }
  

  const tongleChangeEye = (number: Number) => {
    if (number == 1) {
      setChangeEye1(!changeEye1);
    } else {
      setChangeEye2(!changeEye2);
    }
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
            Sign Up
          </Text>
          {/* Body input */}
          {/* user name */}
          <InputField
            label={'User name'}
            icon={<UserSVG
              color="red"
              style={{
                marginRight: 5,
                width: 20,
                height: 30,
              }} />}
            icon1={''}
            icon2={''}
            isChange={false}
            fieldButtonFunction={() => { } }
            inputType={undefined}
            keyboardType={undefined}
            value={undefined}
            error={erroName}
            onBlur={usernameOnblur}
            valueChangeFunction={userChange} isBorderRadius={undefined}          />
          {/* Email */}
          <InputField
            label={'Email ID'}
            icon={<EmailSVG
              color="#666"
              style={{
                marginRight: 5,
                width: 20,
                height: 30,
              }} />}
            icon1={''}
            icon2={''}
            isChange={false}
            fieldButtonFunction={() => { } }
            inputType={undefined}
            keyboardType={undefined}
            value={undefined}
            error={errorEmail}
            onBlur={emailOnblur}
            valueChangeFunction={emailChange} isBorderRadius={undefined}          />
          {/* Password */}
          <InputField
            label={'Password'}
            icon={<Lock
              color="red"
              style={{
                marginRight: 5,
                width: 20,
                height: 30,
              }} />}
            icon1={<Eye
              color="#666"
              style={{
                marginRight: 5,
                width: 20,
                height: 30,
              }} />}
            icon2={<Eye2
              color="red"
              style={{
                marginRight: 5,
                width: 20,
                height: 30,
              }} />}
            isChange={changeEye1}
            inputType={changeEye1 ? 'showpass' : 'password'}
            fieldButtonFunction={() => tongleChangeEye(1)}
            keyboardType={undefined}
            value={undefined}
            error={errorPassword}
            onBlur={passwordOnblur}
            valueChangeFunction={passChange} isBorderRadius={undefined}          />
          {/* Confirm Password */}
          <InputField
            label={'Confirm password'}
            icon={<Lock
              color="red"
              style={{
                marginRight: 5,
                width: 20,
                height: 30,
              }} />}
            icon1={<Eye
              color="#666"
              style={{
                marginRight: 5,
                width: 20,
                height: 30,
              }} />}
            icon2={<Eye2
              color="red"
              style={{
                marginRight: 5,
                width: 20,
                height: 30,
              }} />}
            isChange={changeEye2}
            inputType={changeEye2 ? 'showpass' : 'password'}
            fieldButtonFunction={() => tongleChangeEye(2)}
            keyboardType={undefined}
            value={confirmPassword}
            onBlur={confirmPasswordOnblur}
            error={errorConfirm}
            valueChangeFunction={confirmPassChange} isBorderRadius={undefined}          />
        </View>
        {/* register button */}
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
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 20,
                  padding: 4,
                  color: 'white',
                }}>
                Register
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
