import React from 'react';
import {View, Text, TouchableOpacity,  Pressable, TextInput} from 'react-native';
import ErrorSVG from '../assets/misc/error-icon-1.svg';

interface InputFieldProps {
  label: any,
  icon: any,
  isChange: any,
  icon1: any,
  icon2: any,
  inputType: any,
  keyboardType: any,
  value: any,
  error: any,
  onBlur: () => void,
  fieldButtonFunction: () => void
  valueChangeFunction: (value: string) => void
}



const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  isChange,
  icon1,
  icon2,
  inputType,
  keyboardType,
  value,
  error,
  onBlur,
  fieldButtonFunction,
  valueChangeFunction
}) => {
  return (
    <View style={{
      width: '100%'
    }}>
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          paddingBottom: 8,
          marginTop: 25,
        }}>
        {icon}
        {inputType !== '' ? (
          <>
              <TextInput
                placeholder={label}
                keyboardType={keyboardType}
                style={{flex: 1, paddingVertical: 0, color: 'black'}}
                secureTextEntry={isChange}
                onEndEditing={() => onBlur()}
                onChangeText={(value) => valueChangeFunction(value)}
              />
              <TouchableOpacity onPress={fieldButtonFunction}>
              {isChange ? (icon1) : (icon2)}
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

      {
        error !== '' ?
        (
          <View style={{
            flexDirection: 'row',
            width: '100%',
            marginRight: 'auto',
            marginTop: 10,
            height: 16,
          }}>
            <ErrorSVG style={{
              width: 16,
              height: 16,
              marginRight: 4,
            }}
             color='red'/>
            <Text style={{
              fontSize: 12.5,
              height: 16,
              lineHeight: 16,
              color: 'red'
            }}>{error}</Text>
          </View>
        ) : (
          <></>
        )
      }
      
    </View>
  );
}

export default InputField;