import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import {Keyboard} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, FONTS} from '../constants';
import {StatusBar} from 'expo-status-bar';
import {MaterialIcons, FontAwesome} from '@expo/vector-icons';
import {
  GiftedChat,
  Send,
  Bubble,
  InputToolbar,
  Actions,
  ActionsProps,
  IMessage,
  MessageImageProps,
} from 'react-native-gifted-chat';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import * as ImagePicker from 'react-native-image-picker';
import CheckDoneSVG from '../assets/misc/check-done-icon.svg';
import LeftSVG from '../assets/misc/left-icon.svg';
import SendSVG from '../assets/misc/send-icon.svg';
import MenuSVG from '../assets/misc/menu-icon.svg';
import ImageSVG from '../assets/misc/image-icon.svg';
import CloseSVG from '../assets/misc/close-icon.svg';
import {TextInput} from 'react-native-gesture-handler';

interface PerrsonProps {
  navigation: () => void;
}

const PersonalChat: React.FC<PerrsonProps> = ({navigation}) => {
  const [messages, setMessages] = useState([] as any);
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState<any>(null);
  const refImage =  useRef()

  useEffect(() => {
    setMessages([
      {
        _id: 2,
        text: 'Hello developer 2',
        createdAt: new Date('2023-09-15T07:28:30.882Z'),
        user: {
          _id: 1,
          name: 'React Native 1',
          avatar:
            'https://antimatter.vn/wp-content/uploads/2022/11/hinh-nen-anime.jpg',
        },
      },
      {
        _id: 1,
        text: '',
        image:
          'https://antimatter.vn/wp-content/uploads/2022/11/hinh-nen-anime.jpg',
        createdAt: new Date('2023-09-15T07:28:26.882Z'),
        user: {
          _id: 2,
          name: 'React Native',
        },
        avatar:
          'https://antimatter.vn/wp-content/uploads/2022/11/hinh-nen-anime.jpg',
      },
    ]);
  }, []);

  const handlePhotoPicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    });
    if (result.didCancel && result.didCancel == true) {
    } else {
      setImageData(result as any);
      setImageUrl(result?.assets[0]?.uri);
      console.log(result?.assets[0]?.uri);
      refImage.current = result?.assets[0]?.uri
    }
  };

  const onSendOnlyImage = () => {
    console.log('url', refImage.current);
    const message = {
      text: '',
      createdAt: new Date(),
      senderId: 1,
      receiverId: 2,
      image: refImage.current as any,
      sent: true,
      read: false,
    };
    const lastMessage = {...message, text: ''};
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [lastMessage])
    )
    setImageUrl('')
  };

  function renderActions(props: Readonly<ActionsProps>) {
    return (
      <Actions
        {...props}
        options={{
          ['Choose Image']: handlePhotoPicker,
          ['Send Image']: onSendOnlyImage,
        }}
        icon={() => (
          <View
            style={{
              alignItems: 'center',
              height: '100%',
              width: 30,
              alignContent: 'center',
            }}>
            <ImageSVG
              width={26}
              height={'100%'}
              alignItems="center"
              color="white"
            />
          </View>
        )}
        
      />
    );
  }

  // change button of send
  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View
          style={{
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            borderRadius: 18,
            // backgroundColor: COLORS.primary,
            marginRight: 5,
            marginBottom: 5,
          }}>
          <ImageSVG width={30} height={30} />
        </View>
      </Send>
    );
  };

  const onSendMessage = (messageArray: IMessage[]) => {
    
    // onSendOnlyImage()
    if (refImage.current && messageArray[0].text) {
      // User wants to send both text and an image
      const compositeMessage: IMessage = {
        _id: 1,
        text: messageArray[0].text,
        createdAt: new Date(),
        user: {
          _id: 2,
        },
        image: refImage.current,
      };

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [compositeMessage]),
      );
    } else if (messageArray[0].text && !refImage.current) {
      // User wants to send only text
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    } else if (refImage.current && messageArray[0].text !== '') {
      // User wants to send only an image
      const message : IMessage = {
        text: '',
        createdAt: new Date(),
        _id: 1,
        user: {
          _id: 2,
        },
        image: refImage.current as any,
        sent: true,
      };
      const lastMessage = {...message, text: ''};
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [lastMessage])
      )
    }
    refImage.current = null
  }
  // }

  // customize sender messages
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.primary,
          },
        }}
        textStyle={{
          right: {
            color: COLORS.white,
          },
        }}
      />
    );
  };

  function renderMessageImage(
    props: MessageImageProps<IMessage>,
  ): React.ReactNode {
    throw new Error('Function not implemented.');
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.white} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          backgroundColor: COLORS.white,
          height: 60,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
            <LeftSVG width={20} height={18} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 14,
            }}>
            <Image
              source={{
                uri: 'https://antimatter.vn/wp-content/uploads/2022/11/hinh-nen-anime.jpg',
              }}
              resizeMode="cover"
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
              }}
            />
            <Text style={{...FONTS.h4, marginLeft: 8}}>Lai Yen</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => console.log('search')}
            style={{
              marginRight: 8,
            }}>
            <MaterialIcons name="search" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log('Menu')}
            style={{
              marginRight: 8,
            }}>
            <MenuSVG width={24} height={30} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <GiftedChat
          alwaysShowSend
          renderSend={props => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 50,
                }}>
                {/* if have image choose in device */}
                {imageUrl !== '' ? (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: '#fff',
                      marginRight: 10,
                    }}>
                    <Image
                      source={{uri: imageUrl}}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        setImageUrl('');
                      }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        backgroundColor: '#d5d4d4',
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        alignItems: 'center',
                      }}>
                      <CloseSVG
                        color="white"
                        backgroundColor="white"
                        style={{width: 8, height: 12}}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* send message */}

                <Send {...props} containerStyle={{justifyContent: 'center',width: 30,
                      height: 30,
                      backgroundColor: '#469ff0',
                      borderRadius: 100,
                      overflow: 'hidden',
                      alignItems: 'center',
                      marginRight: 10
                      }}>
                    <SendSVG width={16} height={30} color="white" />
                </Send>
              </View>
            );
          }}
          messages={messages}
          showAvatarForEveryMessage={true}
          placeholder="Nhập nội dung..."
          onSend={(message) => onSendMessage(message)}
          renderActions={renderActions}
          user={{
            _id: 2,
            name: 'LamDai',
            avatar: "https://scontent.fhan17-1.fna.fbcdn.net/v/t1.6435-9/126943123_446762616332696_8326994946400840256_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=7WA4A7kAmhMAX9q-3XW&_nc_ht=scontent.fhan17-1.fna&oh=00_AfBSJNiwpwqB-aISI187-l5zE5itGSWDwBepCAfzoA04iQ&oe=652D4124"
          }}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: COLORS.primary,
                  },
                }}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: COLORS.secondaryWhite,
  },
  input: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginRight: 6,
    paddingHorizontal: 12,
  },
});

export default PersonalChat;
