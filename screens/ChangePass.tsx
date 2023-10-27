import React, {useState} from 'react';
import {Text, SafeAreaView, View, TouchableOpacity} from 'react-native';
import InputField from '../components/InputFiled';
import LinearGradient from 'react-native-linear-gradient';
import Lock from '../assets/misc/lock-line-icon.svg';
import Eye from '../assets/misc/9041325_eye_fill_icon.svg';
import Eye2 from '../assets/misc/9041353_eye_slash_fill_icon.svg';
import { requestConfig } from '../helpers/newApi';
import { AnimatedToast } from '../common/AnimatedToast';

interface ChangePassProps {
  navigation: any;
  route: any
}

const ChangePass: React.FC<ChangePassProps> = ({navigation, route}) => {
  const { email } = route.params;
  const [changeEye1, setChangeEye1] = useState(true);
  const [changeEye2, setChangeEye2] = useState(true);

  const tongleChangeEye = (number: Number) => {
    if (number == 1) {
      setChangeEye1(!changeEye1);
    } else {
      setChangeEye2(!changeEye2);
    }
  };
  const [valuePassword, setValuePassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleCheckPassword = () => {
    if (password.trimStart() !== confirmPassword.trimStart()) {
      setError('Please check password again.');
    } else {
      setError('');
    }
  };

  const handlePasswordChange = value => {
    setPassword(value); // Update the password state
  };

  const handleConfirmPasswordChange = value => {
    setConfirmPassword(value); // Update the confirmPassword state
  };

  const submitChangePass = async () => {
    if(password && confirmPassword) {
      const reponse  = await requestConfig("POST", "", null, "/change-password", {
        email: email,
        password: password,
        confirmPassword: confirmPassword
      }, null, false);

      if(reponse.status == 200) {
        navigation.navigate('Login')
      } else {
        setShowToast(true)
      }
    }
  }

  return (
    <>
    <AnimatedToast warring={false} show={showToast} text={error} onPress={() => setShowToast(false)} />
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
          {/*  title */}
          <Text
            style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 32,
              fontWeight: '800',
              color: '#333',
              marginBottom: 10,
            }}>
            Change Password
          </Text>
          {/* Body input */}
          <InputField
            label={'New password'}
            icon={<Lock
              color="#666"
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
            fieldButtonFunction={() => tongleChangeEye(1)}
            inputType={changeEye1 ? 'showpass' : 'password'}
            keyboardType={undefined}
            valueChangeFunction={handlePasswordChange}
            value={password}
            error={error} isBorderRadius={undefined} onBlur={() => {}}          />
          <InputField
            label={'Confirm password'}
            icon={<Lock
              color="#666"
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
            fieldButtonFunction={() => tongleChangeEye(2)}
            inputType={changeEye2 ? 'showpass' : 'password'}
            keyboardType={undefined}
            valueChangeFunction={handleConfirmPasswordChange}
            value={confirmPassword}
            error={error} isBorderRadius={undefined} onBlur={() => {}}          />
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
            <TouchableOpacity onPress={() => submitChangePass()}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 20,
                  padding: 4,
                  color: 'white',
                }}>
                Change & Save
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
    </>
  );
};

export default ChangePass;
