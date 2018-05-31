import React, { Component } from 'react';
import{
    View,
    AppRegistry,
    Text,
    StyleSheet,
    ActivityIndicator,
    Button,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    AsyncStorage,
    TextInput,
    Modal,
    Vibration,
    Alert,

} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import { FileSystem } from 'expo';
import { List ,} from 'antd-mobile';
import { Ionicons ,FontAwesome } from '@expo/vector-icons';
import Util from '../util/util';
import Communications from 'react-native-communications';
import $codes_data from '../util/code';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
var Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const Item = List.Item;
const Brief = Item.Brief;
// const images = [
//     {
//         url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460"
//     },
//
// ]
export default class RealNameSyetemDetail extends Component{
    static navigationOptions = ({ navigation ,screenProps}) => ({
        headerTitle:'派件详情',
    });
    constructor(props){
        super(props);
        this.state = {
            picVisible:false,
            images:[

            ],
            channelCode:'',
            userId:'',
            price:'',
            code:'',
            expressId:'',
            data:[],  //详情数据
            isShow: true,
            payTypeId:'',
            status:'',
            animating: false,
            isModalCamera:false,
            index:0,
            cashBack:'',
        };
    }


    componentWillMount(){
        const { params } = this.props.navigation.state;
        console.log(params.status);
        this.setState({
            expressId:params.expressId,
            userId:params.userId,
            status:params.status,
        });
        this.getPiecesdetail(params.expressId);
    }

    //获取详情数据
    getPiecesdetail(expressId){
        console.log('派件ID'+expressId);
        Util.fetch("mobile/express/realNameDetail", {expressId: expressId}, (result) => {
            if(result.code == "200" && result.data){
                let items = result.data;
                console.log(items);
                let newData =items[0];
                let Data =[];
                let giftArray;
                let giftList='';
                this.setState({
                    payTypeId:newData.payType,
                    price:newData.totalPrice,
                    cashBack:newData.cashBack,
                    totalPriceFinal:newData.totalPriceFinal,
                    channelCode:newData.channelCode,
                });

                giftArray = newData.giftList;
                newData.companyCode= $codes_data.t[newData.companyCode];
                newData.payType = $codes_data.t[newData.payType];
                let qRCodeUrl = newData.qRCodeUrl;
                let toubaodanUrl = newData.toubaodanUrl;
                let toubaodanUrl1 = newData.toubaodanUrl1;
                for(var g of giftArray){
                    giftList += g.name+'X'+g.amount+'、';
                }
                newData.giftList = giftList;
                let date = newData.deliveryTime;
                let yaer = date.substring(0,4);
                let mon = date.substring(4,6);
                let day = date.substring(6,8);
                newData.deliveryTime = yaer+'-'+mon+'-'+day;
                Data.push(newData);
                let images = this.state.images;
                // images[0].url = toubaodanUrl+ "?" + new Date().getTime();
                if(toubaodanUrl!=null){
                    images.push({url:toubaodanUrl+ "?" + new Date().getTime()})
                }
                if(toubaodanUrl1!=null){
                    images.push({url:toubaodanUrl1+ "?" + new Date().getTime()})
                }
                if(qRCodeUrl!=null){
                    images.push({url:qRCodeUrl+ "?" + new Date().getTime()})
                }

                // images[1].url = toubaodanUrl1+ "?" + new Date().getTime();
                // images[2].url = qRCodeUrl+ "?" + new Date().getTime();


                this.setState({
                    data:Data,
                    isShow:false,
                    images:images,
                });
            }
        });
    }

    ToPressSucess = (userId,expressId,totalPriceFinal,payType,status,cashBack,channelCode)=>{
        this.props.navigation.navigate('RealPiecesSucess',{userId:userId,price:totalPriceFinal,expressId:expressId,payType:payType,status:status,cashBack:cashBack,channelCode:channelCode,});
    };

    ToPressFail = (userId,expressId,status)=>{
        this.props.navigation.navigate('PiecesFail',{userId:userId,expressId:expressId,status:status,orderFlag:'1'});
    };


