import React, { useEffect } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Iterm from './Iterm';
import {useAppDispatch, useAppSelector} from '../untils/useHooks';
import {changeUrl} from '../reducer/Url/urlRedux';
import Loading from '../common/Loading';
import  {REACT_APP_API_URL}  from '@env';

interface listProp {
  listNew: Array<any>;
}
function Home({navigation}: any) {
  // handle url and change screen
  const dispatch = useAppDispatch();
  const listNew = useAppSelector(state => state.listNew.listNew);
  const user = useAppSelector(state => state.user.user) 

  const handleGoToDetail = (title: string) => {
    dispatch(changeUrl(title));
    navigation.navigate('Detail');
  };
  const itemsPerRow = 2;
  const numberOfRows = Math.ceil(listNew?.length / itemsPerRow);
  const urlAgainToStart = () => {
    dispatch( changeUrl(`${REACT_APP_API_URL}`))
  }

  useEffect(() => {
    console.log('user redux' , user);
    urlAgainToStart();
  })

  return (
    <>
      {listNew && Array.from(listNew).length > 0 ? (
        <ScrollView>
          <View
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
          </View>
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
