import React, { Component } from 'react';
import {
    View,
    AppRegistry,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    AsyncStorage,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native';
import { Toast , Popover, NavBar, Icon} from 'antd-mobile';
import Communications from 'react-native-communications';
const Item = Popover.Item;
import TabNavigator from 'react-native-tab-navigator';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
const STORAGE_KEY_EXPRESS = "EXPRESS_ID";
const STORAGE_KEY_EXPRESSIDDATA = "EXPRESSIDDATA";
const STORAGE_KEY_REALNAMELIST = "REALNAMELIST";

import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import Increment from './Increment';
import Mine from './Mine';
import PiecesDetail from './PiecesDetail';
import Util from '../util/util';
import RealNameSystem from './RealNameSystem';

var Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;


function dedupe(array){
    return Array.from(new Set(array));
}

export default class SendPieces extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedTab:'非实名制',
            showPopover:false,
            deliveryRegion:'',
        }
    }
    componentWillMount(){
        const { params } = this.props.navigation.state;
       if(params.selectedTab=='增值'){
           this.props.navigation.setParams({ key: params.selectedTab });
           this.setState({
               selectedTab:params.selectedTab,
           });
       }
        if(params.selectedTab=='实名制'){
            this.props.navigation.setParams({ key: params.selectedTab });
            this.setState({
                selectedTab:params.selectedTab,
            });
        }
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
            if(!error){
                if (userInfo !== '' && userInfo !== null){
                    const deliveryRegion = JSON.parse(userInfo).deliveryRegion;

                    this.setState({
                        deliveryRegion:deliveryRegion,
                    });
                }
            }
        })
    }

    // <TouchableOpacity
    // onPress={()=>navigation.state.params.navigatePress()}
    // >
    // <Ionicons style={{marginRight:15}}  name="ios-settings-outline" size={26} color="#fff" />
    // </TouchableOpacity>

    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.state.params.key || '非实名制',
        headerRight:
            navigation.state.params.key=='非实名制'?
            <TouchableOpacity onPress={()=>navigation.state.params.selectedMuen()}>
                <Ionicons style={{marginRight:10}} name="ios-qr-scanner" size={30} color="#4c4c4c" />
            </TouchableOpacity>:( navigation.state.params.key=='我'?
                <View></View>: (navigation.state.params.key=='增值'? <View></View>:(navigation.state.params.key=='实名制'? <View></View>:''))) ||
            <TouchableOpacity onPress={()=>navigation.state.params.selectedMuen()}>
                <Ionicons style={{marginRight:10}} name="ios-qr-scanner" size={30} color="#4c4c4c" />
            </TouchableOpacity>,
        headerLeft: null,
        headerTintColor:(navigation.state.params.key=='我'?'#fff':''),
        headerStyle:(navigation.state.params.key=='我'?{'backgroundColor':'#108ee9'}:''),
    });


    selectedMuen = ()=>{
        const { navigate } = this.props.navigation;
        navigate('Scanning', { transition: 'forVertical'});
        // if(this.state.showPopover==false){
        //    this.setState({
        //        showPopover:true,
        //    })
        // }else{
        //     this.setState({
        //         showPopover:false,
        //     })
        // }
    };
    componentDidMount() {
        this.props.navigation.setParams({ key: this.state.selectedTab });
        // this.props.navigation.setParams({navigatePress:()=>this.clickSetupButton()});
        this.props.navigation.setParams({selectedMuen:()=>this.selectedMuen()});
    }

    // clickSetupButton = ()=>{
    //     const { navigate } = this.props.navigation;
    //     navigate('Setup', { transition: 'forVertical' });
    // };

    _renderTabarItems(selectedTab,icon,selectedIcon,Component){
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={selectedTab}
                titleStyle={styles.tabText}
                selectedTitleStyle={styles.selectedTabText}
                renderIcon={() => icon}
                renderSelectedIcon={() => selectedIcon}
                onPress={() => {
                    this.props.navigation.setParams({ key: selectedTab });
                    this.setState({ selectedTab: selectedTab });
                }}
            >
                <Component navigation={this.props.navigation} />
            </TabNavigator.Item>
        )

    }
    saomiao(){
        const { navigate } = this.props.navigation;
        navigate('Scanning', { transition: 'forVertical' });
        this.setState({
            showPopover:false,
        })
    }
    getxiangji(){
       alert('ewfwefwefwefwe');

    }
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTabarItems('非实名制',<Ionicons name="ios-paper-plane-outline" size={28} color="#696969" />,<Ionicons name="ios-paper-plane" size={28} color="#5996be" />,SendPieces2)}
                    {this._renderTabarItems('增值',<Ionicons name="ios-pricetag-outline" size={28} color="#696969" />,<Ionicons name="ios-pricetag" size={28} color="#5996be" />,Increment)}
                    {this._renderTabarItems('实名制',<Ionicons name="ios-closed-captioning-outline" size={28} color="#696969" />,<Ionicons name="ios-closed-captioning" size={28} color="#5996be" />,RealNameSystem)}
                    {this._renderTabarItems('我',<Ionicons name="ios-contact-outline" size={28} color="#696969" />,<Ionicons name="ios-contact" size={28} color="#5996be" />,Mine)}
                </TabNavigator>
                {
                    this.state.showPopover==true?(
                    <TouchableOpacity style={styles.dilogel} onPress={()=>{this.setState({showPopover:false,})}}>
                        <View style={styles.popoverBox}>
                            <View style={{alignItems:'flex-end'}}><MaterialCommunityIcons style={{height:17,}} name='menu-up' size={28} color="#efeeee" /></View>
                            <View style={styles.popover}>
                                <TouchableOpacity onPress={()=>{this.saomiao()}}>
                                <View style={{borderBottomWidth:1,borderBottomColor:'#ddd',flexDirection:'row',}}>
                                    <View style={{flex:2,alignItems:'center'}}><Ionicons style={{marginTop:12}} name='ios-qr-scanner' size={26} color="#404040" /></View>
                                    <View style={{flex:6}}><Text style={{lineHeight:45,fontSize:16}}>扫一扫</Text></View>
                                </View>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={()=>{this.getxiangji()}}>
                                <View style={{flexDirection:'row',}}>
                                    <View style={{flex:2,alignItems:'center'}}><Ionicons style={{marginTop:12}} name='ios-barcode-outline' size={26} color="#404040" /></View>
                                    <View style={{flex:6}}><Text style={{lineHeight:45,fontSize:16}}>我的二维码</Text></View>
                                </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>

                    ):(
                        null
                    )

                }
            </View>
        );
    }
}

