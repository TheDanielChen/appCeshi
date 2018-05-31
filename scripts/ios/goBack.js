import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Text ,View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class NavigationCustomBackMenu extends React.Component {

    render() {
        return (
            <TouchableOpacity
                onPress={()=>{
                    this.props.nav.goBack()
                }}
            >
              <View style={{paddingLeft:13}}><Ionicons style={{marginTop:3,marginLeft:6,}} name="ios-arrow-back" size={26} color="#393a3a" /></View>
            </TouchableOpacity>
        );
    }
}




const styles = StyleSheet.create({

});

