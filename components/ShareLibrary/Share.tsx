// import React, { useEffect } from 'react';
// import {Alert,  View, Button, StyleSheet} from 'react-native';
// import  Share  from 'react-native-share';
// import { useAppSelector } from '../../untils/useHooks';

// const ShareLib = () => {


//   const isTrueChangeTongle = useAppSelector((state) => state.tongle.tongle);

//   const onShare = async () => {
//     const options = {
//         message: 'https://baomoi.vn'
//     }
//     Share.open(options).then(
//     ).catch(err => console.log(err))
//   };

//   useEffect(() => {
//     if(isTrueChangeTongle) {
//       onShare();
//     } 
//   },[isTrueChangeTongle] )
//   return (
//     <View style={styles.share}>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     text: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       color: 'green'
//     },
//     textClicked: {
//       color: 'red',
//       textDecorationLine: 'underline',
//     },
//     modal: {
//       height: 200
//     },
//     share: {
//     }
//   });

// export default ShareLib;