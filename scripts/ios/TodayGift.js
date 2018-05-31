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
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Util from '../util/util';
export default class TodayGift extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'派送礼品',
        headerRight:null,
    });

    constructor(props){
        super(props);
        this.state = {
            items:[
                // {code:'1',title:'礼品一',count:11,need:3,},
                // {code:'2',title:'礼品二',count:11,need:3,},
                // {code:'3',title:'礼品三',count:11,need:3,},
                // {code:'4',title:'礼品四',count:11,need:3,},
                // {code:'5',title:'礼品五',count:11,need:3,},
            ],
            countTotal:0,
            isShow: true,
        };
    }

    componentWillMount(){
        const { params } = this.props.navigation.state;
        var userId = params.userId;
        this.getTodayGift(userId);

    }
    getTodayGift(userId){
        console.log('用户'+userId);
        Util.fetch("mobile/homePage/giftInfo", userId, (result) =>{
            if(result.code == "200" && result.data){
                // console.log(result.data);
                let giftInfo = result.data;
                Util.fetch('mobile/summary/giftLeft',userId, (result) =>{
                    if(result.code == "200" && result.data){
                        let giftLeft = result.data;
                        //计算礼物需要补多少
                        for(var i =0 ;i<giftInfo.length;i++){
                            for(var j =0 ;j<giftLeft.length;j++){
                                if(giftInfo[i].giftId==giftLeft[j].giftId){
                                    giftInfo[i].needCount = giftLeft[j].amount-giftInfo[i].amount;
                                }
                            }
                        }
                        console.log(giftInfo);
                        this.setState({
                            items:giftInfo,
                            isShow:false,
                        })
                    }
                });

            }
        })
    }


    render(){
            return (
                <View style={styles.container}>
                    { this.state.isShow==true?(
                        <View style={{alignItems:'center',height:1500,backgroundColor:'#fff'}} >
                            <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
                        </View>
                    ):(
                        <View>
                            {
                                !this.state.items.length>0?(
                                    <View style={{paddingTop:100,alignItems:'center'}}>
                                        <View><Ionicons name="ios-paper" size={40} color="#666" /></View>
                                        <View><Text style={{color:'#666',fontSize:17,marginTop:15}}>暂无数据</Text></View>
                                    </View>
                                ):(
                                    <ScrollView>
                                        <View>
                                            {(()=>{
                                                return this.state.items.map(item=>{
                                                    return(
                                                        <View style={styles.listTrBox} key={item.giftId}>
                                                            <TouchableHighlight>
                                                                <View style={styles.listTrBoxView}>
                                                                    <View style={{flex:2,alignItems:'center'}}><Ionicons style={{marginTop:12}} name='ios-done-all' size={24} color="#979595" /></View>
                                                                    <View style={{flex:10,justifyContent: 'center',height:45}}><Text style={{fontSize:16}}>{item.name}</Text></View>
                                                                    <View style={{flex:7,justifyContent: 'center',height:45}}><Text style={{color:'red'}}>{item.needCount!=null?item.needCount<0?'需补'+ Math.abs(item.needCount)+'件':null:'暂无'}</Text></View>
                                                                    <View style={{flex:4,justifyContent: 'center',height:45}}><Text style={styles.listTrBoxViewRight}>{item.amount}件</Text></View>
                                                                </View>
                                                            </TouchableHighlight>
                                                        </View>
                                                    )
                                                })
                                            })()}
                                        </View>
                                    </ScrollView>
                                )
                            }
                        </View>

                    )
                    }
                </View>
            )

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    logoBox:{
        width:130,
        height:130,
        borderRadius:65,
        borderWidth:5,
        borderColor:'#108ee9',
        alignItems:'center',
        justifyContent:'center'
    },
    mineTop:{
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#ddd',
    },
    listTrBox:{
        backgroundColor:'#fff',
        paddingLeft:10,
        paddingRight:10
    },
    listTrBoxView:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#ddd',
        justifyContent: 'center',
    },
    listTrBoxViewRight:{
        textAlign:'right',
        color:'#838586'
    },
});