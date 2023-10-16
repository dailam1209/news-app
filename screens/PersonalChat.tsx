import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Vibration,
  Alert,
  FlatList,
  
} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {REACT_APP_API_URL} from '@env';
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
  Avatar,
} from 'react-native-gifted-chat';
import {socket} from '../config/config';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
// icon
import LeftSVG from '../assets/misc/left-icon.svg';
import SendSVG from '../assets/misc/send-icon.svg';
import MenuSVG from '../assets/misc/menu-icon.svg';
import ImageSVG from '../assets/misc/image-icon.svg';
import {useAppSelector} from '../untils/useHooks';
import {requestConfig} from '../helpers/newApi';
import { sendNotification } from '../helpers/sendNotification';
var FormData = require('form-data');

interface PerrsonProps {
  navigation: () => void;
  route: any;
}

const PersonalChat: React.FC<PerrsonProps> = ({route, navigation}) => {
  const {username, reciever, imageRecever, roomId, fcmReciever,imageUser, isOnline, typeRoom} =
    route.params;
    console.log("route.params", route.params);
  const user = useAppSelector((state) => state.user.user);
  const [messages, setMessages] = useState([] as any);
  const arrayListUser = []
  const [listOffline, setListOffline ] = useState([] as any);
  const limitMessage = 10;
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ fetchIsLoading, setFetchIsLoading ] = useState(false);
 
  const [replyMsg, setReplyMsg] = React.useState({
    replyId: null,
    text: '',
    user: null,
  });


  // api

  const getAllChat = async () => {
    try {
      const promises = [
        requestConfig("POST", user.token, null, `api/get-all-message/${roomId}`, { fcmToken: user.fcmToken }, null, true),
        requestConfig("POST", user.token, null, `api/check-message/${roomId}?limit=${limitMessage}&nextPage=${currentPage}`, {}, null, true),
      ];
      // Use Promise.all to wait for all promises to resolve
      const [listUserOffline, messagesRoom] = await Promise.all(promises);
      console.log("listUserOffline", listUserOffline);
  
      setListOffline(listUserOffline.data.listOffline)
  
      if (Array.isArray(messagesRoom?.data?.messages)) {
        const lastMessageConvert = messagesRoom.data.messages
          .filter((message) => message.text !== '' || message.image !== '')
          .reverse();
  
          console.log('lastMessageConvert',lastMessageConvert);
        setMessages(lastMessageConvert);
      } else {
        console.error('No messages found or invalid data structure.');
      }
    } catch (error) {
      console.error('Error in getAllChat:', error);
    }
  };

  const isLoadingMessage = async () => {
    const oldMessage = await requestConfig("POST", user.token, null, `api/check-message/${roomId}?limit=${limit}&nextPage=${page}`, { fcmToken: user.fcmToken }, null, true);
    if(oldMessage.data.messages && oldMessage.data.messages.length > 0) {
      const lastMessageConvert = oldMessage.data.messages
        .filter((message) => message.text !== '' || message.image !== '')
        .reverse();
    
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, lastMessageConvert as any),
      );
    } else {
      setFetchIsLoading(true)
    }
  } 

  const submitMessageData = async (data: any) => {
    await requestConfig(
      'POST',
      user?.token,
      null,
      `api/create-message/${reciever}`,
      data,
      null,
      true,
    );
  };

  // end api

  // handle get return url in icloud to update in database and show it
  const getUrlWhenChooseImage = async (url: string) => {
      // init property photo
    

      // const image = await requestConfig("POST", user?.token, null, 'api/image/get-url', form, null, true )

      const form = new FormData();
    const photo = {
      uri: url,
      type: 'image/jpeg',
      name: 'name',
    };
    form.append('image', photo);


    const config = {
      headers: {
        Accpect: 'application/json',
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${user.token}`,
      },
    };
      const response = await axios.post(
        `${REACT_APP_API_URL}/api/image/get-url`,
        form,
        config,
      );
      const data = await response.data;
      if (response.status == 200) {
        return data.image;
      }
  };

  // handle picture
  const handlePhotoPicker = async () => {
    let url: any = '';
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
      // maxHeight: 100,
      // maxWidth: 100,
    });
    if (result.didCancel && result.didCancel == true) {
      url = '';
      return;
    } else {
      const urlImage = await getUrlWhenChooseImage(result?.assets[0]?.uri);
      console.log(urlImage);
      if (urlImage) {
        let imageMsg = [
          {
            _id: messages.length + 1,
            text: '',
            createdAt: new Date(),
            user: {
              _id: user._id,
              name: user.username,
              avatar: user.image,
            },
            image: urlImage ,
          },
        ];
        (imageMsg.user = {
          _id: user._id,
          name: user.username,
          avatar: user.image,
        }),
          


        socket.emit('send_message', {
          receverId: reciever,
          roomId: roomId,
          messages: imageMsg,
        });
        // setMessages(previousMessages =>
        //   GiftedChat.append(previousMessages, imageMsg as any),
        // );
        let message = {
          sender: user._id,
          reciever: reciever,
          roomId: roomId,
          messages: [
            {
              text: '',
              createdAt: Date.now(),
              user: imageMsg.user,
              image: urlImage,
              sent: true,
              received: false,
              seen: false,
              deleteAt: '',
              hiddenTo: [],
              isReply: {},
            },
          ],
        };
        let messageFCM = {
          messages: [
            {
              text: "Đã gửi một hình ảnh.",
              user: imageMsg.user,
            },
          ],
        };

        await submitMessageData(message);
        await sendNotification(listOffline, messageFCM.messages)
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
            user: username,
          });
        }
      },
      [reciever],
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
        swipeKey={reciever + ''}>
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
          <Image source={{uri: replyMsg.text }}/>
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
        <View style={{padding: 4}}>
          <View style={{backgroundColor: '#005CB5', borderRadius: 10}}>
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
                    paddingTop: 1,
                    fontWeight: '700',
                  }}>
                  {props.currentMessage?.isReply?.user}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    paddingHorizontal: 10,
                    paddingTop: 5,
                    marginBottom: 5,
                  }}>
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
    if (props.currentMessage.isReply?.text) {
      return <CustomMessageText {...props} />;
    }
    return (
        <MessageText style={{
          marginBottom: 0,
          marginTop: 0
        }} {...props} />
        
    );
   
  };

  // send message with socket and save in database
  const onSendMessage = async (messages = []) => {
    const {_id, createdAt, text, user} = messages[0];
    const newMessage = [
      {
        _id: _id,
        text: text,
        createdAt: createdAt,
        user: user,
        sent: true,
        received: reciever,
        seen: false,
        isReply: replyMsg.text !== '' ? replyMsg : {}
      },
    ];
    
    if (text.trim() !== '') {
      socket.emit('send_message', {
        receverId: reciever,
        roomId: roomId,
        messages: newMessage,
      });
      // setMessages((previousMessages: any) =>
      //   GiftedChat.append(previousMessages, newMessage),
      // );
      
      const message = {
        sender: user._id,
        reciever: reciever,
        roomId: roomId,
        createAt: createdAt,
        messages: [
          {
            text: newMessage[0].text,
            createdAt: createdAt,
            user: {
              _id: user._id,
              name: user.name,
              avatar: user.image,
            },
            image: '',
            sent: true,
            received: false,
            seen: false,
            deleteAt: '',
            hiddenTo: [],
            isReply: newMessage[0].isReply,
          },
        ],
      };
      const promises = [submitMessageData(message)];
      if (listOffline.length > 0) {
        promises.push(sendNotification(listOffline, message.messages));
      }

      Promise.all(promises)
        .then(results => {
        })
        .catch(error => {
        });

      setReplyMsg({
        replyId: null,
        text: '',
        user: null,
      });
    }
  };

  const renderTicks = currentMessage => {
    // const tickedUser =  currentMessage[0].user._id
    return (
      <View
        style={[{
          position: 'absolute',
          top: 16.2,
          right: -14,
          width: 30, 
          height: 20,
        },
        currentMessage.user._id !== user._id && styles.stickitLeft
      ]}> 
        {!!currentMessage.sent && !!currentMessage.received && (
          <Text style={{fontSize: 9,color: COLORS.gray, paddingRight: 10}}></Text>
        )}
      </View>
    );
  };
  function renderAvatar(props) {
    return (
      <>
      { typeRoom &&
      <Avatar
        {...props}
      />
      }
      </>
    );
  }

  function renderScrollToBottomWrapper () {
    const scrollToBottomComponent = (
      <View style={{
        opacity: 0.8,
        position: 'absolute',
        paddingHorizontal: 15,
        paddingVertical: 8,
        right: 10,
        bottom: 30,
        zIndex: 999,
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
      }}>
        <TouchableOpacity onPress={this.scrollToBottom} hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}>
          <Text>V</Text>
        </TouchableOpacity>
      </View>
    );
  
    if (this.props.scrollToBottomComponent) {
      return (
        <TouchableOpacity onPress={this.scrollToBottom} hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}>
          {this.props.scrollToBottomComponent}
        </TouchableOpacity>
      );
    }
    return scrollToBottomComponent;
  }
  const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToTop = 80;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }  

  useEffect(() => {
    (async () => {
      await getAllChat();
      // connect socket io
      socket.connect();
      socket.emit('connected', {
        name: user.username,
        room: roomId,
      });
      // reciever message in socket
      socket.on('receive_message', function (data) {
        let imageMsg = {
          _id: messages.length + 1,
          text: data.messages[0].text,
          createdAt: data.messages[0].createdAt,
          user: data.messages[0].user,
          image: data.messages[0].image && data.messages[0].image ,
          isReply: data.messages[0]?.isReply
        };
        setMessages((previousMessages: any) =>
          GiftedChat.append(
            previousMessages,
            data.receverId !== user._id ? data.messages : [imageMsg],
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
              onPress={ async() => {
                socket.emit('leave_room', {
                  username: user.username,
                  room: roomId,
                });
                navigation.goBack();
                await requestConfig("POST", user.token, '', `api/left-room/${roomId}`, {
                  fcmToken: user.fcmToken
                }, null, true)

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
                  imageUser
                    ? {uri: imageUser}
                    : {
                        uri: 'https://hope.be/wp-content/uploads/2015/05/no-user-image.gif',
                      }
                  // UserImage
                }
                resizeMode="contain"
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: '#ccc',
                }}
              />
              <View>
                <Text style={{...FONTS.h4, marginLeft: 8}}>{username}</Text>
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
              }}></TouchableOpacity>
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
            onSend={messages => onSendMessage(messages as any)}
            user={{
              _id: user._id,
              name: user.username,
              avatar: user.image,
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            alwaysShowSend
            showAvatarForEveryMessage={true}
            // show avatar
            shouldUpdateMessage={() => typeRoom ? false : true}
            renderAvatar={renderAvatar}
            renderSend={renderSend}
            renderMessageText={renderMessageText}
            renderTicks={renderTicks}
            infiniteScroll
            scrollToBottom={true}
            scrollToBottomOffset={500}
            scrollToBottomComponent={renderScrollToBottomWrapper}
            loadEarlier={true}
            isKeyboardInternallyHandled={false}
            listViewProps={{
              scrollEventThrottle: 400,
              onScroll: async ({ nativeEvent }) => {
                if (isCloseToTop(nativeEvent)) {
                  if(!fetchIsLoading ) {
                    setCurrentPage(() => currentPage + 1)
                    await isLoadingMessage()
                  }
                }
              }
            }}
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
  stickitLeft: {
    left: -2,
  }
});

export default PersonalChat;
