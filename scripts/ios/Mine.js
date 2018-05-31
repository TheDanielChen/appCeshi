import React, { Component } from 'react';
import{
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
    TextInput
} from 'react-native'
import { FileSystem } from 'expo';
import { Ionicons ,FontAwesome } from '@expo/vector-icons';
import Util from '../util/util';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
var Dimensions = require('Dimensions');
let ScreenHeight = Dimensions.get('window').height;
export default class Mine extends Component{
    constructor(props){
        super(props);
        this.state = {
            items:[
                {code:'1',title:'收款汇总',icon:'ios-stats',count:0},
                {code:'2',title:'今日派件',icon:'ios-paper-plane',count:0},
                {code:'3',title:'礼品库存',icon:'ios-archive',count:0},
                {code:'4',title:'派送礼品',icon:'gift',count:0},
                {code:'5',title:'增值服务',icon:'ios-pricetag',count:0},
            ],
            userId:'',
            name:'',
            photos: [],

        };
    }


    componentWillMount(){
        this.getTodayGiftCount();
    }
     getTodayGiftCount(){
        const getTodayGift = this.state.items;
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
            if(!error){
                if (userInfo !== '' && userInfo !== null){
                    const name = JSON.parse(userInfo).name;
                    const userId = JSON.parse(userInfo).userId;
                    console.log('用户'+userId);
                    this.setState({
                        items:getTodayGift,
                        userId:userId,
                        name:name,
                    });
                    Util.fetch("mobile/summary/expressIncome", userId, (result) =>{
                        if(result.code == "200" && result.data){
                            let price =0;
                            for(var i=0 ;i<result.data.length;i++){
                                price += result.data[i].price==null?0:result.data[i].price;
                            }
                            console.log(price)
                            getTodayGift[0].count=price;
                            this.setState({
                                items:getTodayGift,
                            })
                        }
                    });
                    Util.fetch("mobile/homePage/disInfo", userId, (result) =>{
                        if(result.code == "200" && result.data){
                            let count =0;
                            for(var i=0 ;i<result.data.length;i++){
                                count += result.data[i].total==null?0:result.data[i].total;
                            }
                            getTodayGift[1].count=count;
                            this.setState({
                                items:getTodayGift,
                            })
                        }
                    });
                    Util.fetch("mobile/summary/giftLeft", userId, (result) =>{
                        if(result.code == "200" && result.data){
                            let count =0;
                            for(var i=0 ;i<result.data.length;i++){
                                count += result.data[i].amount==null?0:result.data[i].amount;
                            }
                            getTodayGift[2].count=count;
                            this.setState({
                                items:getTodayGift,
                            })
                        }
                    });
                    Util.fetch("mobile/homePage/giftInfo", userId, (result) =>{
                        if(result.code == "200" && result.data){
                            let count =0;
                            for(var i=0 ;i<result.data.length;i++){
                                count += result.data[i].amount==null?0:result.data[i].amount;
                            }
                            getTodayGift[3].count=count;
                            this.setState({
                                items:getTodayGift,
                            })
                        }
                    });
                    let deliveryTime = new Date();
                    let year =deliveryTime.getFullYear() + "";
                    let month = deliveryTime.getMonth()+1;
                    let day = deliveryTime.getDate();
                    const pad = n => n < 10 ? `0${n}` : n;
                    let date = year + pad(month) + pad(day);
                    console.log('日期'+date);
                    Util.fetch("accidentDoc/sumPrice?delivererId="+userId+'&createDate='+date, {},(result) =>{
                        if(result.code == "200"){
                            getTodayGift[4].count=result.data==null?0:result.data;
                        }
                    })
                }
            }
        })
    }

    _clickPro =(code)=>{
        if(code==='1'){
            this.props.navigation.navigate('TotalCash',{userId:this.state.userId});
        }else if(code==='2'){
            this.props.navigation.navigate('TotalPiece',{userId:this.state.userId});
        }else if(code==='3'){
            this.props.navigation.navigate('GiftInventory',{userId:this.state.userId});
        }else if(code==='4'){
            this.props.navigation.navigate('TodayGift',{userId:this.state.userId});
        }else if(code==='5'){
            this.props.navigation.navigate('ToadyIncrements',{userId:this.state.userId});
        }

    };
    _ToSetup(){
        this.props.navigation.navigate('Setup',);
    };


    render(){
        return (
                <View style={styles.container}>
                    <ScrollView ref="scroller">
                    <View style={styles.mineTop}>
                        <View style={styles.logoBox}><Image style={styles.logo} source={require('../images/git.jpg')}/></View>
                        <TouchableHighlight  disabled={this.state.isDisable} onPress={()=>{this._ToSetup()}} style={{justifyContent:'center'}}>
                        <View style={{marginLeft:10,justifyContent:'center'}}>
                            <View style={{flexDirection:'row',}}><Text style={{color:"#fff",fontSize:19,fontWeight:'bold'}}>{this.state.name}</Text>
                                <Ionicons style={{marginTop:4,marginLeft:7}} name='ios-arrow-forward' size={14} color="#fff" />
                            </View>
                            <View style={{flexDirection:'row',}}>
                                {/*<Text style={{color:"#fff",marginTop:7}}>18662511029</Text>*/}
                                {/*<Ionicons style={{marginTop:8,marginLeft:7}} name='ios-arrow-forward' size={14} color="#fff" />*/}
                            </View>
                        </View>
                        </TouchableHighlight>
                    </View>
                    <View>
                        {(()=>{
                            return this.state.items.map(item=>{
                                    return(
                                        <View style={styles.listTrBox} key={item.code}>
                                            <TouchableHighlight  disabled={this.state.isDisable} onPress={()=>{this._clickPro(item.code)}}>
                                                <View style={styles.listTrBoxView}>
                                                    <View style={{flex:2,alignItems:'center'}}>
                                                        {
                                                            item.code!=4?<Ionicons style={{marginTop:12}} name={item.icon} size={24} color="#47aaf1" />
                                                            :<FontAwesome style={{marginTop:12}} name={item.icon} size={22} color="#47aaf1" />
                                                        }
                                                    </View>
                                                    <View style={{flex:10,justifyContent: 'center',height:45}}><Text style={{fontSize:16}}>{item.title}</Text></View>
                                                    <View style={{flex:4,justifyContent: 'center',height:45}}><Text style={styles.listTrBoxViewRight}>{item.count.toFixed(2)}</Text></View>
                                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                                        <Ionicons style={{marginTop:13}} name='ios-arrow-forward' size={20} color="#b8b8b9" />
                                                    </View>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    )
                            })
                        })()}
                    </View>
                    </ScrollView>
                </View>
         )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoBox:{
        width:80,
        height:80,
    },
    logo:{
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:4,
        borderColor:'#47aaf1'
    },
    mineTop:{
        backgroundColor:'#108ee9',
        flexDirection:'row',
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,

    },
    listTrBox:{

        paddingLeft:10,
        paddingRight:10
    },
    listTrBoxView:{
        flexDirection:'row',
        borderBottomWidth:0.5,
        borderBottomColor:'#ddd'
    },
    listTrBoxViewRight:{
        textAlign:'right',
        color:'#838586',
        justifyContent: 'center',
    },
});