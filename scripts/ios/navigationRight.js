import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

export default class NavigationRight extends React.Component {

    render() {
     /*   const { navigate } = this.props.navigation;*/
        return (
            <TouchableOpacity
                onPress={()=>{
                    alert('fdeqwfwegfre')
                }}
            >
                {/*  <Image style={styles.image} source={require('../../img/navigation/nav_back.png')} ></Image>*/}
                <Text style={[styles.text,styles.image]}>设置</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        right: 13,
    },
    text:{
        fontSize:16,
    }
});