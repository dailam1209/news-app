import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Vibration,
  Alert,
  FlatList,
  Pressable,
  ImageBackground,
  ScrollView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useCallback, useRef, useMemo} from 'react';
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
import {launchImageLibrary} from 'react-native-image-picker';
// icon
import LeftSVG from '../assets/misc/left-icon.svg';
import SendSVG from '../assets/misc/send-icon.svg';
import MenuSVG from '../assets/misc/menu-icon.svg';
import CallSVG from '../assets/misc/call-icon.svg';
import ImageSVG from '../assets/misc/image-icon.svg';
import TongueSVG from '../assets/misc/emoji_emoticons_tongue_icon.svg';
import LaughSVG from '../assets/misc/emoji_emoticon_happy_laugh_icon.svg';
import CryingSVG from '../assets/misc/emoji_bad_cry_crying_disappointed_face_icon.svg';
import DislikeSVG from '../assets/misc/emoji_angry_dislike_expression_social_icon.svg';
import NoneSeenSVG from '../assets/misc/emoji_none_seen.svg';
import {useAppDispatch, useAppSelector} from '../hooks/useHooks';
import {requestConfig} from '../helpers/newApi';
import {sendNotification} from '../helpers/sendNotification';
import {TouchableWithoutFeedback} from 'react-native';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {changeRoom} from '../reducer/numberRedux';
import {StackActions} from '@react-navigation/native';
import {NavigationActions} from 'react-navigation';

var FormData = require('form-data');

interface PerrsonProps {
  navigation: any;
  route: any;
}

