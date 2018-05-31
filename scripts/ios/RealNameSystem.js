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
    TextInput,
    FlatList,
    ActivityIndicator,
    Alert,

} from 'react-native'
import { FileSystem } from 'expo';
import { Toast , Popover, NavBar, Icon} from 'antd-mobile';
import { Ionicons ,FontAwesome } from '@expo/vector-icons';
import Util from '../util/util';
import Communications from 'react-native-communications';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
const STORAGE_KEY_EXPRESSREANNAMESYSTEM = "EXPRESSREANNAMESYSTEM";
const STORAGE_KEY_EXPRESSIDDATA = "EXPRESSIDDATA";     //优先派件ID
const STORAGE_KEY_REALNAMELIST = "REALNAMELIST";
const STORAGE_KEY_EDITEXPRESSIDARRAY = "EDITEXPRESSIDARRAY";    //是否操作ID
const STORAGE_KEY_LASTTIME = "LASTTIME";
import { MaterialCommunityIcons } from '@expo/vector-icons';
var Dimensions = require('Dimensions');
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
function dedupe(array){
    return Array.from(new Set(array));
}
export default class RealNameSystem extends Component{
    constructor(props){
        super(props);
        this.state = {
            realNameSyetemData:[

            ],
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
            editexpressIdArray:[],
            lastTime:'',
        };
    }


    componentWillMount(){
        this.getPieces();

    }
    componentDidMount(){
        setInterval(function () {
            this.refreshGetPieces()
        }.bind(this),30000);
    }

    //获取当前日期
    getNowTime(){
        let deliveryTime = new Date();
        let year =deliveryTime.getFullYear() + "";
        let month = deliveryTime.getMonth()+1;
        let day = deliveryTime.getDate();
        let hours = deliveryTime.getHours();
        let minutes = deliveryTime.getMinutes();
        let seconds = deliveryTime.getSeconds();
        const pad = n => n < 10 ? `0${n}` : n;
        let time = year + pad(month) + pad(day)+pad(hours)+pad(minutes)+pad(seconds);
        return time;
    }
    /**
     * 读取用户派件信息
     */

