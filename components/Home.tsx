import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet,ScrollView,  TouchableOpacity, Image, Button, ActivityIndicator } from 'react-native';
import Iterm from "./Iterm";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../untils/useHooks";
import { changeUrl } from "../reducer/Url/urlRedux";
import { getLocalStorage } from "../untils/getLocalStorage";
import BlueManager from "./Blx-manager/BlueManager";



interface listProp {
    listNew: Array<any>
}
function Home ({ navigation } : any)  {

  // handle url and change screen
  const dispatch = useAppDispatch();
  const url = useAppSelector((state) => state.url.url);
  const listNew = useAppSelector((state) => state.listNew.listNew);
  const isLoading = useAppSelector((state) => state.listNew.isLoading);
  const [ token, setToken ] = useState('');
  const handleGoToDetail = (title: string) => {
    dispatch(
        changeUrl(
            title
        )
    )
    navigation.navigate('Detail'); 
  };
  const itemsPerRow = 2;
  const numberOfRows = Math.ceil(listNew?.length / itemsPerRow);


  


  //get token
  const getToken = async () => {
    const _id = await getLocalStorage('token');
    console.log('-id', _id);
  }

  return (
        <>
            {
                listNew && Array.from(listNew).length > 0 ? (
                    <ScrollView  >
                        <View style={{
                            marginBottom: 60,
                    }}>
                            <View style={styles.container}>
                                {Array.from({ length: numberOfRows }).map((_, rowIndex) => (
                                    <View key={rowIndex} style={styles.row}>
                                        {Array.from(listNew).slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow)
                                            .map((item: any, index: number) => (
                                                <Iterm
                                                    key={index} onPress={() => handleGoToDetail(item.url)} iterm={item}
                                                />
                                            ))}
                                    </View>
                                ))}
                            </View>
                            <View>
                                <BlueManager/>
                            </View>
                        </View>
                    
                    </ScrollView>
                ) : (
                <View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(100, 100, 100, 0.6)'
                }}>
                        <ActivityIndicator size="large"/>
                        <Text style={styles.indicatorText}>Loading...</Text>
                </View>
                )
            }
        </>
    )
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
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
      },
});

export default Home;