const PersonalChat: React.FC<PerrsonProps> = ({route, navigation}) => {
  const paramRoom = useAppSelector(state => state.number.number);
  const params = route.params.roomId ? route.params : paramRoom;
  const {username, reciever, roomId, imageUser, isOnline, typeRoom} = params;
  const toCall = {username, reciever, roomId, imageUser, isOnline, typeRoom};
  const icons = [
    <TongueSVG width={16} height={16} />,
    <LaughSVG width={16} height={16} />,
    <CryingSVG width={16} height={16} />,
    <DislikeSVG width={16} height={16} />,
    <NoneSeenSVG width={16} height={16} />,
  ];

  const iconsCheck = [
    <TongueSVG width={30} height={30} style={{margin: 2}} />,
    <LaughSVG width={30} height={30} style={{margin: 2}} />,
    <CryingSVG width={30} height={30} style={{margin: 2}} />,
    <DislikeSVG width={30} height={30} style={{margin: 2}} />,
    <NoneSeenSVG width={30} height={30} style={{margin: 2}} />,
  ];
  const user = useAppSelector(state => state.user.user);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [messages, setMessages] = useState([] as any);
  const [listOffline, setListOffline] = useState([] as any);
  const [users, setUsers] = useState<any>([]);
  const limitMessage = 15;
  const [fetchIsLoading, setFetchIsLoading] = useState(true);
  const [listIcon, setListIcon] = useState([] as any);
  const [idMessage, setIdMessage] = useState<String>('');
  const isFetchNextRef = useRef(false);
  const dispatch = useAppDispatch();

  const [replyMsg, setReplyMsg] = React.useState({
    replyId: null,
    text: '',
    user: null,
    image: '',
    icons: [] as any,
  });

  // api

  const getAllUserOfRoom = async () => {
    const users = await requestConfig(
      'GET',
      user.token,
      null,
      `get-user-room/${roomId}`,
      null,
      null,
      true,
    );
    if (users.status == 200) {
      setUsers(users.data.users);
    }
  };

  const listUserOffline = async () => {
    const listUserOfflineResponse = await requestConfig(
      'POST',
      user.token,
      null,
      `api/get-all-message/${roomId}`,
      {fcmToken: user.fcmToken},
      null,
      true,
    );
    return listUserOfflineResponse.data.listOffline;

    // setListOffline(() => listUserOfflineResponse.data.listOffline);
  };

  const getAllChat = async () => {
    setFetchIsLoading(true);
    try {
      //  await listUserOffline();

      const messagesRoomResponse = await requestConfig(
        'POST',
        user.token,
        null,
        `api/check-message/${roomId}?limit=${limitMessage}&nextPage=${currentPage}`,
        {},
        null,
        true,
      );

      if (Array.isArray(messagesRoomResponse?.data?.messages)) {
        let page = Number(messagesRoomResponse.data.page);
        setCurrentPage(page + 1);
        const lastMessageConvert = messagesRoomResponse.data.messages.filter(
          message => message.text !== '' || message.image !== '',
        );
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, lastMessageConvert as any),
        );
      } else {
        console.error('No messages found or invalid data structure.');
      }
    } catch (error) {
      console.error('Error in getAllChat:', error);
    }
    setFetchIsLoading(false);
  };

  const submitMessageData = async (data: any) => {
    await requestConfig(
      'POST',
      user?.token,
      null,
      `api/create-message/${data.reciever}`,
      data,
      null,
      true,
    );
  };

  const isLoadingMessage = async (limit: number, next: number) => {
    const oldMessage = await requestConfig(
      'POST',
      user.token,
      null,
      `api/check-message/${roomId}?limit=${limit}&nextPage=${next}`,
      {fcmToken: user.fcmToken},
      null,
      true,
    );
    if (oldMessage.data.messages.length > 0) {
      let page = Number(oldMessage.data.page);
      setCurrentPage(page + 1);

      const lastMessageConvert = await oldMessage.data.messages.filter(
        message => message.text !== '' || message.image !== '',
      );
      setMessages(previousMessages =>
        GiftedChat.prepend(previousMessages, lastMessageConvert),
      );
    } else {
      isFetchNextRef.current = true;
    }
    setFetchIsLoading(false);
  };

  // end api

  // handle get return url in icloud to update in database and show it
  const getUrlWhenChooseImage = async (url: string) => {
    // init property photo
    const form = new FormData();
    const photo = {
      uri: url,
      type: 'image/jpeg',
      name: 'name',
    };
    form.append('image', photo);

    const image = await requestConfig(
      'POST',
      user?.token,
      'have',
      'api/image/get-url',
      form,
      null,
      true,
    );

    const data = await image.data;
    if (image.status == 200) {
      return data.image;
    }
  };

  // handle picture
  const handlePhotoPicker = async () => {
    const userOff = await listUserOffline();
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
            image: urlImage,
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
        let message = {
          sender: user._id,
          reciever: reciever ? reciever : user._id,
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
              text: 'Đã gửi một hình ảnh.',
              user: imageMsg.user,
            },
          ],
        };

        await submitMessageData(message);
        await sendNotification(userOff, messageFCM.messages);
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
    const {text, system, image, trashed, selecting} = props.currentMessage;
    const onLeftAction = useCallback(
      ({isActivated}) => {
        if (isActivated) {
          Vibration.vibrate(50);
          setReplyMsg({
            replyId: props.currentMessage._id,
            text,
            user: props.currentMessage.user.name,
            image: image ? image : '',
            icons,
          });
        }
      },
      [reciever],
    );
    const onRightAction = useCallback(
      ({isActivated}) => {
        if (isActivated) {
          Vibration.vibrate(50);
          setReplyMsg({
            replyId: props.currentMessage._id,
            text,
            user: props.currentMessage.user.name,
            image: image ? image : '',
            icons,
          });
        }
      },
      [reciever],
    );

    return (
      <SwipeRow
        useNativeDriver
        onLeftActionStatusChange={onLeftAction}
        onRightActionStatusChange={onRightAction}
        disableLeftSwipe
        disableRightSwipe={
          !!(system || trashed || selecting)
          // system
          // ||
          // props.currentMessage.user?.name === currentUser?.nickname ||
          // props.currentMessage.isReply ||
          // props.currentMessage?.audio ||
          // props.currentMessage?.image
        }
        leftActivationValue={20}
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
          {replyMsg.text && (
            <Text
              style={{
                color: '#034f84',
                paddingLeft: 10,
                paddingTop: 5,
                marginBottom: 2,
              }}>
              {replyMsg.text}
            </Text>
          )}

          <Image
            source={{uri: replyMsg.image}}
            style={{
              width: 40,
              height: 40,
              margin: 4,
            }}
          />
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
            onPress={() =>
              setReplyMsg({
                replyId: null,
                text: '',
                user: null,
                image: '',
                icons,
              })
            }>
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
        {props.currentMessage?.isReply.user && (
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
                  {props.currentMessage?.isReply?.text && (
                    <Text
                      style={{
                        color: 'white',
                        paddingHorizontal: 10,
                        paddingTop: 5,
                        marginBottom: 5,
                      }}>
                      {props.currentMessage?.isReply?.text}
                    </Text>
                  )}

                  <Image
                    source={{uri: props.currentMessage.isReply.image}}
                    style={{
                      width: props.currentMessage?.isReply.image ? 100 : 0,
                      height: props.currentMessage?.isReply.image ? 60 : 0,
                      marginLeft: props.currentMessage?.isReply.image ? 2 : 0,
                      marginBottom: props.currentMessage?.isReply.image ? 4 : 0,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

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
    return (
      <TouchableOpacity
        onPress={() => {
          setIdMessage('');
          setIdMessage(props.currentMessage._id);
        }}
        onPressOut={() => setIdMessage('')}>
        <CustomMessageText {...props} />
      </TouchableOpacity>
    );
    // if (props.currentMessage.isReply.user) {
    //   return <CustomMessageText {...props} />;
    // } else {
    //   return (
    //     <Pressable onPress={() => setIdMessage(props.currentMessage._id)}
    //     onPressOut={() => setIdMessage('')}
    //     >

    //       <MessageText
    //         style={{
    //           marginBottom: 0,
    //           marginTop: 0,
    //         }}
    //         {...props}
    //       />
    //     </Pressable>
    //   );
    // }
  };

  // send message with socket and save in database
  const onSendMessage = async (messages = []) => {
    const {_id, createdAt, text, user} = messages[0];
    const userOff = await listUserOffline();
    console.log('userOff', userOff);
    const newMessage = [
      {
        _id: _id,
        text: text,
        createdAt: createdAt,
        user: user,
        sent: true,
        received: reciever,
        seen: false,
        isReply: replyMsg.text || replyMsg.image ? replyMsg : {},
      },
    ];

    if (text !== '') {
      socket.emit('send_message', {
        receverId: reciever,
        roomId: roomId,
        messages: newMessage,
      });

      const message = {
        sender: user._id,
        reciever: reciever ? reciever : user._id,
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
      if (userOff) {
        promises.push(sendNotification(userOff, message.messages));
      }

      Promise.all(promises)
        .then(results => {})
        .catch(error => {});

      setReplyMsg({
        replyId: null,
        text: '',
        user: null,
        image: '',
        icons,
      });
    }
  };

  const renderTicks = currentMessage => {
    // const tickedUser =  currentMessage[0].user._id
    return (
      // <View
      //   style={[{
      //     position: 'absolute',
      //     top: 16.2,
      //     right: -14,
      //     width: 30,
      //     height: 20,
      //   },
      //   currentMessage.user._id !== user._id && styles.stickitLeft
      // ]}>
      //   {!!currentMessage.sent && !!currentMessage.received && (
      //     <Text style={{fontSize: 9,color: COLORS.gray, paddingRight: 10}}></Text>
      //   )}
      // </View>
      <View
        style={[
          {
            position: 'absolute',
            top: 13,
            left: -4,
            flex: 1,
            minWidth: 18,
            height: 18,
          },
          currentMessage.user._id !== user._id && styles.stickitLeft,
        ]}>
        {currentMessage._id == idMessage && (
          <View
            style={{
              zIndex: 1000000000000,
              flexDirection: 'row',
              backgroundColor: COLORS.secondaryWhite,
              width: 'auto',
              height: 40,
              bottom: 64,
              left: -180,
              alignItems: 'center',
              justifyContent: 'space-between',
              elevation: 4,
              borderRadius: 10,
              padding: 10,
            }}>
            <FlatList
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                width: 'auto',
                height: 40,
              }}
              data={iconsCheck}
              renderItem={({item, index}) => (
                <TouchableWithoutFeedback
                    style={{
                      flex: 1,
                      backgroundColor: 'blue',
                    }}
                    onPressIn={() => {
                      console.log('aaaaaaaaaaaa');
                      // console.log('listIcon.includes(icons) !== -1', listIcon.includes(icons) !== -1);
                      // if(listIcon.includes(icons) !== -1) {
                        // setListIcon((pre: any) => [...pre, item]);
                      // setReplyMsg({
                      //     replyId: null,
                      //   text: '',
                      //   user,
                      //   image: '',
                      //   icons: icons.push(iconsCheck[index]),
                      // });
                      // console.log('listIcon', listIcon);
                      // }
                    }}>
                        <View
                          style={{
                            margin: 3.5,
                          }}>
                    {/* {item} */}
                    <TongueSVG width={16} height={16} />
                </View>
                  </TouchableWithoutFeedback>
              )}
            />
            <View style={styles.triangle}></View>
          </View>
        )}
        <TouchableWithoutFeedback
          style={{
            position: 'absolute',
            width: 20,
            height: 16,
          }}
          onPress={() => {
            // setIdMessage('');
            // setIdMessage(currentMessage._id);
          }}>
          <FlatList
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              width: 60,
              height: 18,
            }}
            data={replyMsg.icons}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.iconContainer,
                  index > 0 ? styles.iconOverlap : null,
                ]}>
                {item}
              </View>
            )}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };
  function renderAvatar(props) {
    return <>{typeRoom !== '' && <Avatar {...props} />}</>;
  }

  function renderScrollToBottomWrapper() {
    const scrollToBottomComponent = (
      <View
        style={{
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
          shadowOffset: {width: 0, height: 0},
          shadowRadius: 1,
        }}>
        <TouchableOpacity
          onPress={this.scrollToBottom}
          hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
          <Text>V</Text>
        </TouchableOpacity>
      </View>
    );

    if (this.props.scrollToBottomComponent) {
      return (
        <TouchableOpacity
          onPress={this.scrollToBottom}
          hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
          {this.props.scrollToBottomComponent}
        </TouchableOpacity>
      );
    }
    return scrollToBottomComponent;
  }
  const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToTop = 80;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  };

  useEffect(() => {
    (async () => {
      if (route.params.roomId) {
        dispatch(changeRoom(route.params));
      } else {
        dispatch(changeRoom(paramRoom));
      }
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
          image: data.messages[0].image && data.messages[0].image,
          isReply: data.messages[0]?.isReply,
        };
        setMessages((previousMessages: any) =>
          GiftedChat.append(
            previousMessages,
            data.receverId !== user._id ? data.messages : [imageMsg],
          ),
        );
      });
      await getAllUserOfRoom();
    })();
  }, [roomId]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <StatusBar style="light" backgroundColor={COLORS.yellow} /> */}
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setIdMessage('');
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <View style={{overflow: 'hidden', paddingBottom: 3}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  backgroundColor: COLORS.white,
                  height: 60,
                  elevation: 3,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={async () => {
                      socket.emit('leave_room', {
                        username: user.username,
                        room: roomId,
                      });
                      navigation.navigate('BottomTabNavigation', {
                        screen: 'Chats',
                        initial: false,
                      });
                      await requestConfig(
                        'POST',
                        user.token,
                        '',
                        `api/left-room/${roomId}`,
                        {
                          fcmToken: user.fcmToken,
                        },
                        null,
                        true,
                      );
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
                      <Text style={{...FONTS.h4, marginLeft: 8}}>
                        {username}
                      </Text>
                      <View>
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            backgroundColor: isOnline
                              ? COLORS.green
                              : COLORS.gray,
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
                    zIndex: 100,
                  }}>
                  {/* <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CallVideo', toCall);
                  }}
                  style={{
                    marginRight: 10,
                  }}>
                  <CallSVG width={24} height={30} color={COLORS.primary} />
                </TouchableOpacity> */}

                  <View>
                    <ZegoSendCallInvitationButton
                      invitees={users.map(inviteeID => {
                        return {
                          userID: inviteeID._id,
                          userName: 'user_' + inviteeID.username,
                        };
                      })}
                      isVideoCall={false}
                      resourceID={'zegouikit_call'} // For offline call notification
                    />
                  </View>
                  <View
                    style={{
                      marginLeft: 16,
                    }}>
                    <ZegoSendCallInvitationButton
                      invitees={users.map(inviteeID => {
                        return {
                          userID: inviteeID._id,
                          userName: 'user_' + inviteeID.username,
                        };
                      })}
                      isVideoCall={true}
                      resourceID={'zegouikit_call'} // For offline call notification
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{
                      marginLeft: 10,
                    }}>
                    <MenuSVG width={24} height={30} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
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
                shouldUpdateMessage={() => (typeRoom ? false : true)}
                renderAvatar={renderAvatar}
                renderSend={renderSend}
                renderMessageText={renderMessageText}
                renderTicks={renderTicks}
                infiniteScroll
                scrollToBottom={true}
                scrollToBottomOffset={500}
                scrollToBottomComponent={renderScrollToBottomWrapper}
                loadEarlier={fetchIsLoading}
                // isKeyboardInternallyHandled={false}
                listViewProps={{
                  scrollEventThrottle: 400,
                  onScroll: async ({nativeEvent}) => {
                    if (isCloseToTop(nativeEvent)) {
                      setFetchIsLoading(true);
                      if (!fetchIsLoading && isFetchNextRef.current == false) {
                        await isLoadingMessage(limitMessage, currentPage);
                      }
                    }
                  },
                }}
              />
              <View
                style={{
                  height: '1%',
                  width: '100%',
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  },
  iconContainer: {
    alignItems: 'center',
    alignContent: 'center',
  },
  iconOverlap: {
    marginLeft: -8, // Overlap each icon by 50%
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.secondaryWhite,
    position: 'absolute',
    top: 40,
    right: 12,
  },
});

export default PersonalChat;