    //手机号码转换
    phoneZhuanhuan(phone){
        if(phone!=null){
            let phoneNumber = phone.substring(0,3)+'****'+phone.substring(7,11);
            return phoneNumber;
        }else{
            return '';
        }
    }
    showpic(index){
            console.log(index);
        this.setState({
            index:index,
            picVisible:true,
        })
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
                        <View>
                            <ActivityIndicator
                                animating={this.state.animating}
                                style={[styles.centering, {height: 80}]}
                                size="large" />
                            <ScrollView>
                                <View style={styles.container}>
                                    {(()=>{
                                        return this.state.data.map(item =>{
                                            return(
                                                <View key={item.expressId}>
                                                    <List className="my-list">
                                                        <Item extra={item.recipient} >姓名</Item>
                                                        <Item extra={item.plateNumber} >车牌号</Item>
                                                        {
                                                            item.channelCode==45001?(
                                                                <Item extra={item.abCate?item.abCate:'无'} >客户类型</Item>
                                                            ):null
                                                        }
                                                        <Item extra={this.phoneZhuanhuan(item.userPhone)}>电话</Item>
                                                        <Item multipleLine>
                                                            地址 <Brief>{item.fullAddress}{item.address}</Brief>
                                                        </Item>
                                                        <Item extra={item.deliveryTime}>送单时间</Item>
                                                        <Item multipleLine>
                                                            备注 <Brief>{item.remark}</Brief>
                                                        </Item>
                                                        <Item multipleLine>
                                                            派送失败原因 <Brief>{item.failReason}</Brief>
                                                        </Item>
                                                    </List>
                                                    <List className="my-list" style={{marginTop:15,}}>
                                                        {/*{bxCompanyItem}*/}
                                                        <Item extra={item.companyCode}>保险公司</Item>
                                                        <Item multipleLine>
                                                            礼品 <Brief>{item.giftList}</Brief>
                                                        </Item>
                                                        <Item extra={item.name}>业务员姓名</Item>
                                                        <Item extra={item.phone}>业务员电话</Item>
                                                        <Item extra={item.payType}>支付方式</Item>
                                                        <Item extra={item.totalPriceFinal}>登记金额</Item>
                                                        <Item extra={item.totalPrice}>实收金额</Item>
                                                        <Item onClick={()=>{
                                                            if(item.teamLeaderPhone!=null){
                                                                Communications.phonecall(item.teamLeaderPhone, true)
                                                            }else{
                                                                Alert.alert( '温馨提示',
                                                                    '暂无手机号',[
                                                                        {text: '关闭', onPress: () => console.log('OK Pressed!')},
                                                                    ])
                                                            }

                                                        }} extra={item.teamLeaderName}>团队长</Item>
                                                        <Item onClick={()=>{
                                                            if(item.outDocPhone!=null){
                                                                Communications.phonecall(item.outDocPhone, true)
                                                            }else{
                                                                Alert.alert( '温馨提示',
                                                                    '暂无手机号',[
                                                                        {text: '关闭', onPress: () => console.log('OK Pressed!')},
                                                                    ])
                                                            }

                                                        }} extra={item.outDocName}>出单人</Item>
                                                        <Item extra={item.payCode}
                                                              onClick={()=>{
                                                                  Alert.alert( '实名制支付码',
                                                                      item.payCode,[
                                                                          {text: '关闭', onPress: () => console.log('OK Pressed!')},
                                                                      ])
                                                              }}
                                                        >实名制支付码</Item>
                                                        <Item extra={item.cashBack}>返现金额</Item>
                                                    </List>
                                                </View>
                                            )
                                        })
                                    })()}
                                    <View style={{backgroundColor:'#fff',marginTop:15,paddingLeft:10,paddingRight:10,}}>
                                        <View style={{borderBottomWidth:0.5,borderBottomColor:'#ddd',justifyContent:'center',height:45,}}><Text style={{fontSize:16,}}>实名制资料</Text></View>
                                        <View style={{flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#ddd'}}>
                                            {(()=>{
                                                return this.state.images.map((item,key)=>{
                                                    return (
                                                        <View style={{flex:1,}} key={key}>
                                                            <TouchableOpacity  onPress={()=>{this.showpic(key)}} >
                                                                <Image style={styles.pic} source={{
                                                                    uri:item.url
                                                                }} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })
                                            })()}

                                        </View>
                                    </View>

                                </View>
                            </ScrollView>
                            <View>
                                {
                                    this.state.status==15003?(null):(<View style={styles.position}>
                                        <View style={{flex:1,alignItems:'center'}}>
                                            <TouchableOpacity style={styles.TouchableOpacitySucess} underlayColor='#E1F6FF'
                                                              disabled={this.state.isDisable}
                                                              onPress={()=>this.ToPressSucess(this.state.userId,this.state.expressId,this.state.totalPriceFinal,this.state.payTypeId,this.state.status,this.state.cashBack,this.state.channelCode)}
                                            >
                                                <Ionicons name="ios-happy-outline" size={28} color="#108ee9" /><Text style={styles.text}>成功</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flex:1,alignItems:'center'}}>
                                            <TouchableOpacity  style={styles.TouchableOpacitySad} underlayColor='#E1F6FF'
                                                               disabled={this.state.isDisable}
                                                               onPress={()=>this.ToPressFail(this.state.userId,this.state.expressId,this.state.status)}
                                            >
                                                <Ionicons name="ios-sad-outline" size={28} color="#f1565e" /><Text style={styles.text}>失败</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>)
                                }
                            </View>
                        </View>
                    )
                }
                <Modal visible={this.state.picVisible} transparent={true}
                     onRequestClose={() => {
                              this.setState({
                                picVisible:false,
                             })
                         }}

