import React from 'react';
import { StyleSheet, Text, View, AsyncStorage,Animated,Image,Easing ,TouchableOpacity,} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import Util from '../util/util';
import { Toast} from 'antd-mobile';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
const STORAGE_KEY_SAOMIAO = "SAOMIAO_ID";
const STORAGE_KEY_EXPRESS = "EXPRESS_ID";

export default class Scanning extends React.Component {

    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.state = {
            hasCameraPermission: null,
            userId:'',
            saomiaoStatus:true,
            code:null,
            message:'',
            plate:'',
            flag:false,
        };
    }

    static navigationOptions = ({ navigation }) => ({
        headerTitle:'二维码/条码',
        headerRight:null,
    });

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
            if(!error){
                if (userInfo !== '' && userInfo !== null){
                    const userId = JSON.parse(userInfo).userId;
                    this.setState({
                        hasCameraPermission: status === 'granted',
                        userId:userId,
                    });
                }
            }
        })

    }
    goonSaomiao(){
        this.setState({
            code:null,
            flag:false,
        })
    }
    render() {
        const { hasCameraPermission } = this.state;
        const top = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 280]
        });

        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
            <View>
            {
                this.state.code==null?(
                <View style={{flex:1,alignItems:'center',paddingTop:40,}}>
                    <View style={{position:'relative',width:280,height:280,}}>
                        <BarCodeScanner
                            onBarCodeRead={this._handleBarCodeRead}
                            style={{width:280,height:280,}}
                        />
                        <Animated.View // 可选的基本组件类型: Image, Text, View(可以包裹任意子View)
                            style = {{alignItems: 'center',
                                position:'absolute',top:top,left:0,right:0,zIndex:99999}}>
                            <Image style={{width:260}} source={require('../images/saomiao_03.png')}/>
                        </Animated.View >
                    </View>
                    <View>
                        <Text style={{lineHeight:60,}}>把二维码放入框内，可自动扫描!</Text>
                    </View>
                </View>
            ):(
                <View style={{paddingTop:70,paddingLeft:20,paddingRight:20}}>
                    <View style={styles.bordershadow}>
                        <View style={{paddingLeft:20}}>
                            <Text style={{fontSize:16,lineHeight:30,}}>车牌:{this.state.plate}</Text>
                        </View>
                        <View style={{paddingLeft:20}}>
                            <Text style={{fontSize:16}}>{this.state.message}</Text>
                        </View>
                        <View style={{flexDirection:'row',paddingTop:30,paddingBottom:30}}>
                            <View style={{flex:1,alignItems:'center'}}><TouchableOpacity onPress={()=>{this.props.navigation.navigate('SendPieces', { transition: 'forVertical'});}} style={{backgroundColor:'#99ccff',width:100,alignItems:'center'}}><Text style={{color:"#fff",lineHeight:35,}}>返回派件列表</Text></TouchableOpacity></View>
                            <View style={{flex:1,alignItems:'center'}}><TouchableOpacity onPress={()=>{this.goonSaomiao()}} style={{backgroundColor:'#108ee9',width:100,alignItems:'center'}}><Text style={{color:"#fff",lineHeight:35,}}>继续扫描</Text></TouchableOpacity></View>
                        </View>
                    </View>
                </View>
                )
            }
        </View>
            );
        }
    }
    startAnimation() {
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.startAnimation());
    }
    componentDidMount() {
        this.startAnimation();
    }

    componentDidUpdate(){
        let userId = this.state.userId;
        let code = this.state.code;
        let expressId;
        let status;

        if(this.state.flag==false&&code!=null){
            AsyncStorage.getItem(STORAGE_KEY_EXPRESS,(error, ExpressData) =>{
                if (ExpressData !== '' && ExpressData !== null){
                    let items = JSON.parse(ExpressData);

                    for(let item of items){
                        if(item.expressNo==code){
                            this.setState({
                                flag:true,
                            });
                            expressId = item.expressId;
                            status = item.status;
                            this.props.navigation.navigate('PiecesDetail',{expressId:expressId,userId:userId,status:status});
                            return;
                        }
                    }
                    Util.fetchfix("mobile/express/document/find", 'userId='+userId+'&expressNo='+code, (result) =>{
                        console.log(result);
                        if(result.code == "200" && result.data){
                            this.setState({
                                message:result.data.message,
                                plate:result.data.plate,
                                flag:true,
                            });
                        }
                    })
                }
            })



        }


    }

     _handleBarCodeRead = ({ type, data }) => {
        console.log(data);
        this.setState({
            code:data,
        });
    }

}

const styles = StyleSheet.create({
    bordershadow:{ shadowOffset:{ width:2, height:2 },
        shadowColor:'black',
        shadowOpacity:0.2,
        shadowRadius:1,
        backgroundColor:'#fff',
        borderRadius:8,
        paddingTop:30
    }
})