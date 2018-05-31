import React, { Component } from 'react';
import {
    View,
    AppRegistry,
    Text,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    ReactNative,
    AsyncStorage,
    ImageBackground
} from 'react-native';
import { Button ,Toast} from 'antd-mobile';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var Dimensions = require('Dimensions');
let ScreenHeight = Dimensions.get('window').height;
import { Ionicons } from '@expo/vector-icons';
import Util from '../util/util';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
const STORAGE_KEY_LOGIN_USER_NAMEPAD = "LOGIN_USER_NAMEPAD";
const STORAGE_KEY_EXPRESSIDDATA = "EXPRESSIDDATA";

export default class LoginScreen extends Component {
    static navigationOptions = {
        headerTitle: 'Welcome',
        header:null,
        gesturesEnabled:false,
    };
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password:'',
        };
    }

    componentWillMount(){
        // this.loadUserData().done();
        this.getUserLogin();
    }

    getUserLogin(){
        // AsyncStorage.removeItem(STORAGE_KEY_LOGIN_USER_NAMEPAD);
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_NAMEPAD,(error, userLogin) =>{
            if(!error){
                if (userLogin !== '' && userLogin !== null){
                    const userName = JSON.parse(userLogin).username;
                    const passWord = JSON.parse(userLogin).password;
                    this.setState({
                        username: userName,
                        password:passWord,
                    })
                }
            }
        })
    }

    _login = ()=>{
        const { navigate } = this.props.navigation;
        Util.fetch("mobile/user/login", {username: this.state.username, password: this.state.password}, (result) => {
            if(result.code == "200" && result.data) {
                let saveUserLogin = {username: this.state.username,password: this.state.password};
                this.saveUserLogin( saveUserLogin);
                this.saveUserData(result.data);
                navigate('SendPieces', { transition: 'forVertical'});
            } else {
                Toast.info("账户或者密码错误！",0.5)
            }
        });
    };

    /**
     * 存储登入帐号密码
     */
    saveUserLogin(userNamePad){
        AsyncStorage.setItem(STORAGE_KEY_LOGIN_USER_NAMEPAD, JSON.stringify(userNamePad) ,(error) =>{
            if(error){
                console.log(error);
            }
        });
    };

    /**
     * 存储用户信息
     * @param userId
     * @param userName
     */
    async saveUserData(userInfo) {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_LOGIN_USER_INFO, JSON.stringify( userInfo));
            // await AsyncStorage.setItem(STORAGE_KEY_LOGIN_USER_NAME, userName);
        } catch (error) {
            console.log(error);
        }
    }

    render() {

        return (
                <ScrollView ref="scrollView">
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y:0}}
                    scrollEnabled={false}
                >
                <View>
                <ImageBackground  style={styles.backgroundImage} source={require('../images/loginBg.jpg')} resizeMode='cover'>
                    <View style={{alignItems: 'center', }}><View style={styles.logoBox}><Image style={styles.logo} source={require('../images/git.jpg')}/></View></View>
                    <Text style={styles.text}>Welcome</Text>

                    <View style={{borderColor:'#aacfe6',borderBottomWidth:1,flexDirection: 'row'}}>
                        <View style={{width:50,height: 40}}><Ionicons style={{marginTop:3,marginLeft:6,}} name="ios-person-outline" size={32} color="#fff" /></View>
                        <View style={{flex:1}}>
                            <TextInput
                                style={{height: 40, color:'#fff',fontSize:16,padding:0,}}
                                onChangeText={(username) => this.setState({username})}
                                placeholder="请输入账号"
                                placeholderTextColor="#fff"
                                value={this.state.username}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>
                    <View style={{borderColor:'#aacfe6',borderBottomWidth:1,flexDirection: 'row',marginTop:10,}}>
                        <View style={{width:50,height: 40}}><Ionicons style={{marginLeft:6}} name="ios-lock-outline" size={32} color="#fff" /></View>
                        <View style={{flex:1}}>
                            <TextInput
                                style={{height: 40, color:'#fff',fontSize:16,padding:0,}}
                                onChangeText={(password) => this.setState({password})}
                                ref = 'downloadInput'
                                placeholder="请输入密码"
                                placeholderTextColor="#fff"
                                secureTextEntry={true}
                                value={this.state.password}
                                returnKeyType='none'
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    <Button disabled={this.state.isDisable} style={{marginTop:30,backgroundColor:'rgba(250,250,250,0.3)',borderWidth:0,}} className="btn"
                            onClick={()=>this._login()}>登  录
                    </Button>

                </ImageBackground >
                </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
        );
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    logoBox:{
        width:100,
        height:100,
        marginTop:70,
    },
    logo:{
      width:100,
        height:100,
        borderRadius:50,
    },
    text:{
        fontSize:30,
        lineHeight:50,
        color:'#fff',
        textAlign:'center',
    },
    backgroundImage:{
        flex:1,
        width:null,
        height:ScreenHeight,
        backgroundColor:'rgba(0,0,0,0)',
        paddingLeft:20,
        paddingRight:20,
    }
});