                   >
                        <ImageViewer
                          imageUrls={this.state.images}
                          index={this.state.index}
                          failImageSource={{

                               width: Dimensions.get("window").width,
                             height: Dimensions.get("window").width,

                          }}
                            onClick={()=>{
                               this.setState({
                                   picVisible:false,
                              })
                           }}
                        />

                   </Modal>
            </View>


            // <View style={styles.container}>
            //     <ScrollView ref="scroller">
            //             <View>
            //                 <TouchableOpacity  onPress={()=>{this.showpic()}}>
            //                     <Image style={styles.pic} source={{
            //                         uri: this.state.images[0].url
            //                     }} />
            //                 </TouchableOpacity>
            //             </View>
            //             <View>
            //
            //             </View>
            //
            //     </ScrollView>
            //     <Modal visible={this.state.picVisible} transparent={true}
            //            onRequestClose={() => {
            //                this.setState({
            //                    picVisible:false,
            //                })
            //            }}
            //
            //     >
            //         <ImageViewer
            //             imageUrls={this.state.images}
            //             failImageSource={{
            //
            //                 width: Dimensions.get("window").width,
            //                 height: Dimensions.get("window").width,
            //
            //             }}
            //             onClick={()=>{
            //                 this.setState({
            //                     picVisible:false,
            //                 })
            //             }}
            //         />
            //
            //     </Modal>
            // </View>

        )
    }
}
const styles = StyleSheet.create({

    pdf: {
        flex:1
    },
    pic:{
        width: 80,
        height: 90,
        margin: 5,
        resizeMode: 'contain',
    },
    container: {
        backgroundColor:'#ebeaea',
        paddingBottom:60,
    },
    container2: {
        backgroundColor: 'ivory',
    },
    centering: {
        paddingTop: 130,
        position:'absolute',
        zIndex:99,
        left:ScreenWidth/2,
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
        paddingTop:2,
        paddingLeft:30,
        paddingRight:5,
        flexDirection:'row',
    },
    TouchableOpacitySad:{
        width:120,
        borderColor:'#f1565e',
        borderWidth:1,
        borderRadius:20,
        paddingTop:2,
        paddingLeft:30,
        paddingRight:5,
        flexDirection:'row',
    },
    text:{
        color:'#000',
        textAlign:'center',
        marginLeft:5,
        marginTop:8
    },
    picture: {
        width: 80,
        height: 90,
        margin: 5,
        resizeMode: 'contain',
    },
    navigation: {
        flex: 1,
    },
    gallery: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    flipButton: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipSnapButton:{
        width:70,
        height:70,
        borderRadius:35,
        borderWidth:8,
        borderColor:"#ddd",
        justifyContent:'center',
        alignItems:'center',
    },
    flipText: {
        color: '#fff',
        fontSize: 15,
        backgroundColor:null,
    },
    item: {
        margin: 4,
        backgroundColor: 'indianred',
        height: 35,
        width: 80,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picButton: {
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    pictures: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    backButton: {
        padding: 20,
        marginBottom: 4,
        backgroundColor: 'indianred',
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


    containerCamera: {
        flex: 1,
        backgroundColor: 'ivory',
    },

    flipButton2: {
        flex: 0.3,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipSnapButton2:{
        width:70,
        height:70,
        borderRadius:35,
        borderWidth:8,
        borderColor:"#ddd",
        justifyContent:'center',
        alignItems:'center',
    },
    flipText2: {
        color: '#fff',
        fontSize: 15,
        backgroundColor:null,
    },
    picButton2: {
        backgroundColor: '#fff',
    },
    galleryButton: {
        backgroundColor: 'indianred',
    },

    pictures2: {
        flex: 1,
        flexWrap: 'wrap',

    },
    picture2: {
        flex:1,
        resizeMode: 'contain',
        height:ScreenHeight,
    },

});