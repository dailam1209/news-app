import React from "react";
import { View, StyleSheet} from 'react-native';
import Home from './Home'


function Header () {

    return (
      <View >
            <View style={styles.container}>
                <Home/>
            </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      display: 'flex'
    }
});

export default Header;