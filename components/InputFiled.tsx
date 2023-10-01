import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import ErrorSVG  from '../assets/misc/error-icon-1.svg';

interface InputFieldProps {
  label: any;
  icon: any;
  isChange: any;
  isBorderRadius: any,
  icon1: any;
  icon2: any;
  inputType: any;
  keyboardType: any;
  value: any;
  error: any;
  onBlur: () => void;
  fieldButtonFunction: () => void;
  valueChangeFunction: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  isChange,
  isBorderRadius,
  icon1,
  icon2,
  inputType,
  keyboardType,
  value,
  error,
  onBlur,
  fieldButtonFunction,
  valueChangeFunction,
}) => {
  return (
    <View
      style={{
        width: '100%',
      }}>
      <View
        style={[
          {
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginTop: 25,
            height: 40,
          },
          isBorderRadius
            ? {
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                paddingBottom:0,
                marginTop: 2,
                alignItems: 'center',
                paddingLeft: 10
              }
            : null,
        ]}>
        {icon}
        {inputType !== '' ? (
          <>
            <TextInput
              placeholder={label}
              keyboardType={keyboardType}
              style={{
                flex: 1,
                paddingVertical: 0,
                color: 'black',
                borderRadius: 2,
                padding: 2,
                alignItems: 'center',
                
                backgroundColor:' red'
              }}
              value={value}
              secureTextEntry={isChange}
              onEndEditing={() => onBlur()}
              onChangeText={value => valueChangeFunction(value)}
            />
            <TouchableOpacity onPress={fieldButtonFunction}>
              {isChange ? icon1 : icon2}
            </TouchableOpacity>
          </>
        ) : (
          <TextInput
            placeholder={label}
            keyboardType={keyboardType}
            style={{flex: 1, paddingVertical: 0}}
          />
        )}
      </View>

      {error !== '' ? (
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginRight: 'auto',
            marginTop: 5,
            height: 12,
          }}>
          <ErrorSVG
            style={{
              width: 10,
              height: 10,
              marginRight: 6,
            }}
            color="red"
          />
          <Text
            style={{
              fontSize: 11,
              height: 12,
              lineHeight: 12,
              alignItems: 'center',
              textAlign: 'center',
              color: 'red',
            }}>
            {error}
          </Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default InputField;
