import React, { Component } from 'react';
import {
    View,
    AppRegistry,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    ScrollView,
    TouchableHighlight,
    AsyncStorage,
    Image,
} from 'react-native';
import $codes_data from '../util/code';
import { List ,Toast} from 'antd-mobile';
import Util from '../util/util';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
const STORAGE_KEY_SAOMIAO = "SAOMIAO_ID";
const Item = List.Item;
const Brief = Item.Brief;
var Dimensions = require('Dimensions');
let ScreenHeight = Dimensions.get('window').height;

export default class ScannDetail extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'扫描详情',
        headerRight:null,
    });
    constructor(props) {
        super(props);
        this.state = {
            isDisable:false,//是否被禁用,
            data:[],
            isShow: true,
            expressId:'',
            userId:'',
        };
    }

    componentWillMount(){
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
            if(!error){
                if (userInfo !== '' && userInfo !== null){
                    const userId = JSON.parse(userInfo).userId;
                    console.log('用户'+userId);
                    this.setState({
                        userId:userId,
                    });
                }}
        });
        AsyncStorage.getItem(STORAGE_KEY_SAOMIAO,(error, ExpressData) =>{
            if (!error){
                if(ExpressData !== '' && ExpressData !== null){
                    const items = JSON.parse(ExpressData);
                    items.companyCode=$codes_data.t[items.companyCode];
                    items.status=$codes_data.t[items.status];
                    let expressId = items.id;
                    let data =[];
                    data.push(items);
                    console.log(expressId);
                    this.setState({
                        data:data,
                        isShow:false,
                        expressId:expressId,
                    });
                }
            }
        })
    }

    componentDidMount(){

    }
    componentWillUnMount() {
        this.timerSucess && clearTimeout(this.timerSucess)
        this.timerFail && clearTimeout(this.timerFail)
    }
     sendpiece(){
        var userId = this.state.userId;
        var expressId = this.state.expressId;

         console.log(expressId);
        Util.fetchfix("mobile/express/document/assign", 'expressId='+expressId+'&delivererId='+userId, (result) =>{
            if(result.code == "200" && result.data){
                Toast.info("分配完成！",1,()=>{
                    this.props.navigation.navigate('SendPieces', { transition: 'forVertical'});
                });

            }
        })

    }
    notsendpiece(){
        this.props.navigation.navigate('SendPieces', { transition: 'forVertical'});
    }

    render(){
        return (
            <View>
                {
                    this.state.isShow==true?(
                        <View style={{alignItems:'center',height:1500,backgroundColor:'#fff'}} >
                            <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
                        </View>
                    ):(
                        <View style={{position:'relative',}}>
                            <ScrollView>
                                <View style={styles.container}>
                                    {(()=>{
                                        return this.state.data.map(item =>{
                                            return(
                                                <View key={item.id}>
                                                    <List className="my-list">
                                                        <Item extra={item.recipient} >姓名</Item>
                                                        <Item extra={item.plate} >车牌号</Item>
                                                        <Item extra={item.companyCode}>保险公司</Item>
                                                        <Item extra={item.deliveryTime}>派送日期</Item>
                                                        <Item multipleLine>
                                                            派送地址 <Brief>{item.address}{item.detailAddress}</Brief>
                                                        </Item>
                                                        <Item multipleLine>
                                                            备注 <Brief> {item.remark} </Brief>
                                                        </Item>
                                                        <Item extra={item.status}>状态</Item>
                                                        <Item extra={item.salesmanName}>业务员</Item>
                                                        <Item extra={item.delivererName}>上次派送员</Item>
                                                    </List>
                                                </View>
                                            )
                                        })
                                    })()}
                                </View>
                            </ScrollView>
                            <View style={styles.position}>
                                <View style={{flex:1,alignItems:'center'}}>
                                    <TouchableOpacity style={styles.TouchableOpacitySucess} underlayColor='#E1F6FF'
                                                      disabled={this.state.isDisable}
                                                      onPress={()=>{this.sendpiece()}}
                                    >
                                      <Text style={styles.text}>派送</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1,alignItems:'center'}}>
                                    <TouchableOpacity  style={styles.TouchableOpacitySad} underlayColor='#E1F6FF'
                                                       disabled={this.state.isDisable}
                                                       onPress={()=>{this.notsendpiece()}}
                                    >
                                       <Text style={styles.text}>不派送</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                }
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#ebeaea',
        paddingBottom:120,
    },
    position:{
        position:'absolute',
        bottom:0,
        flexDirection:'row',
        height:60,
        left:0,
        right:0,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderTopColor:'#ddd',
        paddingTop:13
    },
    TouchableOpacitySucess:{
        width:120,
        borderColor:'#108ee9',
        borderWidth:1,
        borderRadius:20,
       paddingLeft:20,
        paddingRight:20,
    },
    TouchableOpacitySad:{
        width:120,
        borderColor:'#f1565e',
        borderWidth:1,
        borderRadius:20,
        paddingLeft:20,
        paddingRight:20,
    },
    text:{
        color:'#000',
        textAlign:'center',
        lineHeight:35,
        backgroundColor:null,
    }


});