class SendPieces2 extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false, //初始化不刷新
            status:'15002',
            userId: "",
            loaded: false,
            isShow: false,
            status15002:0,
            status15004:0,
            status15003:0,
            animating: false,
            expressIdData:[],
        };
    }


    componentWillMount(){
        this.getPieces();

    }


    /**
     * 读取用户派件信息
     */

     getPieces(){
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
            if(!error){
                if (userInfo !== '' && userInfo !== null){
                    const userId = JSON.parse(userInfo).userId;

                    Util.fetch("mobile/express/realNameList", {userId: userId}, (result) => {
                        if(result.code == "200" && result.data) {
                            let resultData = result.data;
                            console.log(resultData);
                            for(let item of resultData){
                                item.orderFlag = '1';
                            }
                            AsyncStorage.setItem(STORAGE_KEY_REALNAMELIST, JSON.stringify(resultData));
                        }
                    });
                    Util.fetch("mobile/express/list", {userId: userId}, (result) => {
                        if(result.code == "200" && result.data) {
                            let resultData = result.data;

                            for(var i=0; i<resultData.length;i++){
                                resultData[i].flag=true;
                                resultData[i].orderFlag = '0';
                            }
                            let sujuData = [];
                            let idData=[];

                            AsyncStorage.getItem(STORAGE_KEY_EXPRESSIDDATA,(error,expressIdData)=>{
                                if(expressIdData!=null){

                                    let newExpressIdData = JSON.parse(expressIdData);
                                    this.setState({
                                        expressIdData:newExpressIdData,
                                    });

                                    for(var i=0;i<newExpressIdData.length;i++){
                                        for(var j=0;j<resultData.length;j++){
                                            if(newExpressIdData[i]==resultData[j].expressId){
                                                sujuData.push(resultData[j]);
                                                resultData[j].flag=false;
                                                if(resultData[j].status=='15001'||resultData[j].status=='15002'){
                                                    idData.push(newExpressIdData[i]);
                                                }
                                            }
                                        }
                                    }
                                    AsyncStorage.setItem(STORAGE_KEY_EXPRESSIDDATA, JSON.stringify(idData));
                                    for(var item of resultData){
                                        if(item.flag){
                                            sujuData.push(item);
                                        }
                                    }
                                }else{
                                    for(var item of resultData){
                                        if(item.flag){
                                            sujuData.push(item);
                                        }
                                    }
                                }

                                this.saveExpressData(sujuData);
                                let newData = [];
                                let status15002 =0;
                                let status15003 =0;
                                let status15004 =0;
                                let status = this.state.status;
                                if(status=='15002'){
                                    for(var item of sujuData){
                                        if(item.status==status||item.status=='15001'){
                                            newData.push(item);
                                        }
                                    }
                                }else{
                                    for(var item of sujuData){
                                        if(item.status==status){
                                            newData.push(item);
                                        }
                                    }
                                }

                                for(var item of sujuData){
                                    if(item.status=='15002'||item.status=='15001'){
                                        status15002++;
                                    }else if(item.status=='15003'){
                                        status15003++;
                                    }else if(item.status=='15004'){
                                        status15004++;
                                    }
                                }
                                // console.log(newData);
                                if(newData.length==0){
                                    this.setState({
                                        isShow:true,
                                    });
                                }
                                // console.log(newData);
                                // console.log(idData);
                                this.setState({
                                    data:newData,
                                    loaded: true,
                                    status15002:status15002,
                                    status15003:status15003,
                                    status15004:status15004,
                                    loadexpress:false,
                                    userId:userId,
                                });
                            });

                        }
                    });


                }
            }
        })
    }


    /**
     * 存储派件的数据
     */
    saveExpressData(ExpressData){
        AsyncStorage.setItem(STORAGE_KEY_EXPRESS, JSON.stringify(ExpressData) ,(error) =>{
            if(error){

            }
        });
    }

    ToPress = (expressId,userId,status)=>{
        this.props.navigation.navigate('PiecesDetail',{expressId:expressId,userId:userId,status:status});
    };

    zhuahualogo(channelCode){
        if(channelCode==45001){
            return(
                <Image
                style={{width:80,height:80,borderRadius:40,}}
                source={require('../images/haitai.jpg')}

            />
            )

        }
        if(channelCode==45002){
            return(
                <Image
                    style={{width:80,height:80,borderRadius:40,}}
                    source={require('../images/dadi.jpg')}

                />
            )
        }
        if(channelCode==45003){
            return(
                <Image
                    style={{width:80,height:80,borderRadius:40,}}
                    source={require('../images/renbao.jpg')}

                />
            )
        }
        if(channelCode==45004){
            return(
                <Image
                    style={{width:80,height:80,borderRadius:40,}}
                    source={require('../images/lianhe.jpg')}

                />
            )
        }
        if(channelCode==45005){
            return(
                <Image
                    style={{width:80,height:80,borderRadius:40,}}
                    source={require('../images/houyuan.jpg')}

                />
            )
        }
        if(channelCode==45006){
            return(
                <Image
                    style={{width:80,height:80,borderRadius:40,}}
                    source={require('../images/pingan.jpg')}

                />
            )
        }
    }

    renderItem = ({item, index}) => {
        // console.log(index);
        // console.log(item);
        return(
            <View style={{paddingTop:8,backgroundColor:'#efeeee'}}>
            <View style={styles.listContain}>
                <TouchableHighlight
                    disabled={this.state.isDisable}
                    underLayColor ='red'
                    onPress={()=>{this.ToPress(item.expressId,this.state.userId,this.state.status)}}
                >
                    <View style={styles.flastListIntro}>
                        <View style={styles.img}>
                            {this.zhuahualogo(item.channelCode)}
                        </View>
                        <View style={{ flex: 1}}>
                            <View><Text style={styles.listContainItro}>{item.recipient} | {item.plateNumber}</Text></View>
                            <View><Text style={[styles.adress]}>{item.fullAddress}{item.address}</Text></View>
                            <View><Text style={[styles.listContainItro,styles.adress]}>现金：{item.totalPrice}元</Text></View>
                        </View>
                    </View>
                </TouchableHighlight>
                <View>
                    {
                        this.state.status==15002?(
                            <View style={{flexDirection: 'row',padding:8}}>
                                <View style={styles.flalistcontact}><TouchableOpacity onPress={()=>{this.firstSend(item.expressId)}} style={{flexDirection: 'row',}}>
                                    <Ionicons name="ios-paper-plane-outline" size={20} color="#696969" />
                                    <Text style={{color:'#3a3a3a',marginLeft:5,marginTop:3}}>优先送</Text></TouchableOpacity>
                                </View>
                                <View style={styles.flalistcontact}><TouchableOpacity style={{flexDirection: 'row',flex: 1,}} key={item.userPhone} onPress={()=>
                                {
                                    if(item.userPhone!=null){
                                        Communications.phonecall(item.userPhone, true)
                                    }else{
                                        Alert.alert( '温馨提示',
                                            '暂无手机号',[
                                                {text: '关闭', onPress: () => console.log('OK Pressed!')},
                                            ])

                                    }
                                }
                                }>
                                    <Ionicons name="ios-call-outline" size={20} color="#696969" />
                                    <Text style={{color:'#3a3a3a',marginLeft:5,marginTop:3}}>业务员</Text></TouchableOpacity>
                                </View>
                                <View style={{ flex: 1,alignItems:'center'}}><TouchableOpacity style={{flexDirection: 'row',flex: 1,}} key={item.Phone}  onPress={()=>
                                {
                                    if(item.phone!=null){
                                        Communications.phonecall(item.phone, true)
                                    }else{
                                        Alert.alert( '温馨提示',
                                            '暂无手机号',[
                                                {text: '关闭', onPress: () => console.log('OK Pressed!')},
                                            ])
                                    }
                                }
                                }>
                                    <Ionicons name="ios-call-outline" size={20} color="#696969" />
                                    <Text style={{color:'#3a3a3a',marginLeft:5,marginTop:3}}>客户</Text></TouchableOpacity>
                                </View>
                            </View>

                        ):(
                            <View style={{flexDirection: 'row',padding:8}}>
                                <View style={styles.flalistcontact}><TouchableOpacity style={{flexDirection: 'row',flex: 1,}} key={item.userPhone} onPress={()=>{
                                    {
                                        if(item.userPhone!=null){
                                            Communications.phonecall(item.userPhone, true)
                                        }else{
                                            Alert.alert( '温馨提示',
                                                '暂无手机号',[
                                                    {text: '关闭', onPress: () => console.log('OK Pressed!')},
                                                ])
                                        }
                                    }
                                }}>
                                    <Ionicons name="ios-call-outline" size={20} color="#696969" />
                                    <Text style={{color:'#3a3a3a',marginLeft:5,marginTop:3}}>业务员</Text></TouchableOpacity>
                                </View>
                                <View style={{ flex: 1,alignItems:'center'}}><TouchableOpacity style={{flexDirection: 'row',flex: 1,}} key={item.Phone} onPress={()=>{
                                    {
                                        if(item.phone!=null){
                                            Communications.phonecall(item.phone, true)
                                        }else{
                                            Alert.alert( '温馨提示',
                                                '暂无手机号',[
                                                    {text: '关闭', onPress: () => console.log('OK Pressed!')},
                                                ])
                                        }
                                    }
                                }}>
                                    <Ionicons name="ios-call-outline" size={20} color="#696969" />
                                    <Text style={{color:'#3a3a3a',marginLeft:5,marginTop:3}}>客户</Text></TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                </View>
            </View>
            </View>
        )
    };
    _keyExtractor = (item, index) => index;

    //优先派送
    firstSend(expressId){
        this.setState({
            animating: true,
        });
        // let expressIdData =[];
        let expressIdData = this.state.expressIdData;
        expressIdData.unshift(expressId);
        expressIdData = dedupe(expressIdData);
        //派件id保存
        AsyncStorage.setItem(STORAGE_KEY_EXPRESSIDDATA, JSON.stringify(expressIdData));
        let itemsData = [];
        AsyncStorage.getItem(STORAGE_KEY_EXPRESS,(error, ExpressData) =>{
            if (!error){
                if (ExpressData !== '' && ExpressData !== null){
                    const items = JSON.parse(ExpressData);
                    for(let item of items){
                        item.show=true;
                        if(item.expressId==expressId){
                            itemsData.push(item);
                            item.show=false;
                        }
                    }
                    for(let item of items){
                        if( item.show){
                            itemsData.push(item);
                        }
                    }

                    AsyncStorage.setItem(STORAGE_KEY_EXPRESS, JSON.stringify(itemsData) ,(error) =>{
                        if(error){

                        }
                    });
                    let newData2 = [];
                    for(let item of itemsData){
                        if(item.status ==='15002'||item.status ==='15001'){
                            newData2.push(item);
                        }
                    }
                    this.setState({
                        data:newData2,
                        animating: false,
                    });
                }
            }
        })
    }

    //切换派件状态
    expressState(status){
        this.setState({
            status:status,
            loadexpress:true,
        });
        AsyncStorage.getItem(STORAGE_KEY_EXPRESS,(error, ExpressData) =>{
            if (!error){
                if (ExpressData !== '' && ExpressData !== null){
                    const items = JSON.parse(ExpressData);
                    // console.log(items);
                    let newData2 = [];
                    if(status==15002){
                        for(let item of items){
                            if(Number(item.status) ==15002||Number(item.status)==15001){
                                newData2.push(item);
                            }
                        }
                    }else{
                        for(let item of items){
                            if(Number(item.status) ===status){
                                newData2.push(item);
                            }
                        }
                    }
                    if(newData2.length==0){
                        this.setState({
                            isShow:true,
                        });
                    }else{
                        this.setState({
                            isShow:false,
                        });
                    }
                    this.setState({
                        data:newData2,
                        loadexpress:false,
                    });
                    }

                }

        })

    }

    renderLoadingView(){
        return (
            <View style={{alignItems:'center'}} >
                <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
            </View>
        );
    }
    render(){
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return(

            <View style={{paddingBottom:45,backgroundColor:'#fff'}}>
                <ActivityIndicator
                    animating={this.state.animating}
                    style={[styles.centering, {height: 80}]}
                    size="large" />
                <View style={styles.containerNav}>
                    <TouchableOpacity  style={[this.state.status==15002?styles.navBotton : '',styles.navBotton2]} onPress={() => {this.expressState(15002) }}>
                        <View style={styles.paisong}><Text style={{color:'#fff',fontSize:12}}>{this.state.status15002}</Text></View>
                        <View style={{justifyContent:'center',height:40}}><Text>派送中</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity  style={[this.state.status==15004?styles.navBotton : '',styles.navBotton2]} onPress={() => {this.expressState(15004) }}>
                        <View style={styles.fail}><Text style={{color:'#fff',fontSize:12}}>{this.state.status15004}</Text></View>
                        <View style={{justifyContent:'center',height:40}}><Text>失败</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity  style={[this.state.status==15003?styles.navBotton : '',styles.navBotton2]} onPress={() => {this.expressState(15003) }}>
                        <View style={styles.sucess}><Text style={{color:'#fff',fontSize:12}}>{this.state.status15003}</Text></View>
                        <View style={{justifyContent:'center',height:40}}><Text>成功</Text></View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.loadexpress==true?(
                        <View style={{alignItems:'center',height:1500,backgroundColor:'#fff'}} >
                            <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
                        </View>
                    ):(
                        this.state.isShow==true?(
                            <View style={{alignItems:'center',paddingTop:50,}}>
                                <Text>暂无派件资料！</Text>
                            </View>
                        ):(
                            <View style={{paddingBottom:45,}}>
                                <FlatList
                                    data={this.state.data}
                                    renderItem={this.renderItem}
                                    keyExtractor={this._keyExtractor}
                                    refreshing={this.state.refreshing}
                                    onRefresh={() => {
                                        this.setState({refreshing: true})//开始刷新
                                        //这里模拟请求网络，拿到数据，2s后停止刷新
                                        this.getPieces();
                                        setTimeout(() => {
                                            Toast.success('刷新成功!', 1);
                                            this.setState({refreshing: false});
                                        }, 2000);
                                    }}
                                />
                            </View>
                        )
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
    text:{
        fontSize:16,
        lineHeight:20,
    },
    tabText:{
        color:'#696969',
        fontSize:12,
    },
    selectedTabText:{
        color:'#5996be'
    },
    containerNav:{
        borderBottomWidth:0.5,
        borderBottomColor:'#ddd',
        height:43,
        flexDirection: 'row',
        backgroundColor:'#fff',
        justifyContent:'center'
    },
    listContain:{
        backgroundColor:'#fff',
        marginBottom:0,
        borderBottomWidth:1,
        borderBottomColor:'#efeeee'
    },
    listContainItro:{
        lineHeight:25,
    },
    TouchableOpacity:{
        backgroundColor:'#108ee9',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:5,
        paddingBottom:5,
        borderRadius:5,
        borderWidth:0.5,
        borderColor:'#108ee9'
    },
    TouchableOpacityElse:{
        borderWidth:0.5,
        backgroundColor:null,
        borderColor:'#108ee9'
    },
    adress:{
        fontSize:13,
        color:'#868788',
    },
    img:{
        width:82,
        height:82,
        borderRadius:50,
        borderWidth:0.5,
        borderColor:'#ddd',
        marginRight:10,
    },
    flastListIntro:{
        flexDirection: 'row',
        borderBottomColor:'#ddd',
        borderBottomWidth:0.5,
        padding:5,
        paddingTop:10,
        paddingBottom:10
    },
    navBotton:{
        borderBottomColor:'#108ee9',
        borderBottomWidth:2,
        height:43,
    },
    navBotton2:{
        flex: 1,
        alignItems:'center',
        position:'relative',
    },

    lineHeight40Color:{
        color:'#108ee9',
    },
    paisong:{
        position:'absolute',
        width:20,
        height:20,
        backgroundColor:'red',
        top: 6,
        right:10,
        alignItems:'center',
        borderRadius:30,
        justifyContent:'center',
    },
    fail:{
        position:'absolute',
        width:20,
        height:20,
        backgroundColor:'#646566',
        top: 6,
        right:15,
        alignItems:'center',
        borderRadius:30,
        justifyContent:'center'
    },
    sucess:{
        position:'absolute',
        width:20,
        height:20,
        backgroundColor:'#86bc1f',
        top: 6,
        right:15,
        alignItems:'center',
        borderRadius:30,
        justifyContent:'center',
    },
    flalistcontact:{
        flex: 1,
        alignItems:'center',
        borderRightWidth:0.5,
        borderRightColor:'#ddd',
    },
    image: {
        right: 13,
    },
    text:{
        fontSize:16,
    },
    dilogel:{
        position:'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        height: 600,
        zIndex: 999,
    },
    popoverBox:{
        width:130,
        position: 'absolute',
        zIndex: 1999,
        right: 5,
        top: 0,
    },
    popover:{
        backgroundColor:'#efeeee',
        width:130,
        borderRadius:8,
        paddingLeft:10,
        paddingRight:10,
    },
    centering: {
        paddingTop: 130,
        position:'absolute',
        zIndex:99,
        left:ScreenWidth/2,
    },

});


