import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Linking,
  } from 'react-native';
import { useAppDispatch } from '../../hooks/useHooks';
import { changeTongle } from '../../reducer/tongleShareRedux';
import { changeNumber } from '../../reducer/numberRedux';


export interface FaceProps {
onPress: () => void
}

export const Face :React.FC<FaceProps> = ({ onPress }) => {
    const  [ facebookShareUrl, setFacebookShareUrl] = useState('https://baomoi.com/');
    const [ postContent, setPostContent] = useState('Posy content');
    const dispatch = useAppDispatch();

    const postOnFacebook = () => {
        
        let facebookParameters = [];
        if (facebookShareUrl)
          facebookParameters.push('u=' + encodeURI(facebookShareUrl));
        if (postContent)
          facebookParameters.push('quote=' + encodeURI(postContent));
        const url =
          'https://www.facebook.com/sharer/sharer.php?'
           + facebookParameters.join('&');
    
        Linking.openURL(url)
          .then((data) => {
            // alert('Facebook Opened');
          })
          .catch(() => {
            // alert('Something went wrong');
            console.log('Something went wrong');
          });
         
          onPress();
      };
  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.paddingView}>
        <Text style={styles.titleText}>
          Share  Post URL With Facebook 
        </Text>
        {/* <Text style={styles.titleTextsmall}>
          Enter Post Content
        </Text> */}
        {/* <TextInput
          value={postContent}
          onChangeText={
            (postContent) => setPostContent(postContent)
          }
          placeholder={'Enter Facebook Post Content'}
          style={styles.textInput}
        /> */}
        {/* <Text style={styles.titleTextsmall}>
          Enter URL to Share
        </Text> */}
        {/* <TextInput
          value={facebookShareUrl}
          onChangeText={(facebookShareURL) =>
            setFacebookShareUrl(facebookShareURL)
          }
          placeholder={'Enter URL to Share'}
          style={styles.textInput}
        /> */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.buttonStyle}
          onPress={postOnFacebook}>
          <Text style={styles.buttonTextStyle}>
            Share on Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      textAlign: 'center',
      borderRadius: 20,
      padding: 0,
      marginBottom: 10
    },
    paddingView: {
      padding: 20,
    },
    titleText: {
      fontSize: 22,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    titleTextsmall: {
      marginVertical: 8,
      fontSize: 16,
    },
    buttonStyle: {
      justifyContent: 'center',
      marginTop: 15,
      padding: 10,
      backgroundColor: '#8ad24e',
      marginRight: 2,
      marginLeft: 2,
    },
    buttonTextStyle: {
      color: '#fff',
      textAlign: 'center',
    },
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      width: '100%',
      paddingHorizontal: 10,
    },
  });
