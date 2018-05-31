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
    TextInput,
    AsyncStorage,
} from 'react-native';
import Util from '../util/util';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
import { Toast} from 'antd-mobile';
import { Ionicons } from '@expo/vector-icons';
export default class ChangePwd extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'修改密码',
        headerRight:null,
    });
    constructor(props){
        super(props);
        this.state={
            isDisable:false,
            oldPwd:'',
            newPwd:'',
            reNewPwd:'',
            focused:true,
        }
    }
    comonentDidMount(){
        console.log('A componentDidMount');
    }

    async _changePwd(){
        let newPwd = this.state.newPwd;
        let reNewPwd = this.state.reNewPwd;
        let oldPwd = this.state.oldPwd;
        if(newPwd!=reNewPwd){
            Toast.info("确认新密码不一致！")
        }else if(newPwd.length==null||newPwd.length==0){
            Toast.info("密码不能为空！")
        }else{
            AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
                if(!error){
                    if (userInfo !== '' && userInfo !== null){
                        const userId = JSON.parse(userInfo).userId;
                        console.log('用户'+userId);
                        Util.fetch("mobile/user/changePsd",{id:userId,oldPassword:oldPwd,newPassword:newPwd}, (result) =>{
                            if(result.code == "200"){
                                Toast.info("密码修改成功 ！",1,()=>{
                                    this.props.navigation.navigate('Login', { transition: 'forVertical'});
                                });
                            }else if(result.code == "500"){
                                Toast.info(result.message)
                            }
                        });
                    }}
            })


        }
    }
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.listTrBox}>
                        <View style={{marginBottom:15,}}>
                            <TextInput
                                style={styles.TextInput}
                                onChangeText={(oldPwd) => this.setState({oldPwd})}
                                value={this.state.oldPwd}
                                placeholder='当前密码'
                                autoFocus={this.state.focused}
                                secureTextEntry={true}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={{marginBottom:15,}}>
                            <TextInput
                                style={styles.TextInput}
                                onChangeText={(newPwd) => this.setState({newPwd})}
                                value={this.state.newPwd}
                                placeholder='新密码'
                                secureTextEntry={true}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={{marginBottom:15,}}>
                            <TextInput
                                style={styles.TextInput}
                                onChangeText={(reNewPwd) => this.setState({reNewPwd})}
                                value={this.state.reNewPwd}
                                placeholder='确认新密码'
                                secureTextEntry={true}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>
                    <View style={styles.position}>
                        <TouchableOpacity style={styles.exit} onPress={()=>this._changePwd()}>
                            <Text style={{fontSize:16,}}>确认提交</Text>
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
        marginTop:13,
    },
    listTrBoxView:{
        flexDirection:'row',
        borderBottomWidth:0.5,
        borderBottomColor:'#ddd'
    },
    listTrBoxViewRight:{
        lineHeight:45,
        textAlign:'right',
        color:'#838586',
        fontSize:16
    },
    position:{
        flex:1,
        paddingTop:13,
        paddingLeft:10,
        paddingRight:10,
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
    },
    TextInput:{
        height: 45,
        borderColor: '#ddd',
        borderWidth: 0.5,
        backgroundColor:'#fff',
        paddingLeft:10
    }

});