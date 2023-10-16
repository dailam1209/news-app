import React, {useState, useEffect} from 'react';
import {Text, SafeAreaView, View, TouchableOpacity, Alert} from 'react-native';
import InputField from '../components/InputFiled';
import LinearGradient from 'react-native-linear-gradient';
import EmailSVG from '../assets/misc/envelope-line-icon.svg';
import axios from 'axios';
import KeyCode from '../components/Code';
import {REACT_APP_API_URL} from '@env';
import {requestConfig} from '../helpers/newApi';
import {AnimatedToast} from '../common/AnimatedToast';

interface ForgotPasswordProps {
  navigation: any;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({navigation}) => {
  const [changeEye, setChangeEye] = useState(false);
  const [errorEmail, setErrorEmail] = useState<String>('');
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 phút * 60 giây/phút
  const [showToast, setShowToast] = useState<boolean>(false);
  const [ confirmCode, setConfirmCode ] = useState<String>('');
  const [isRunning, setIsRunning] = useState(true);
  const [keyCode, setKeyCode] = useState<Number>(0);

  const [email, setEmail] = useState<String>('');

  const emailChange = (value: string) => {
    setEmail(value);
  };

  const deleteCodeApi = async () => {
    const reponse = await requestConfig(
      'POST',
      '',
      null,
      '/delete-code',
      {
        email: email,
        code: keyCode
      },
      null,
      false,
    );

    if (reponse.status == 200) {
      navigation.navigate('ChangePass');
    } else {
      setShowToast(true)
    }
  };

  useEffect(() => {
    let animationFrameId;

    function updateTimer() {
      if (secondsRemaining === 0) {
        // Xử lý sau khi hết thời gian, ví dụ: Hiển thị thông báo.
        deleteCodeApi();
      } else {
        animationFrameId = requestAnimationFrame(updateTimer);
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }
    }
  
    if (secondsRemaining > 0) {
      animationFrameId = requestAnimationFrame(updateTimer);
    }
  
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const emailOnblur = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email as string) === false) {
      setErrorEmail('Please enter email again.');
      return false;
    } else {
      setEmail('');
      emailChange(email as string);
      return true;
    }
  };

  const submitHandle = async () => {
    const isEmail = emailOnblur();
    if (confirmEmail) {
      setConfirmEmail(!confirmEmail);
    } else {
      if (isEmail) {
        await axios({
          method: 'post',
          url: `${REACT_APP_API_URL}/forgot-password`,
          headers: {},
          data: {
            email: email,
          },
        })
          .then(res => {
            if (res.status == 200) {
              setConfirmEmail(true);
            }
          })
          .catch(error => {
            setErrorEmail('No find email match. Please enter again!');
          });
      }
    }
  };

  return (
    <>
      <AnimatedToast
        show={showToast}
        text={'Code not match. Please wait and get code again.'}
        onPress={() => setShowToast(false)}
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
          {confirmEmail ? (
            // enter keycode
            <>
              <View
                style={{
                  margin: 'auto',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'red',
                    marginBottom: 50,
                  }}>{`${String(minutes).padStart(2, '0')}:${String(
                  seconds,
                ).padStart(2, '0')}`}</Text>
                <KeyCode handleValue={e => setKeyCode(e)} />
              </View>
            </>
          ) : (
            // view confirm email
            <View
              style={{
                alignItems: 'center',
              }}>
              {/*  title */}
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 32,
                  fontWeight: '800',
                  color: '#333',
                  marginBottom: 10,
                }}>
                Forgot Password
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
                valueChangeFunction={emailChange}
                onBlur={emailOnblur}
                isBorderRadius={undefined}
              />
            </View>
          )}

          {/* send button */}
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
              <TouchableOpacity onPress={() => {
                !confirmEmail ?  submitHandle() : deleteCodeApi()
              } }>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: 20,
                    padding: 4,
                    color: 'white',
                  }}>
                  {confirmEmail ? 'Confirm Code' : 'Send Email'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ForgotPassword;