    getPieces(){
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
            if(!error){
                if (userInfo !== '' && userInfo !== null){
                    const userId = JSON.parse(userInfo).userId;
                    console.log('用户'+userId);
                    let lastTime = this.getNowTime();
                    console.log(lastTime);
                    let time ={lastTime:lastTime};
                    AsyncStorage.setItem(STORAGE_KEY_LASTTIME, JSON.stringify(time));
                    // console.log( '状态'+ this.state.status);
                    Util.fetch("mobile/express/realNameList", {userId: userId}, (result) => {
                        if(result.code == "200" && result.data) {
                            let resultData = result.data;
                            console.log(resultData);
                            for(var i=0; i<resultData.length;i++){
                                resultData[i].flag=true;
                                resultData[i].orderFlag='1';
                            }
                            AsyncStorage.setItem(STORAGE_KEY_REALNAMELIST, JSON.stringify(resultData));

                            let sujuData = [];
                            let idData=[];
                            let editexpressId=[];

                            AsyncStorage.getItem(STORAGE_KEY_EXPRESSIDDATA,(error,expressIdData)=>{
                                AsyncStorage.getItem(STORAGE_KEY_EDITEXPRESSIDARRAY,(error,editexpressIdArray)=>{
                                    if(expressIdData!=null){

                                        let newExpressIdData = JSON.parse(expressIdData);
                                        // console.log(newExpressIdData);
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
                                        for(var i=0;i<sujuData.length;i++){
                                            sujuData[i].edit=false;
                                        }
                                        if(editexpressIdArray!=null){
                                            let neweditexpressIdArray = JSON.parse(editexpressIdArray);
                                            // console.log(neweditexpressIdArray);
                                            this.setState({
                                                editexpressIdArray:neweditexpressIdArray,
                                            });
                                            for(var i=0;i<sujuData.length;i++){
                                                for( j=0;j<neweditexpressIdArray.length;j++){
                                                    if(sujuData[i].expressId==neweditexpressIdArray[j]){
                                                        sujuData[i].edit = true;
                                                        if(sujuData[i].status=='15001'||sujuData[i].status=='15002'){
                                                            editexpressId.push(neweditexpressIdArray[j]);
                                                        }
                                                    }
                                                }

                                            }
                                            AsyncStorage.setItem(STORAGE_KEY_EDITEXPRESSIDARRAY, JSON.stringify(editexpressId));

                                        }

                                    }else{
                                        for(var item of resultData){
                                            if(item.flag){
                                                sujuData.push(item);
                                            }
                                        }
                                        for(let item of sujuData){
                                            item.edit=false;
                                        }

                                        if(editexpressIdArray!=null){
                                            // console.log(editexpressIdArray);
                                            let neweditexpressIdArray = JSON.parse(editexpressIdArray);
                                            // console.log(neweditexpressIdArray);
                                            this.setState({
                                                editexpressIdArray:neweditexpressIdArray,
                                            });
                                            for(var i=0;i<sujuData.length;i++){
                                                for( j=0;j<neweditexpressIdArray.length;j++){
                                                    if(sujuData[i].expressId==neweditexpressIdArray[j]){
                                                        sujuData[i].edit = true;
                                                        if(sujuData[i].status=='15001'||sujuData[i].status=='15002'){
                                                            editexpressId.push(neweditexpressIdArray[j]);
                                                        }
                                                    }
                                                }

                                            }
                                            AsyncStorage.setItem(STORAGE_KEY_EDITEXPRESSIDARRAY, JSON.stringify(editexpressId));

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
                            })
                        }

                    });

                }
            }
        })

    };


    refreshGetPieces(){
        AsyncStorage.getItem(STORAGE_KEY_LASTTIME,(error, lastTime) => {
            if (!error) {
                if (lastTime !== '' && lastTime !== null) {
                    let oldLastTime =  JSON.parse(lastTime).lastTime;

                    AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
                        if(!error){
                            if (userInfo !== '' && userInfo !== null){
                                const userId = JSON.parse(userInfo).userId;

                                let lastTime = this.getNowTime();
                                let time ={lastTime:lastTime};
                                AsyncStorage.setItem(STORAGE_KEY_LASTTIME, JSON.stringify(time));

                                console.log( '状态'+ this.state.status);
                                Util.fetch("mobile/express/realNameList", {userId: userId,lastDistributeTime:oldLastTime}, (result) => {
                                    if(result.code == "200" && result.data) {
                                        let resultData = result.data;
                                        // console.log(resultData);
                                        AsyncStorage.getItem(STORAGE_KEY_REALNAMELIST,(error,oldrealNameList)=>{
                                            let realNameList = JSON.parse(oldrealNameList);
                                            // console.log(realNameList);
                                            if(resultData.length>0){
                                                for(let item of resultData){
                                                    realNameList.unshift(item);
                                                }

                                        AsyncStorage.setItem(STORAGE_KEY_REALNAMELIST, JSON.stringify(realNameList));
                                        for(var i=0; i<realNameList.length;i++){
                                            realNameList[i].flag=true;
                                        }
                                        let sujuData = [];
                                        let idData=[];
                                        let editexpressId=[];

                                        AsyncStorage.getItem(STORAGE_KEY_EXPRESSIDDATA,(error,expressIdData)=>{
                                            AsyncStorage.getItem(STORAGE_KEY_EDITEXPRESSIDARRAY,(error,editexpressIdArray)=>{
                                                if(expressIdData!=null){

                                                    let newExpressIdData = JSON.parse(expressIdData);
                                                    // console.log(newExpressIdData);
                                                    this.setState({
                                                        expressIdData:newExpressIdData,
                                                    });

                                                    for(var i=0;i<newExpressIdData.length;i++){
                                                        for(var j=0;j<realNameList.length;j++){
                                                            if(newExpressIdData[i]==realNameList[j].expressId){
                                                                sujuData.push(realNameList[j]);
                                                                realNameList[j].flag=false;
                                                                if(realNameList[j].status=='15001'||realNameList[j].status=='15002'){
                                                                    idData.push(newExpressIdData[i]);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    AsyncStorage.setItem(STORAGE_KEY_EXPRESSIDDATA, JSON.stringify(idData));
                                                    for(var item of realNameList){
                                                        if(item.flag){
                                                            sujuData.push(item);
                                                        }
                                                    }
                                                    for(var i=0;i<sujuData.length;i++){
                                                        sujuData[i].edit=false;
                                                    }
                                                    if(editexpressIdArray!=null){
                                                        let neweditexpressIdArray = JSON.parse(editexpressIdArray);
                                                        console.log(neweditexpressIdArray);
                                                        this.setState({
                                                            editexpressIdArray:neweditexpressIdArray,
                                                        });
                                                        for(var i=0;i<sujuData.length;i++){
                                                            for( j=0;j<neweditexpressIdArray.length;j++){
                                                                if(sujuData[i].expressId==neweditexpressIdArray[j]){
                                                                    sujuData[i].edit = true;
                                                                    if(sujuData[i].status=='15001'||sujuData[i].status=='15002'){
                                                                        editexpressId.push(neweditexpressIdArray[j]);
                                                                    }
                                                                }
                                                            }

                                                        }
                                                        AsyncStorage.setItem(STORAGE_KEY_EDITEXPRESSIDARRAY, JSON.stringify(editexpressId));

                                                    }

                                                }else{
                                                    for(var item of realNameList){
                                                        if(item.flag){
                                                            sujuData.push(item);
                                                        }
                                                    }
                                                    for(let item of sujuData){
                                                        item.edit=false;
                                                    }

                                                    if(editexpressIdArray!=null){
                                                        console.log(editexpressIdArray);
                                                        let neweditexpressIdArray = JSON.parse(editexpressIdArray);
                                                        // console.log(neweditexpressIdArray);
                                                        this.setState({
                                                            editexpressIdArray:neweditexpressIdArray,
                                                        });
                                                        for(var i=0;i<sujuData.length;i++){
                                                            for( j=0;j<neweditexpressIdArray.length;j++){
                                                                if(sujuData[i].expressId==neweditexpressIdArray[j]){
                                                                    sujuData[i].edit = true;
                                                                    if(sujuData[i].status=='15001'||sujuData[i].status=='15002'){
                                                                        editexpressId.push(neweditexpressIdArray[j]);
                                                                    }
                                                                }
                                                            }

                                                        }
                                                        AsyncStorage.setItem(STORAGE_KEY_EDITEXPRESSIDARRAY, JSON.stringify(editexpressId));

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
                                        })
                                    }

                                    })
                                    }

                                });


                            }
                        }
                    })
                }
            }
        })
    }



    /**
     * 存储派件的数据
     */
    saveExpressData(ExpressData){
        AsyncStorage.setItem(STORAGE_KEY_EXPRESSREANNAMESYSTEM, JSON.stringify(ExpressData) ,(error) =>{
            if(error){
                console.log(error);
            }
        });
    }
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
        if(channelCode==45007){
            return(
                <Image
                    style={{width:80,height:80,borderRadius:40,}}
                    source={require('../images/erpei.jpg')}

                />
            )
        }
    }



    ToRealNameSyetemDetail = (expressId,userId,status)=>{
        let data = this.state.data;
        for(let item of data){
            if(item.expressId==expressId){
                item.edit=true;
            }
        }
        this.setState({
            data:data,
        });
        AsyncStorage.getItem(STORAGE_KEY_EXPRESSREANNAMESYSTEM,(error, ExpressData) =>{
            if (!error){
                if (ExpressData !== '' && ExpressData !== null){
                    const items = JSON.parse(ExpressData);
                    for(let item of items){
                        if(item.expressId==expressId){
                            item.edit=true;
                        }
                    }
                    AsyncStorage.setItem(STORAGE_KEY_EXPRESSREANNAMESYSTEM, JSON.stringify(items));
                }
            }
        });
        let editexpressIdArray = this.state.editexpressIdArray;
        editexpressIdArray.unshift(expressId);
        editexpressIdArray = dedupe(editexpressIdArray);
        AsyncStorage.setItem(STORAGE_KEY_EDITEXPRESSIDARRAY, JSON.stringify(editexpressIdArray));
        this.props.navigation.navigate('RealNameSyetemDetail',{expressId:expressId,userId:userId,status:status});
    };
    //优先派送
    firstSend(expressId){
        this.setState({
            animating: true,
        });
        // let expressIdData =[];
        let editexpressIdArray = this.state.editexpressIdArray;
        editexpressIdArray.unshift(expressId);
        editexpressIdArray = dedupe(editexpressIdArray);
        AsyncStorage.setItem(STORAGE_KEY_EDITEXPRESSIDARRAY, JSON.stringify(editexpressIdArray));
        let expressIdData = this.state.expressIdData;
        expressIdData.unshift(expressId);
        expressIdData = dedupe(expressIdData);
        //派件id保存
        AsyncStorage.setItem(STORAGE_KEY_EXPRESSIDDATA, JSON.stringify(expressIdData));
        let itemsData = [];
        AsyncStorage.getItem(STORAGE_KEY_EXPRESSREANNAMESYSTEM,(error, ExpressData) =>{
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

                    AsyncStorage.setItem(STORAGE_KEY_EXPRESSREANNAMESYSTEM, JSON.stringify(itemsData) ,(error) =>{
                        if(error){
                            console.log(error);
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
        AsyncStorage.getItem(STORAGE_KEY_EXPRESSREANNAMESYSTEM,(error, ExpressData) =>{
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
                                item.edit = true;
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
    renderItem = ({item, index}) => {
        // console.log(item);
        return(
            <View style={{paddingTop:8,backgroundColor:'#efeeee'}}>
                <View style={styles.listContain}>
                    {item.edit==false?<Ionicons style={styles.noEdit} name="ios-eye" size={21} color="red" />:<View></View>}
                    <TouchableHighlight
                        disabled={this.state.isDisable}
                        underLayColor ='red'
                        onPress={()=>{this.ToRealNameSyetemDetail(item.expressId,this.state.userId,this.state.status)}}
                    >
                        <View style={styles.flastListIntro}>
                            <View style={styles.img}>
                                {this.zhuahualogo(item.channelCode)}
                            </View>
                            <View style={{ flex: 1}}>
                                <View><Text style={styles.listContainItro}>{item.recipient} | {item.plateNumber}</Text></View>
                                <View><Text style={[styles.adress]}>{item.fullAddress}{item.address}</Text></View>
                                <View><Text style={[styles.listContainItro,styles.adress]}>现金：{item.totalPrice}元</Text></View>
                                {
                                    item.channelCode=='45001'?(<View><Text style={[styles.adress]}>客户类型：{item.abCate?item.abCate:'无'}</Text></View>):null
                                }
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

    renderLoadingView(){
        return (
            <View style={{alignItems:'center'}} >
                <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
            </View>
        );
    }
    render(){
        console.log(ScreenHeight)
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return (

            // <View style={styles.container}>
            //     <ScrollView ref="scroller">
            //         {(()=>{
            //             return this.state.realNameSyetemData.map((item,index)=>{
            //                 return(
            //                     <TouchableOpacity onPress={()=>this.ToRealNameSyetemDetail()}  key={index}>
            //                     <View style={styles.row}>
            //                         <Text style={styles.rowTxt}>{item.name}{item.phone}</Text>
            //                     </View>
            //                     </TouchableOpacity>
            //                 )
            //             })
            //         })()}
            //
            //     </ScrollView>
            // </View>


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
                            <View style={{paddingBottom:45}}>
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
    noEdit:{
        position:'absolute',
        top:5,
        left:5,
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
        borderBottomColor:'#efeeee',
        position:'relative'
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