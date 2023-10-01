import React from 'react';
import { KeycodeInput } from 'react-native-keycode';
import { View } from 'react-native';

export interface CodeProps {
    handleValue: (value: any) => void
}

const KeyCode: React.FC<CodeProps> = ({ handleValue }) => {
  return (
        <KeycodeInput
            value=''
            length={6}
            onChange={(value) => handleValue(value)}
        />
  )
}

export default KeyCode;