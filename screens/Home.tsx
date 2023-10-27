import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView, FlatList} from 'react-native';
// import Iterm from '../components/Iterm';
import Iterm from '../components/Iterm'
import {useAppDispatch, useAppSelector} from '../hooks/useHooks';
import {changeUrl} from '../reducer/Url/urlRedux';
import Loading from '../common/Loading';
import {REACT_APP_API_URL} from '@env';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { requestConfig } from '../helpers/newApi';
import { NavigationActions } from 'react-navigation';
import axios from 'axios';
// import  ZegoUIKitPrebuilt from '@zegocloud/zego-uikit-prebuilt';


const appSign = "ba578a7aef466939f6d0fd86b8aa91a0205b562a91a333888fb80bc84eb5b142"
const appId = 649896294;

interface listProp {
  listNew: Array<any>;
}
const Home: React.FC<{navigation: any}> = ({navigation}) => {
  // handle url and change screen
  const dispatch = useAppDispatch();
  const paramRoom = useAppSelector((state) => state.number.number)
  const listNew = useAppSelector(state => state.listNew.listNew);
  const user = useAppSelector(state => state.user.user);
  const timeRef = useRef(0)

  const handleGoToDetail = (title: string) => {
    dispatch(changeUrl(title));
    navigation.navigate('Detail');
  };
  const itemsPerRow = 2;
  const numberOfRows = Math.ceil(listNew?.length / itemsPerRow);
  const urlAgainToStart = () => {
    dispatch(changeUrl(`${REACT_APP_API_URL}`));
  };

  // const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForProduction(appId, "65cfe6854cb44be163a7d10b587c29ac",'', user._id, user.username);
  // const zp = ZegoUIKitPrebuilt.create(TOKEN);
  // zp.addPlugins({ ZIM });

  // zp.setCallInvitationConfig({
  //     enableNotifyWhenAppRunningInBackgroundOrQuit: true,
  // })

  useEffect(() => {
    urlAgainToStart();
    ZegoUIKitPrebuiltCallService.init(
      appId,
      appSign,
      user?._id,
      user?.username,
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        notifyWhenAppRunningInBackgroundOrQuit: true,
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
        requireConfig: (data) => {
          return {
            onOnlySelfInRoom: () => { 
            //   navigation.reset({
            //   index: 0,
            //   routes: [{ name: "PersonalChat",
            //   params: paramRoom}]
            // })
            },
              // onHangUp: () => { 
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: "PersonalChat",
            //   params: paramRoom}]
            // })
            // navigation.navigate("PersonalChat",  paramRoom)
          //  },
          durationConfig: {
              isVisible: true,
              onDurationUpdate: (duration) => {
                // timeRef.current = duration
              },
          },
          };
      },
      },
    );
   
  }, []);

  return (
    <>
      {listNew && Array.from(listNew).length > 0 ? (
        <ScrollView
          style={{
            width: '100%',
            margin: 'auto',
          }}>
          {/* <View
            style={{
              marginBottom: 60,
            }}>
            <View style={styles.container}>
              {Array.from({length: numberOfRows}).map((_, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {Array.from(listNew)
                    .slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow)
                    .map((item: any, index: number) => (
                      <Iterm
                        key={index}
                        onPress={() => handleGoToDetail(item.url)}
                        iterm={item}
                      />
                    ))}
                </View>
              ))}
            </View>
          </View> */}
          <FlatList
            numColumns={2}
            initialNumToRender={200}
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 60
            }}
            data={listNew}
            renderItem={({item, index}) => (
              <Iterm
                key={index}
                onPress={() => handleGoToDetail(item.url)}
                iterm={item}
              />
            )}
          />
        </ScrollView>
      ) : (
        <Loading />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
  },
});

export default Home;
