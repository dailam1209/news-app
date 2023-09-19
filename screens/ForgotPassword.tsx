import React, { useState } from 'react';
import { Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import InputField from '../components/InputFiled';
import LinearGradient from 'react-native-linear-gradient';
import EmailSVG from '../assets/misc/envelope-line-icon.svg';
import axios from 'axios';


interface ForgotPasswordProps {
  navigation: any,
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({navigation}) => {

  const [ changeEye, setChangeEye] = useState(false);
  const [ errorEmail, setErrorEmail ] = useState<String>('');

  const [email, setEmail] = useState<String>('');

  const emailChange = (value: string) => {
    setEmail(value);
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


  const submitHandle = async () => {

    const isEmail = emailOnblur();
    if(isEmail) {
      const emailForgot = await axios({
        method: 'post',
        url: "https://news-1.onrender.com/forgot-password",
        headers: {
        },
        data: {
          email: email,
        }
      });
      if(emailForgot.status === 200) {
        navigation.navigate('ChangePass'); 
      } else {
        console.log(emailForgot.status);
        setErrorEmail(emailForgot as any)
      }
    } else {
      console.log('Fail');
    }

  }

  const tongleChangeEye = () => {
    console.log('change');
    setChangeEye(!changeEye);
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center'
    }}>
      <View style={{
        paddingHorizontal: 25
      }}>
        <View style={{
          alignItems: 'center'
        }}>
          {/*  title */}
          <Text
            style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 32,
              fontWeight: '800',
              color: '#333',
              marginBottom: 10
            }}
          >Forgot Password</Text>
          {/* Body input */}
            <InputField
            label={'Email ID'}

            icon={<EmailSVG
              color="#666"
              style={{
                marginRight: 5,
                width: 20,
                height: 30
              }} />}
            icon1={''}
            icon2={''}
            isChange={false}
            fieldButtonFunction={() => { } }
            inputType={undefined}
            keyboardType={undefined}
            value={email}
            error={errorEmail}
            valueChangeFunction={emailChange} 
            onBlur={emailOnblur}            />
        </View>
              {/* send button */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 25,
              width: '100%',
              height: 40,
              marginTop: 50,
              marginBottom: 40
            }}
          >
            <LinearGradient colors={['#AED6F1', '#3498DB']} style={{
              display: 'flex',
              width: '100%',
               paddingLeft: 15,
               paddingRight: 15,
               borderRadius: 20
            }}>
              <TouchableOpacity onPress={() => submitHandle()}>
                <Text style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 20,
                  padding: 4,
                  color: 'white'
                }}>
                  Send Email
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
      </View>
    </SafeAreaView>
  )
}

export default ForgotPassword;