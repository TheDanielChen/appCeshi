import React, { Component } from 'react';
import {
    View,
    AppRegistry,
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    TouchableHighlight,
    TextInput,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker, List ,DatePicker,Toast} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Util from '../util/util';
// const zhNow = moment().locale('zh-cn').utcOffset(8);
const nowTimeStamp = Date.now();
let minDate = new Date(nowTimeStamp);
const pad = n => n < 10 ? `0${n}` : n;
export default class ChangePieceAdress extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'失败提交',
        headerRight:null,
    });
    constructor(props){
        super(props);
        this.state={
            userId:'',
            expressId:'',
            status:'',
            pickerValue:[],
            // date: zhNow,
            dpValue:null,
            visible: false,
            address:'',
            multiline:true,
            data:'',
            failureReasons:'',
            district:[]
        }
    }

    componentWillUnMount(){
        this.timer && clearTimeout(this.timer)
    }
    componentWillMount(){
        Util.fetch("area/jsArea",{}, (result) => {
            let data=[];
            data.push(result);
            this.setState({
                district:data,
            })
        });
        const { params } = this.props.navigation.state;
        console.log(params.userId);
        console.log(params.expressId);
        this.setState({
            expressId:params.expressId,
            status:params.status,
            userId:params.userId,
            failureReasons:params.failureReasons,
            orderFlag:params.orderFlag,
        });
        if(params.orderFlag!='1'){
            Util.fetch("mobile/express/list", {expressId: params.expressId}, (result) => {
                if(result.code == "200" && result.data){
                    let items = result.data;
                    console.log(items);
                    let data=[];
                    data.push(items[0].areaL1Id!=null?items[0].areaL1Id.toString():null);
                    data.push(items[0].areaL2Id!=null?items[0].areaL2Id.toString():null);
                    data.push(items[0].areaL3Id!=null?items[0].areaL3Id.toString():null);
                    let address = items[0].address;
                    let deliveryTime = items[0].deliveryTime;
                    let year = deliveryTime.substring(0,4);
                    let month = deliveryTime.substring(4,6);
                    let day =  deliveryTime.substring(6,8);
                    let strDate=new Date( year+'/'+month+'/'+day);
                    this.setState({
                        pickerValue:data,
                        address:address,
                        dpValue: strDate,
                    })
                }
            });
        }else{
            Util.fetch("mobile/express/realNameList", {expressId: params.expressId}, (result) => {
                if(result.code == "200" && result.data){
                    let items = result.data;
                    console.log(items);
                    let data=[];
                    data.push(items[0].areaL1Id!=null?items[0].areaL1Id.toString():null);
                    data.push(items[0].areaL2Id!=null?items[0].areaL2Id.toString():null);
                    data.push(items[0].areaL3Id!=null?items[0].areaL3Id.toString():null);
                    let address = items[0].address;
                    let deliveryTime = items[0].deliveryTime;
                    let year = deliveryTime.substring(0,4);
                    let month = deliveryTime.substring(4,6);
                    let day =  deliveryTime.substring(6,8);
                    let strDate=new Date( year+'/'+month+'/'+day);
                    this.setState({
                        pickerValue:data,
                        address:address,
                        dpValue: strDate,
                    })
                }
            });
        }



    }


    AddressTijiao = async ()=>{
        let address = this.state.pickerValue;
        let deliveryTime = this.state.dpValue;
        let year =deliveryTime.getFullYear() + "";
        let month = deliveryTime.getMonth()+1;
        let day = deliveryTime.getDate();
        const pad = n => n < 10 ? `0${n}` : n;
        let date = year + pad(month) + pad(day);
        Util.fetch("mobile/express/failure",{
            expressId:this.state.expressId,
            userId:this.state.userId,
            status:'15004',
            areaL1Id:address[0],
            areaL2Id:address[1],
            areaL3Id:address[2],
            deliveryTime:date,
            address:this.state.address,
            failureReasons:this.state.failureReasons,
        }, (result) => {
            console.log(result);
            if(result.code == "200") {
                Toast.success('提交成功',1,()=>{
                    this.props.navigation.navigate('SendPieces', { transition: 'forVertical'});

                });
            }else{
                Toast.info('提交失败',0.5);
            }
        });
    };

        render(){
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style={styles.listTrBox}>
                    <View style={styles.listTrBoxView}>
                        <View style={{flex:3}}><Text style={{lineHeight:45,fontSize:18}}>原因</Text></View>
                        <View style={{flex:8}}><Text style={styles.listTrBoxViewRight}>修改派送信息</Text></View>
                        <View style={{flex:1,alignItems:'flex-end'}}></View>
                    </View>
                </View>
                <Picker
                        title="选择地区"
                        extra="请选择"
                        data={this.state.district}
                        value={this.state.pickerValue}
                        onChange={v => this.setState({ pickerValue: v })}
                    >
                      <List.Item arrow="horizontal" >派送地区</List.Item>
                </Picker>
                <View style={styles.listTrBox}>
                    <View style={styles.listTrBoxView}>
                        <View style={{flex:3}}><Text style={{lineHeight:45,fontSize:18}}>详细地址</Text></View>
                        <View style={{flex:8}}>
                            <TextInput
                                style={styles.TextInput}
                                onChangeText={(address) => this.setState({address})}
                                value={this.state.address}
                                placeholder='请输入详细街道门牌'
                                multiline={this.state.multiline}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>
                </View>
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="请选择"
                    value={this.state.dpValue}
                    minDate={minDate}
                    onChange={dpValue => {
                        this.setState({ dpValue })
                    } }
                >
                    <List.Item arrow="horizontal">送单日期</List.Item>
                </DatePicker>
                <View style={styles.position}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#108ee9',borderRadius:10,alignItems:'center',justifyContent:'center'}} onPress={()=>this.AddressTijiao()}>
                        <Text style={{color:'#fff',fontSize:16,}}>提 交</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor:'#fff',
        flex:1,
    },
    listTrBox:{
        backgroundColor:'#fff',
        paddingLeft:15,
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
        height:80,
        paddingTop:23,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:10,

    },
    TextInput:{
        height: 85,
        backgroundColor:'#fff',
        padding:10,
        lineHeight:25,
        color:'#7d7d7d',
        fontSize:16,
        paddingTop:15,
        textAlignVertical: 'top'
    }

});
