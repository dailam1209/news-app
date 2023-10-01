import { ToastAndroid, Text } from "react-native";

function Toast () {
    const show = (type: string, title: any) => {
    ToastAndroid.showWithGravityAndOffset('Update profile successfully!', ToastAndroid.LONG, ToastAndroid.TOP, 0, 100 );
    }
    return  (
        <Text>aaa</Text>
    )
}