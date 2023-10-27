import React, { Component, useEffect } from 'react';
import {ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { StyleSheet, View } from 'react-native';
import { VIDEO_CALL_APP_APPSIGN } from '@env';
import { useAppSelector } from '../../hooks/useHooks';
import { GROUP_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';


export interface CallVideoProps {
    route: any;
    navigation: any;
}
const appId = 649896294;
const appSign = "ba578a7aef466939f6d0fd86b8aa91a0205b562a91a333888fb80bc84eb5b142"


const CallVideo: React.FC<CallVideoProps> = ({ navigation, route }) => {
    const {username, reciever, roomId, imageUser, isOnline, typeRoom} = route.params;
    const user = useAppSelector((state) => state.user.user);

  return (
    <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID={appId}
                appSign={appSign}
                userID={user._id} 
                userName={user.phone}
                callID={roomId} 
                config={{
                    ...GROUP_VIDEO_CALL_CONFIG,
                    onOnlySelfInRoom: () => { navigation.navigate('Chats') },
                    onHangUp: () => { navigation.navigate('PersonalChat', route.params); },
                    // durationConfig: {
                    //     isVisible: true,
                    //     onDurationUpdate: (duration) => {
                    //         console.log('########CallPage onDurationUpdate', duration);
                    //         if (duration === 5) {
                    //             ZegoUIKitPrebuiltCall.hangUp();
                    //         }
                    //     }
                    // }
                }}
            />
        </View>
  )
}

export default CallVideo;


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})