import React, { ReactNode } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
import { COLORS } from '../constants'

interface PageContainerProps {
    children: ReactNode;
  }
  

const PageContainer: React.FC<PageContainerProps> = (props) => {
    return (
        <KeyboardAvoidingView
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: COLORS.white,
            }}
        >
            {props.children}
        </KeyboardAvoidingView>
    )
}

export default PageContainer