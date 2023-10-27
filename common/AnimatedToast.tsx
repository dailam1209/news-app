import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, Animated, Easing, StyleSheet} from 'react-native';
import {COLORS} from '../constants';
import SuccessSVG from '../assets/misc/success-icon.svg';
import ErrorSVG from '../assets/misc/error-icon.svg';

export interface AnimatedToastProps {
  show: any;
  text: string;
  warring: boolean;
  onPress: () => void
}

export const AnimatedToast: React.FC<AnimatedToastProps> = ({show, onPress, text, warring}) => {
  const animatedValue = new Animated.Value(0);
  

  useEffect(() => {
    if(show) {
      animate();
    }
  }, [show]);



  const animate = () => {
    animatedValue.setValue(0);
    const moveDown = Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    });
    const delay = Animated.delay(700); 
    const moveUp = Animated.timing(animatedValue, {
      toValue: 0,
      duration: 500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    });

    Animated.sequence([moveDown, delay,  moveUp]).start(() => {
           onPress()

    });
  };

  return (
      <Animated.View
        style={[{
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-210, 150],
              }),

            },
          ]
        }, styles.toast]}>
          <View style={[styles.view, warring ? {backgroundColor: COLORS.red} :{backgroundColor: COLORS.green}]}>
            {warring ? <ErrorSVG width={20} height='100%' backgroundColor={COLORS.red} color={COLORS.secondaryWhite}/> : 
           <SuccessSVG width={20} height='100%' backgroundColor={COLORS.secondaryWhite} color={COLORS.secondaryWhite}/> 
            
            }
          

          <Text style={styles.text}> {text}</Text>
          </View>
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    paddingVertical: 6,
    padding: 4,
    zIndex: 99999999999999,
    top: -110
  },
  view: {
    flexDirection: 'row',
    width: 'auto',
    height: 34,
    alignItems: 'center',
    paddingLeft: 6,
    borderRadius: 20,
    paddingRight: 6,
  },
  text: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.secondaryWhite,
    marginRight: 4
  }
});
