import React, { Component } from 'react';
import {
    View,
    AppRegistry,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    AsyncStorage,
} from 'react-native';
import {Toast} from 'antd-mobile';
import { Ionicons } from '@expo/vector-icons';
export default class Setup extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'设置',
        headerRight:null,
    });
    constructor(props){
        super(props);
        this.state={
            isDisable:false,
        }
    }

    _exit(){
        this.props.navigation.navigate('Login', { transition: 'forVertical'});
    };
    _ToChangePwd(){
        this.props.navigation.navigate('ChangePwd',);
    };
    render() {
        return (
            <ScrollView>
            <View style={styles.container}>
                <View style={styles.listTrBox}>
                    <TouchableHighlight  disabled={this.state.isDisable} onPress={()=>{this._ToChangePwd()}} style={{justifyContent:'center'}}>
                    <View style={styles.listTrBoxView}>
                        <View style={{flex:3,justifyContent: 'center',height:45}}><Text style={{fontSize:18}}>登录密码</Text></View>
                        <View style={{flex:8,justifyContent: 'center',height:45}}><Text style={styles.listTrBoxViewRight}>修改</Text></View>
                        <View style={{flex:1,alignItems:'flex-end'}}><Ionicons style={{marginTop:13}} name='ios-arrow-forward' size={20} color="#b8b8b9" /></View>
                    </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.position}>
                    <TouchableOpacity style={styles.exit} onPress={()=>this._exit()}>
                        <Text style={{fontSize:16,}}>退出帐号</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    listTrBox:{
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#fff',
        marginTop:13,
    },
    listTrBoxView:{
        flexDirection:'row',
        borderBottomWidth:0.5,
        borderBottomColor:'#ddd',
        justifyContent:'center',
    },
    listTrBoxViewRight:{
        textAlign:'right',
        color:'#838586',
        fontSize:16
    },
    position:{
        flex:1,
        paddingTop:13,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:10,

    },
    exit:{
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:15,
        paddingBottom:15,
        borderWidth:0.5,
        borderColor:'#ddd',
    }

});