import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Vibration,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import  {REACT_APP_API_URL}  from '@env'
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FONTS} from '../constants';
import {StatusBar} from 'expo-status-bar';
import {SwipeRow} from 'react-native-swipe-list-view';
import {
  GiftedChat,
  Send,
  Bubble,
  InputToolbar,
  Composer,
  MessageText,
} from 'react-native-gifted-chat';
import {socket} from '../config/config';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {getImage, getId, getToken, getUsername} from '../helpers/userApi';
// icon
import LeftSVG from '../assets/misc/left-icon.svg';
import SendSVG from '../assets/misc/send-icon.svg';
import MenuSVG from '../assets/misc/menu-icon.svg';
import ImageSVG from '../assets/misc/image-icon.svg';
import { getAllMessageOfRoom, submitMessage } from '../reducer/User/userService';

interface PerrsonProps {
  navigation: () => void;
  route: any;
}

const PersonalChat: React.FC<PerrsonProps> = ({route, navigation}) => {
  const {userName, idReciever, imageRecever, roomId, fcmReciever, isOnline} =
    route.params;
  const [messages, setMessages] = useState([] as any);
  const [idUser, setIdUser] = useState<String>();
  const [token, setToken] = useState<String>();
  const [username, setUsername] = useState<String>('');
  const [image, setImage] = useState<any>('');
  const [listUserInRoom, setListUserInRoom] = useState([] as any);

  const [replyMsg, setReplyMsg] = React.useState({
    replyId: null,
    text: '',
    user: null,
  });

  // api
  const setValue = async () => {
    let newImage = await getImage();
    let newUsername = await getUsername();
    let newToken = await getToken();
    let newId = await getId();
    setImage(newImage);
    setIdUser(newId as string);
    setToken(newToken);
    setUsername(newUsername as string);
  };

  const getAllChat = async () => {
    let lastMessageConvert = [];
    const messages = await getAllMessageOfRoom(roomId);
    messages?.messages?.map((message: any) => {
        if(message.text !== '') {
          lastMessageConvert.push(message);
        }
    });
    setMessages(lastMessageConvert.reverse());
  };

  const submitMessageData = async (data: any) => {
    await submitMessage(data)
  };

  // end api


  // handle get return url in icloud to update in database and show it
  const getUrlWhenChooseImage = async (url: string) => {
    try {
      // init property photo
      console.log('url', url);
      const photo = {
        uri: url,
        type: 'image/jpeg',
        name: 'name',
      };

      const form = new FormData();
      form.append('avatar', photo as any);
      // config header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'multipart/form-data',
        },
      };
      // post to get message url
      const response = await axios.post(
        `${REACT_APP_API_URL}/api/get-url`,
        form,
        config,
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      Alert.alert(`${error.message}`);
    }
  };

  

  // handle picture
  const handlePhotoPicker = async () => {
    let url: any = '';
    const result = await launchImageLibrary({
      mediaType: 'photo',
      // quality: 1,
      includeBase64: false,
    });
    if (result.didCancel && result.didCancel == true) {
      url = '';
      return;
    } else {
      const urlImage = await getUrlWhenChooseImage(result?.assets[0]?.uri);
      if (urlImage) {
        let imageMsg = [
          {
            _id: messages.length + 1,
            text: '',
            createdAt: new Date(),
            user: {
              _id: idUser,
              name: username,
              avatar: image,
            },
            image: urlImage ? urlImage.image : '',
          },
        ];
        (imageMsg.user = {
          _id: idUser,
          name: username,
          avatar: image,
        }),
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, imageMsg as any),
          );

        socket.emit('send_message', {
          receverId: idReciever,
          roomId: roomId,
          messages: imageMsg,
        });
      }
    }
  };

  //styling send button
  const renderSend = props => {
    return (
      <>
        <Send {...props}>
          <SendSVG
            width={26}
            height={48}
            marginRight={2}
            color="#096eda"
            alignItems="center"
          />
        </Send>
      </>
    );
  };

  // render all message
  const renderBubble = props => {
    return (
      <>
        <BubbleComp props={props} />
      </>
    );
  };

  // show all message
  const BubbleComp = ({props}) => {
    const {text, system} = props.currentMessage;
    const onLeftAction = useCallback(
      ({isActivated}) => {
        if (isActivated) {
          Vibration.vibrate(50);
          setReplyMsg({
            replyId: props.currentMessage._id,
            text,
            user: userName,
          });
        }
      },
      [idReciever],
    );

    return (
      <SwipeRow
        useNativeDriver
        onLeftActionStatusChange={onLeftAction}
        disableLeftSwipe
        disableRightSwipe={
          // !!(system || trashed || selecting)
          system
          // ||
          // props.currentMessage.user?.name === currentUser?.nickname ||
          // props.currentMessage.isReply ||
          // props.currentMessage?.audio ||
          // props.currentMessage?.image
        }
        leftActivationValue={90}
        leftActionValue={0}
        swipeKey={idReciever + ''}>
        <></>
        <Bubble
          {...props}
          re
          wrapperStyle={{
            left: {backgroundColor: '#F4183B', marginBottom: 10},
            right: {backgroundColor: '#D4D4D4', marginBottom: 10},
          }}
          textStyle={{
            left: {color: '#fff'},
            right: {color: '#2A2E31'},
          }}
          timeTextStyle={{
            left: {color: '#fff'},
            right: {color: '#2A2E31'},
          }}
          tickStyle={{
            color: props.currentMessage?.seen ? '#01A35D' : '#999',
          }}>
          <></>
        </Bubble>
      </SwipeRow>
    );
  };

  // reply message
  const Reply = () => {
    return (
      <View
        style={{
          height: 55,
          flexDirection: 'row',
          marginTop: 10,
          backgroundColor: 'rgba(0,0,0,.1)',
          borderRadius: 10,
          position: 'relative',
        }}>
        <View style={{height: 55, width: 5, backgroundColor: 'red'}}></View>
        <View style={{flexDirection: 'column', overflow: 'hidden'}}>
          <Text
            style={{
              color: 'red',
              paddingLeft: 10,
              paddingTop: 5,
              fontWeight: 'bold',
            }}>
            {replyMsg?.user}
          </Text>
          <Text
            style={{
              color: '#034f84',
              paddingLeft: 10,
              paddingTop: 5,
              marginBottom: 2,
            }}>
            {replyMsg.text}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingRight: 2,
            position: 'absolute',
            right: 0,
            top: 0,
          }}>
          <TouchableOpacity
            onPress={() => setReplyMsg({replyId: null, text: '', user: null})}>
            <Text>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // custom when have reply message
  const ReplyWrapper = ({id}) => {
    return <Reply id={id} />;
  };

  // custom inputToolbar
  const renderInputToolbar = props => {
    return (
      <>
        <InputToolbar
          {...props}
          placeholder="Type your message here..."
          containerStyle={{
            backgroundColor: '#cfd2d5',
            borderTopWidth: 0,
            marginHorizontal: 10,
            marginLeft: '12%',
            borderRadius: 80,
            height: 50,
          }}
          textInputStyle={{color: '#000'}}
          renderComposer={props1 => {
            return (
              <View style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    position: 'absolute',
                    top: -65,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                  }}>
                  {replyMsg.replyId && <ReplyWrapper id={replyMsg.replyId} />}
                </View>
                <Composer {...props1} />
              </View>
            );
          }}
          textInputProps={{
            multiline: true,
            returnKeyType: 'go',
            onSubmitEditing: () => {
              if (props.text && props.onSend) {
                let text = props.text;
                props.onSend({text: text.trim()}, true);
              }
            },
          }}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            marginLeft: '2%',
            marginBottom: '0.5%',
            bottom: 0,
          }}
          onPress={handlePhotoPicker}>
          <ImageSVG width={30} height={40} marginLeft={4} />
        </TouchableOpacity>
      </>
    );
  };

  // const renderInputToolbar = props => {
  //   return (
  //     <InputToolbar
  //       {...props}
  //       placeholder="Type your message here..."
  //       containerStyle={{
  //         marginLeft: 15,
  //         marginRight: 15,
  //         marginBottom: 5,
  //         borderRadius: 25,
  //         borderColor: '#fff',
  //         borderTopWidth: 0,
  //       }}
  //       textInputStyle={{color: '#000'}}
  //       renderComposer={props1 => {
  //         return (
  //           <View style={{flex: 1}}>
  //             {replyMsg.replyId && <ReplyWrapper id={replyMsg.replyId} />}
  //             <Composer {...props1} />
  //           </View>
  //         );
  //       }}
  //       textInputProps={{
  //         multiline: true,
  //         returnKeyType: 'go',
  //         onSubmitEditing: () => {
  //           if (props.text && props.onSend) {
  //             let text = props.text;
  //             props.onSend({text: text.trim()}, true);
  //           }
  //         },
  //       }}
  //     />
  //   );
  // };

  // custom message text
  const CustomMessageText = props => {
    return (
      <>
        <View style={{padding: 5}}>
          <View style={{backgroundColor: '#005CB5', borderRadius: 15}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: '100%',
                  width: 10,
                  backgroundColor: '#00468A',
                  borderTopLeftRadius: 15,
                  borderBottomLeftRadius: 15,
                }}
              />
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    color: 'white',
                    paddingHorizontal: 10,
                    // paddingTop: 1,
                    fontWeight: '700',
                  }}>
                  {props.currentMessage?.isReply?.name}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    paddingHorizontal: 10,
                    paddingTop: 5,
                    marginBottom: 5,
                  }}>
                  <Text>is reply</Text>
                  {props.currentMessage?.isReply?.text}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <MessageText
          customTextStyle={{
            marginBottom: 0,
            paddingTop: 0,
            marginTop: 0,
          }}
          {...props}
        />
      </>
    );
  };

  // custom view text
  const renderMessageText = props => {
    if (props.currentMessage.isReply) {
      return <CustomMessageText {...props} />;
    }
    return (
      <MessageText
        {...props}
      />
    );
  };

  // send message with socket and save in database
  const onSendMessage = async (messages = []) => {
    if (idReciever) {
      if (listUserInRoom.includes(idReciever) !== 1) {
        const {_id, createAt, text, user} = messages[0];
        const newMessage = [
          {
            _id: _id,
            text: text,
            createdAt: createAt,
            user: user,
            sent: true,
            received: idReciever,
            seen: true,
          },
        ];
        if(text.trim() !== '') {
          socket.emit('send_message', {
            receverId: idReciever,
            roomId: roomId,
            messages: newMessage,
          });
          setMessages((previousMessages: any) =>
            GiftedChat.append(previousMessages, messages),
          );
          setReplyMsg({
            replyId: null,
            text: '',
            user: null,
          });
          const message = {
            sender: idUser,
            reciever: idReciever,
            roomId: roomId,
            messages: [
              {
                text: newMessage[0].text,
                createdAt: Date.now(),
                user: {
                  _id: idUser,
                  name: username,
                  avatar: image,
                },
                image: '',
                sent: true,
                received: true,
                seen: false,
                deleteAt: '',
                hiddenTo: [],
                isReply: {},
              },
            ],
          };
          Promise.all([
            await submitMessageData(message),
            await axios.post(
              'https://fcm.googleapis.com/fcm/send',
              {
                to: fcmReciever,
                notification: {
                  body: messages[0].text,
                  title: messages[0].user.name,
                },
              },
              {
                headers: {
                  Authorization: `key=AAAAOF2GCJw:APA91bGkMJCFJaLMwvbUHOn4HWjNQ7m67eHx1BavDp4yLV3tf2AlgQtss4P0y2X-15qODleynzIIpTHL-lwSSOu-kS5K7sgMiXal4olF5t3ZssGdfJZZ_1htkvNBVlIG1stixCXZQnOy`,
                  'Content-Type': 'application/json',
                },
              },
            ),
          ]).then(error => {
            console.log(error);
          });
        }
      }
    }
  };

  const renderTicks = currentMessage => {
    // const tickedUser =  currentMessage[0].user._id
    return (
      <View
        style={{
          position: 'absolute',
          top: -20,
          right: -10,
        }}>
        {!!currentMessage.sent && !!currentMessage.received && (
          <Text style={{color: 'gold', paddingRight: 10}}>✓</Text>
        )}
      </View>
    );
  };


  

  useEffect(() => {
    setValue();
    (async () => {
      const newToken = await getToken();
      const idFirst = await getId();
      let name = await getUsername();
      await getAllChat();
      // connect socket io
      socket.connect();
      socket.emit('connected', {
        name: name,
        room: roomId,
      });
      // reciever message in socket
      socket.on('receive_message', function (data) {
        let imageMsg = {
          _id: messages.length + 1,
          text: data.messages[0].text,
          createdAt: data.messages[0].createdAt,
          user: {
            _id: data.messages[0].user._id,
            name: userName ? userName : username,
            avatar: imageRecever ? imageRecever : image,
          },
          image: data.image ? data.image : '',
        };
        setMessages((previousMessages: any) =>
          GiftedChat.append(
            previousMessages,
            data.receverId !== idUser ? data.messages : [imageMsg],
          ),
        );
      });
    })();
  }, []);

  return (
    <>
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
            <TouchableOpacity
              onPress={() => {
                socket.emit('leave_room', {username: username, room: roomId});
                navigation.goBack();
              }}>
              <LeftSVG width={20} height={18} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 14,
                borderRadius: '2px',
              }}>
              <Image
                source={
                  imageRecever !== ''
                    ? {uri: `${imageRecever}`}
                    : {
                        uri: 'https://hope.be/wp-content/uploads/2015/05/no-user-image.gif',
                      }
                  // UserImage
                }
                resizeMode="cover"
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: '#ccc',
                }}
              />
              <View>
                <Text style={{...FONTS.h4, marginLeft: 8}}>{userName}</Text>
                <View>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: isOnline ? COLORS.green : COLORS.gray,
                      top: '52%',
                      marginLeft: 6,
                      marginRight: 4,
                      borderRadius: 3,
                    }}></View>
                  <Text style={{...FONTS.h5, marginLeft: 16}}>
                    {isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
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
            messages={messages}
            onSend={messages => onSendMessage(messages)}
            user={{
              _id: idUser,
              name: username,
              avatar: image,
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            alwaysShowSend
            renderSend={renderSend}
            shouldUpdateMessage={() => true}
            renderMessageText={renderMessageText}
            renderTicks={renderTicks}
          />
          <View
            style={{
              height: '1%',
              width: '100%',
            }}
          />
        </View>
      </SafeAreaView>
    </>
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
