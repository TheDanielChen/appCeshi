import {
    Camera,
    Video,
    FileSystem,
    Permissions,
} from 'expo';
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
    TextInput,
    Modal,
    findNodeHandle,
    UIManager

} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EvilIcons ,Ionicons} from '@expo/vector-icons';
import { List ,Toast,Picker,DatePicker} from 'antd-mobile';
const STORAGE_KEY_CARTLIST = "CARTLIST";
import Util from '../util/util';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
const STORAGE_KEY_EXPRESS = "EXPRESS_ID";
const Item = List.Item;
const Brief = Item.Brief;
var Dimensions = require('Dimensions');
let ScreenHeight = Dimensions.get('window').height;

const flashModeOrder = {
    off: 'on',
    on: 'auto',
    auto: 'torch',
    torch: 'off',
};

const wbOrder = {
    auto: 'sunny',
    sunny: 'cloudy',
    cloudy: 'shadow',
    shadow: 'fluorescent',
    fluorescent: 'incandescent',
    incandescent: 'auto',
};

function datezhuanhua2(date) {
    if(date!=null){
        let year = date.substring(0,4);
        let month = date.substring(4,6);
        let day =  date.substring(6,8);
        return new Date( year+'/'+month+'/'+day);
    }else{
        return null;
    }

}

export default class IncrementSubmit extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'增值提交',
        headerRight:null,
    });

    getRatios = async function() {
        const ratios = await this.camera.getSupportedRatios();
        return ratios;
    };

    toggleView() {
        this.setState({
            showGallery: !this.state.showGallery,
        });
    }

    toggleFacing() {
        this.setState({
            type: this.state.type === 'back' ? 'front' : 'back',
        });
    }

    toggleFlash() {
        this.setState({
            flash: flashModeOrder[this.state.flash],
        });
    }

    setRatio(ratio) {
        this.setState({
            ratio,
        });
    }

    toggleWB() {
        this.setState({
            whiteBalance: wbOrder[this.state.whiteBalance],
        });
    }

    toggleFocus() {
        this.setState({
            autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
        });
    }

    zoomOut() {
        this.setState({
            zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
        });
    }

    zoomIn() {
        this.setState({
            zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
        });
    }

    setFocusDepth(depth) {
        this.setState({
            depth,
        });
    }


    constructor(props) {
        super(props);
        this.state = {
            pro:[], // 增值保险个人信息
            district:[],
            isDisable:false,   //是否被禁用,
            data:[],   //购物车增值保险单
            isShow: true,
            expressId:'',
            address:'',
            userId:'',
            dateBegin:null,
            pickerValue:[],
            multiline:true,
            recipient:'', //收件人
            recipientPhone:'', //收件人联系电话
            isModal:false,  //关联保单列表是否可见
            isModalpay:false, //支付方式列表是否可见
            isModalInfo:false, //修改派送信息是否可见
            isModalaccidentInfo:false, //修改意外险个人信息是否可见
            cartPrice:'',
            baodanData:[],   //保单
            baodanuserinfo:[],//个人信息
            beizhu:'',
            items: [],  //支付方式数据
            payType:[], //已选的支付方式
            accidentInfo:[] , //意外险信息
            brandModel:'',
            engineNumber:'',
            idCard:'',
            insured:'',
            plate:'',
            seating:'',
            vinCode:'',
            phone:'',
            beginDate:null,
            endDate:null,
            idCardDate:null,
            idCardDateStr:'',
            pay:'',
            downloadY:'',
            viewheight:0,
            oktijiao:false,
            expressRemark:'',
            email:'',
            picUrl:'',

            flash: 'off',
            zoom: 0,
            autoFocus: 'on',
            depth: 0,
            type: 'back',
            whiteBalance: 'auto',
            ratio: '16:9',
            ratios: [],
            photoId: '',
            showGallery: false,
            photos: [],
            ph:[],
            showCamra:false,
            isModalCamera:false,
        };
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
        this.setState({
            cartPrice:params.cartPrice,
        });
        this.getCartList();
        this.getBaodanList();
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
            if(!error){
                if (userInfo !== '' && userInfo !== null){
                    const userId = JSON.parse(userInfo).userId;
                    this.setState({
                        userId:userId,
                    });
                }
            }});
        Util.fetch("mobile/summary/AccidentPayType",{},(result) => {
            console.log('支付数据'+result);
            if(result.code == "200" && result.data){
                let items = result.data;
                this.setState({
                    items:items,
                })
            }
        });
    }

    getCartList(){
        AsyncStorage.getItem(STORAGE_KEY_CARTLIST,(error, ExpressData) =>{
            if (!error){
                if (ExpressData !== '' && ExpressData !== null){
                    const items = JSON.parse(ExpressData);
                    this.setState({
                        data:items,
                    })
                }}
        })
    }
    //获取保单列表
    getBaodanList(){
        AsyncStorage.getItem(STORAGE_KEY_EXPRESS,(error, ExpressData) =>{
            if (!error){
                if (ExpressData !== '' && ExpressData !== null){
                    const items = JSON.parse(ExpressData);
                    this.setState({
                        baodanData:items,
                    })
                }}
        })
    }

    componentDidMount(){

    }
    componentWillUnMount() {
        this.timer && clearTimeout(this.timer)
    }

    guanLianbd(){
        this.setState({
            isModal:true
        })
    }
    onRequestClose() {
        this.setState({
            isModal:false
        });
    }
    onRequestClosepayType(){
        this.setState({
            isModalpay:false
        });
    }
    onRequestCloseInfo(){
        this.setState({
            isModalInfo:false
        });
    }
    pickerValue(pickerValue){
        for(var i=0;i<pickerValue.length;i++){
            if(pickerValue[i]==null){
                return null;
            }else{
                return pickerValue;
            }
        }
    }
    //关联保单
    selectBaodan(expressId){
        // console.log(expressId);
        Util.fetch("mobile/express/list", {expressId: expressId}, (result) => {
            console.log(result);
            if(result.code == "200" && result.data){
                let items = result.data;
                let newData =items[0];
                let accidentInfo = [];
                let pickerValue=[];
                let accident = newData.accidentInfo;
                accidentInfo.push(accident);
                let baodanuserinfo =items;
                pickerValue.push(newData.areaL1Id!=null?newData.areaL1Id.toString():null);
                pickerValue.push(newData.areaL2Id!=null?newData.areaL2Id.toString():null);
                pickerValue.push(newData.areaL3Id!=null?newData.areaL3Id.toString():null);
                let paytype = newData.payType;
                let payData = this.state.items;
                let docBeginDate = newData.docBeginDate;
                let docEndDate = newData.docEndDate;

                let payTypeData = this.state.payType;
                for(var i=0;i<payData.length;i++){
                    if(paytype==payData[i].code){
                        payTypeData.push(payData[i]);
                        payData.splice(i,1);
                    }
                }
                for(let ii of payTypeData){
                    ii.amount=this.state.cartPrice;
                }

                this.setState({
                    pickerValue:this.pickerValue(pickerValue),
                    accidentInfo:accidentInfo,
                    baodanuserinfo:baodanuserinfo,
                    address:newData.address,
                    recipient:newData.recipient,
                    recipientPhone:newData.phone,
                    isModal:false,
                    expressId:expressId,
                    brandModel:accident.brandModel,
                    engineNumber:accident.engineNumber,
                    idCard:accident.idCard,
                    insured:accident.insured,
                    plate:accident.plate,
                    seating:accident.seating!=null?accident.seating.toString():null,
                    vinCode:accident.vinCode,
                    phone:accident.phone,
                    items:payData,
                    payType:payTypeData,
                    beginDate:  datezhuanhua2(docBeginDate),
                    endDate:  datezhuanhua2(docEndDate),
                })
            }
        });

    }
    //选择支付方式
    selectPayType(code){
        let items = this.state.items;
        let payTypeData = this.state.payType;
        if(payTypeData.length>0){
            items.push(payTypeData[0]);
            payTypeData.splice(0,1);
        }
        for(var i=0;i<items.length;i++){
            if(code==items[i].code){
                payTypeData.push(items[i]);
                items.splice(i,1);
            }
        }
        payTypeData[0].amount = this.state.cartPrice;
        console.log(payTypeData);
        // for(let ii of payTypeData){
        //     if(ii.code==code){
        //         ii.amount=this.state.cartPrice;
        //     }
        // }

        this.setState({
            items:items,
            payType:payTypeData,
            isModalpay:false,
        });
    }
    //删除当前支付方式
    deletePayType(code){
        let payTypeData = this.state.payType;
        let items = this.state.items;
        for(var i=0;i<payTypeData.length;i++){
            if(code==payTypeData[i].code){
                items.push(payTypeData[i]);
                payTypeData.splice(i,1);

            }
        }
        console.log(payTypeData);
        console.log(items);
        this.setState({
            items:items,
            payType:payTypeData,
        });
    }
    //修改派送信息
    changeInfo(){
        this.setState({
            isModalInfo:true,
        })
    }

    //修改地址收件人信息提交
    adressSubmit(){
        let address = this.state.address;
        let pickerValue = this.state.pickerValue;
        let baodanuserinfo = this.state.baodanuserinfo;
        for(let item of baodanuserinfo){
            item.areaL1Id=pickerValue[0];
            item.areaL2Id=pickerValue[1];
            item.areaL3Id=pickerValue[2];
            item.address=address;
            item.phone= this.state.recipientPhone;
            item.recipient= this.state.recipient;
        }
        this.setState({
            baodanuserinfo:baodanuserinfo,
            isModalInfo:false,
        });
        // Util.fetch("mobile/express/failure",{
        //     expressId:this.state.expressId,
        //     userId:this.state.userId,
        //     areaL1Id:address[0],
        //     areaL2Id:address[1],
        //     areaL3Id:address[2],
        //     address:this.state.address,
        // }, (result) => {
        //     if(result.code==200){
        //         Toast.success('修改成功',1,()=>{
        //             for(let item of baodanData){
        //                 if(item.expressId==this.state.expressId){
        //                     item.areaL1Id=address[0];
        //                     item.areaL2Id=address[1];
        //                     item.areaL3Id=address[2];
        //                     item.address=this.state.address;
        //                 }
        //             }
        //             this.setState({
        //                 baodanData:baodanData,
        //             });
        //             AsyncStorage.setItem(STORAGE_KEY_EXPRESS, JSON.stringify(baodanData) ,(error) =>{
        //                 if(error){
        //                     console.log(error);
        //                 }
        //             });
        //             this.selectBaodan(this.state.expressId);
        //             this.setState({
        //                 isModalInfo:false,
        //             })
        //         });
        //
        //
        //     }
        // })

    }
    selectProvince(areaL1Id,areaL2Id,areaL3Id){
        let district = this.state.district;
        let province='';
        let city='';
        let area='';
        for(let item of district){
            if(item.value==areaL1Id){
                province=item.label;
                for(let ii of item.children){
                    if(ii.value==areaL2Id){
                        city=ii.label;
                        for(let j of ii.children){
                            if(j.value==areaL3Id){
                                area=j.label;
                            }
                        }
                    }
                }
            }
        }
        return province+city+area;
    }
    // 修改意外险个人信息提交
    infoSubmit(){
        let accidentInfo = this.state.accidentInfo[0];
        let accident=[];
        console.log(accidentInfo);
        let idCardTimeStr =new Date(this.state.idCardDate);
        let idCardDateStr = this.datezhuanhua(idCardTimeStr);
        accidentInfo.idCardDeadline = idCardDateStr;
        accidentInfo.brandModel=this.state.brandModel;
        accidentInfo.idCard=this.state.idCard;
        accidentInfo.insured=this.state.insured;
        accidentInfo.vinCode=this.state.vinCode;
        accidentInfo.plate=this.state.plate;
        accidentInfo.seating=this.state.seating;
        accidentInfo.phone=this.state.phone;
        accidentInfo.engineNumber=this.state.engineNumber;
        accident.push(accidentInfo);
        this.setState({
            accidentInfo:accident,
            isModalaccidentInfo:false,
            idCardDateStr:(idCardDateStr.substring(0,4)+'-'+idCardDateStr.substring(4,6)+'-'+idCardDateStr.substring(6,8)),
        })
    }

    datezhuanhua(Date){
        let year =Date.getFullYear() + "";
        let month = Date.getMonth()+1;
        let day = Date.getDate();
        const pad = n => n < 10 ? `0${n}` : n;
        return(year + pad(month) + pad(day));
    }
    // 意外险增值整体提交
    zengzhiSubmit= async ()=>{
        const {onPress} = this.props;
        onPress&&onPress();
        await this.setState({isDisable:true})//防重复点击
        let userId = this.state.userId;
        let expressId = this.state.expressId;
        let receipItems =  this.state.payType;
        let price =0;


        for(let item of receipItems){
            item.payType=item.code;
            price += parseFloat(item.amount);
        }
        if(price!=parseFloat(this.state.cartPrice)){
            Toast.info('输入总价与保险总价不符！',1,);
            this.timer = setTimeout(async()=>{
                await this.setState({isDisable:false})//1.5秒后可点击
            },2500);
            return false;
        }
        if(this.state.idCardDateStr==''){
            Toast.info('身份证有效期不能为空！',1,);
            this.timer = setTimeout(async()=>{
                await this.setState({isDisable:false})//1.5秒后可点击
            },2500);
            return false;
        }
        if(expressId==''||expressId==null){
            Toast.info('请先关联保单',1,);
            this.timer = setTimeout(async()=>{
                await this.setState({isDisable:false})//1.5秒后可点击
            },2500);
            return false;
        }else if(receipItems.length<1){
            Toast.info('请选择支付方式',1,);
            this.timer = setTimeout(async()=>{
                await this.setState({isDisable:false})//1.5秒后可点击
            },2500);
            return false;
        }else if(this.state.beginDate==null||this.state.endDate==null){
            Toast.info('请选择增值险时间',1,);
            this.timer = setTimeout(async()=>{
                await this.setState({isDisable:false})//1.5秒后可点击
            },2500);
            return false;
        }else{
            let areaL1Id;
            let areaL2Id;
            let areaL3Id;
            let address;
            let recipientPhone;
            let recipient;
            let list = this.state.data;
            let baodanuserinfo = this.state.baodanuserinfo;
            let accidentInfo = this.state.accidentInfo;
            for(let ii of accidentInfo){
                ii.name=ii.insured
            }
            for(let item of baodanuserinfo){
                areaL1Id = item.areaL1Id;
                areaL2Id = item.areaL2Id;
                areaL3Id = item.areaL3Id;
                address = item.address;
                recipientPhone = item.phone;
                recipient = item.recipient;
            }
            accidentInfo[0].areaL1Id=areaL1Id;
            accidentInfo[0].areaL2Id=areaL2Id;
            accidentInfo[0].areaL3Id=areaL3Id;
            accidentInfo[0].address=address;
            accidentInfo[0].recipient=recipient;
            accidentInfo[0].recipientPhone=recipientPhone;
            accidentInfo[0].expressRemark = this.state.expressRemark;
            accidentInfo[0].email = this.state.email;
            let beginDate =new Date(this.state.beginDate);
            let beginTime = this.datezhuanhua(beginDate);
            let endDate = new Date(this.state.endDate);
            let endTime = this.datezhuanhua(endDate);
            accidentInfo[0].beginDate=beginTime;
            accidentInfo[0].endDate=endTime;
            // accidentInfo[0].remark=this.state.beizhu;
            if(accidentInfo[0].vinCode==''||accidentInfo[0].brandModel==''||accidentInfo[0].engineNumber==''||accidentInfo[0].idCard==''||accidentInfo[0].phone==''){
                Toast.info('意外险个人信息不能为空值',1,);
                this.timer = setTimeout(async()=>{
                    await this.setState({isDisable:false})//1.5秒后可点击
                },2500);
                return false;
            }else{
                console.log({
                    userId:userId,
                    expressId:expressId,
                    list:list,
                    record:accidentInfo[0],
                    receipItems:receipItems,
                });
                Util.fetch("accidentDoc/makeOrder",{
                    userId:userId,
                    expressId:expressId,
                    list:list,
                    record:accidentInfo[0],
                    receipItems:receipItems,
                }, (result) => {
                    console.log(result);
                    if(result.code==200){
                        Toast.success('提交成功',1,()=>{
                            this.setState({
                                oktijiao:true,
                            });
                            this.props.navigation.navigate('SendPieces', { selectedTab: '增值'});

                        });
                    }else{
                        Toast.info('提交失败',1,);
                        this.timer = setTimeout(async()=>{
                            await this.setState({isDisable:false})//1.5秒后可点击
                        },2500);
                    }
                })
            }

        }
    };

    // _downloadLayout(e){
    //     console.log('定位------------'+e.nativeEvent.layout.y);
    //     this.setState({
    //         downloadY:e.nativeEvent.layout.y,
    //     });
    // }

    _downLoadFocus(ref){
        console.log(ref);
        this.setState({
            viewheight:1/3*ScreenHeight,
        });
        const handle = findNodeHandle(ref);
        this.refs.textInput.measure((fx, fy, width, height, px, py)=>{
            let h = py;
            console.log('定位'+h);
            let scroller = this.refs.scroller;
            setTimeout(()=>{
                let y = h +1/3*ScreenHeight;//ScreenHeight为屏幕的高度
                console.log('高度-------'+y);
                // scroller&&scroller.scrollTo({x:0, y:y, animated:true});
                scroller&&scroller.scrollToEnd({animated: true});
            },50);
        });


    }
    _downLoadBlur(){
        this.setState({
            viewheight:0,
        });
        this.refs.textInput.measure((fx, fy, width, height, px, py)=>{
            let h = py;
            console.log('定位'+h);
            let scroller = this.refs.scroller;
            setTimeout(()=>{
                // scroller&&scroller.scrollTo({x:0, y:h , animated:true});
                scroller&&scroller.scrollToEnd({animated: true});
            },50);
        });
    }

    //调取相机
    takePhoto(photoId){
        this.setState({
            isModalCamera:true,
            showCamra:true,
            photoId:photoId,
        });
    }
    okPhoto(expressId,photoId){
        console.log('派件'+expressId+'照片'+photoId);
        var img= this.state.ph[0];
        this.setState({
            picUrl:img,
            showCamra:false,
            isModalCamera:false,
        });
        // var img= this.state.ph[0];
        // let formData = new FormData();
        // let file = {uri: img, type: 'multipart/form-data', name: 'a.jpg'};
        //
        // formData.append("file",file);
        // formData.append("userId",userId);
        // formData.append("expressId",expressId);
        // formData.append("category",photoId);
        // formData.append("suffix",'.jpg');
        //
        // fetch(Util.baseUrl + 'mobile/express/uploadImg1',{
        //     method:'POST',
        //     headers:{
        //         'Content-Type':'multipart/form-data',
        //     },
        //     body:formData,
        // })
        //     .then((response) => response.text() )
        //     .then((responseData)=>{
        //         this.setState({
        //             isModalCamera:false,
        //             showCamra:false,
        //         });
        //         this.getPiecesdetail(this.state.expressId)
        //     })
        //     .catch((error)=>{console.error('error',error)});
    };

    takePicture(){
        if (this.camera) {
            this.camera.takePictureAsync().then(data => {
                let data2 = [];
                data2.push(data);
                this.setState({
                    ph:data2,
                    showCamra:!this.state.showCamra,
                });
            });
        }
    };


    render(){
        // console.log(this.state.items)
        return (
            <View>
                <Modal
                    animationType='slide'           // 从底部滑入
                    transparent={true}             // 不透明
                    visible={this.state.isModal}    // 根据isModal决定是否显示
                    onRequestClose={() => {this.onRequestClose()}}  // android必须实现
                >
                    <View style={styles.modalBackground}>
                    </View>
                    <View style={styles.modalViewStyle}>
                        <View style={{alignItems:'flex-end'}}>
                            <TouchableOpacity
                                onPress={() => {{
                                    this.setState({
                                        isModal:false,
                                    })
                                }}}
                            >
                                <EvilIcons style={{marginTop:6}} name='close-o' size={30} color="#777778" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{paddingRight:15,paddingLeft:15}}>
                            {(()=>{
                                return this.state.baodanData.map(item=>{
                                    return(
                                        <TouchableOpacity key={item.expressId} onPress={()=>{this.selectBaodan(item.expressId)}}>
                                            <View style={{borderBottomColor:"#ddd",borderBottomWidth:0.5,flexDirection:'row',justifyContent:'center'}}>
                                                <View style={{justifyContent:'center',height:45}}><Text>{item.plateNumber}</Text></View>
                                                {
                                                    this.state.expressId==item.expressId?(
                                                        <Ionicons style={{marginLeft:40,}} name="ios-checkmark" size={40} color="#3f7fc0" />
                                                    ):null
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            })()}
                        </ScrollView>
                    </View>

                </Modal>
                <View style={{position:'relative'}}>
                    <ScrollView ref="scroller">
                        <KeyboardAwareScrollView
                            resetScrollToCoords={{ x: 0, y:0}}
                            scrollEnabled={false}
                        >

                            <View style={{padding:10,backgroundColor:'#fff',marginBottom:15,}}>
                                <View style={{borderBottomColor:'#efeeee',borderBottomWidth:1,height:45,justifyContent:'center'}}>
                                    <Text style={{fontSize:16,}}>已选险种</Text>
                                </View>
                                {(()=>{
                                    return this.state.data.map(item=>{
                                        return(
                                            <View style={{flexDirection:'row',borderBottomColor:'#efeeee',borderBottomWidth:0.5,height:35,justifyContent:'center'}} key={item.proId+item.schemeId}>
                                                <View style={{flex:8,justifyContent:'center'}}><Text  numberOfLines={1} ellipsizeMode='tail'>{item.title}{item.name}</Text></View>
                                                <View style={{flex:2,justifyContent:'center'}}><Text style={{color:'#6c6d6e'}}>{item.price}*{item.amount}</Text></View>
                                                <View style={{flex:2,justifyContent:'center'}}><Text >¥{item.price*item.amount}</Text></View>
                                            </View>
                                        )
                                    })
                                })()}
                                <View style={{alignItems:'flex-end',height:45,justifyContent:'center'}}>
                                    <Text style={{fontSize:16}}>小计:¥{this.state.cartPrice}</Text>
                                </View>
                            </View>
                            <View style={{padding:10,backgroundColor:'#fff',marginBottom:15}}>
                                <View style={{borderBottomColor:'#efeeee',borderBottomWidth:0.5,flexDirection:'row',}}>
                                    <View style={{flex:1,height:40,justifyContent:'center'}}>
                                        <Text style={{fontSize:16,}}>派送信息</Text>
                                    </View>
                                    {
                                        this.state.expressId!=''?(
                                            <View style={{alignItems:'flex-end',flex:1,height:40,justifyContent:'center'}}>
                                                <TouchableOpacity onPress={()=>{this.changeInfo()}}>
                                                    <Text style={{fontSize:14,color:'#3f7fc0'}}>修改派送信息</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ):(null)
                                    }
                                    <View style={{alignItems:'flex-end',flex:1,height:40,justifyContent:'center'}}>
                                        <TouchableOpacity onPress={()=>{this.guanLianbd()}}>
                                            <Text style={{fontSize:14,color:'#3f7fc0'}}>关联保单</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {(()=>{
                                    return this.state.baodanuserinfo.map(item=>{
                                        return(
                                            <View key={item.expressId}>
                                                <View style={{flexDirection:'row',borderBottomColor:'#efeeee',borderBottomWidth:0.5,justifyContent:'center'}}>
                                                    <View style={{flex:2,justifyContent:'center',height:46,}}><Text style={{fontSize:14,}}>收件人:</Text></View>
                                                    <View style={{flex:7,height:46,justifyContent:'center'}}>
                                                        <Text style={{fontSize:14,color:'#6c6d6e',}}>{item.recipient}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection:'row',borderBottomColor:'#efeeee',borderBottomWidth:0.5,justifyContent:'center'}}>
                                                    <View style={{flex:2,justifyContent:'center',height:46}}><Text style={{fontSize:14}}>联系电话:</Text></View>
                                                    <View style={{flex:7,justifyContent:'center',height:46}}>
                                                        <Text style={{fontSize:14,color:'#6c6d6e',}}>{item.phone}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection:'row',borderBottomColor:'#efeeee',borderBottomWidth:0.5,justifyContent:'center'}}>
                                                    <View style={{flex:1,justifyContent:'center',height:46}}><Text style={{fontSize:14}}>地址:</Text></View>
                                                    <View style={{flex:7,justifyContent:'center',height:46}}>
                                                        <Text style={{lineHeight:20,fontSize:14,color:'#6c6d6e',}}>
                                                            {this.selectProvince(item.areaL1Id,item.areaL2Id,item.areaL3Id)}{item.address}</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        )
                                    })
                                })()}

                                <View style={{flexDirection:'row',borderBottomColor:'#efeeee',borderBottomWidth:0.5,justifyContent:'center'}}>
                                    <View style={{flex:1,height:46,justifyContent:'center'}}><Text style={{fontSize:14}}>备注:</Text></View>
                                    <View style={{flex:7,justifyContent:'center'}}>
                                        <TextInput
                                            style={styles.textInputbeizhu}
                                            onChangeText={(beizhu) => this.setState({beizhu})}
                                            value={this.state.beizhu}
                                            placeholder='请输入详细备注'
                                            multiline={this.state.multiline}
                                            underlineColorAndroid="transparent"

                                        /></View>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                        {/*<KeyboardAwareScrollView*/}
                        {/*resetScrollToCoords={{ x: 0, y:0}}*/}
                        {/*scrollEnabled={false}*/}
                        {/*>*/}

                        <View style={{backgroundColor:'#fff',marginBottom:15}}>
                            <View style={{borderBottomColor:'#efeeee',borderBottomWidth:0.5,flexDirection:'row',marginLeft:10,marginRight:10,justifyContent:'center'}}>
                                <View style={{flex:1,justifyContent:'center',height:40}}>
                                    <Text style={{fontSize:16,}}>意外险</Text>
                                </View>
                                {
                                    this.state.expressId!=''?(
                                        <View style={{alignItems:'flex-end',flex:1,justifyContent:'center',height:40}}>
                                            <TouchableOpacity onPress={()=>{this.setState({isModalaccidentInfo:true,})}}>
                                                <Text style={{fontSize:14,color:'#3f7fc0'}}>修改信息</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ):(null)
                                }
                            </View>
                            {(()=>{
                                return this.state.accidentInfo.map(item=>{
                                    return(
                                        <View key={item.idCard}>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>被保险人:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{item.insured==null?'暂无':item.insured}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>车牌:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{item.plate==null?'暂无':item.plate}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{flexDirection:'row',justifyContent:'center'}}>
                                                    <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>座位数:</Text></View>
                                                    <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14,color:'#6c6d6e'}}>{item.seating==null?'暂无':item.seating}</Text></View>
                                                </View>
                                                <View style={{flexDirection:'row',justifyContent:'center',height:46,paddingLeft:40}}>
                                                    <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>手机号:</Text></View>
                                                    <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14,color:'#6c6d6e'}}>{item.phone==null?'暂无':item.phone}</Text></View>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>身份证:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{item.idCard==null?'暂无':item.idCard}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>有效期:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{this.state.idCardDateStr==''?'暂无':this.state.idCardDateStr}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>车架号:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{item.vinCode==null?'暂无':item.vinCode}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>厂牌号:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{item.brandModel==null?'暂无':item.brandModel}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>发动机号:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{item.engineNumber==null?'暂无':item.engineNumber}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>邮箱:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{this.state.email==''?'暂无':this.state.email}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:14}}>备注:</Text></View>
                                                <View style={{justifyContent:'center',height:46}}>
                                                    <Text style={{fontSize:14,color:'#6c6d6e',}}>{this.state.expressRemark==''?'暂无':this.state.expressRemark}</Text>
                                                </View>
                                            </View>

                                            <DatePicker
                                                mode="date"
                                                title="选择日期"
                                                extra="请选择"
                                                value={this.state.beginDate}
                                                onChange={v => {
                                                    console.log(v);
                                                    this.setState({beginDate:v})
                                                } }
                                            >
                                                <List.Item arrow="horizontal"><Text style={{fontSize:14}}>开始日期</Text></List.Item>
                                            </DatePicker>
                                            <DatePicker
                                                mode="date"
                                                title="选择日期"
                                                extra="请选择"
                                                value={this.state.endDate}
                                                onChange={v => {
                                                    console.log(v);
                                                    this.setState({endDate:v})
                                                } }
                                            >
                                                <List.Item arrow="horizontal"><Text style={{fontSize:14}}>结束日期</Text></List.Item>
                                            </DatePicker>
                                            <View style={styles.row}>
                                                <View style={{justifyContent:'center',height:46,flex:2,}}><Text style={{fontSize:14}}>上传图片:</Text></View>
                                                <View style={{flex:4,alignItems:'flex-end'}}>
                                                    {
                                                        this.state.picUrl==''?(
                                                            <TouchableOpacity  onPress={()=>{this.takePhoto(this.state.expressId)}}>
                                                                <Ionicons style={{marginTop:7}} name="md-add-circle" size={30} color="#666" />
                                                            </TouchableOpacity>
                                                        ):(
                                                            <TouchableOpacity  onPress={()=>{this.takePhoto(this.state.expressId)}}>
                                                                <Image
                                                                    style={styles.picture}
                                                                    source={{
                                                                        uri:this.state.picUrl + "?" + new Date().getTime(),
                                                                    }}
                                                                />
                                                            </TouchableOpacity>
                                                        )
                                                    }

                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            })()}
                        </View>
                        <View style={{padding:10,backgroundColor:'#fff',marginBottom:15,paddingBottom:50,justifyContent:'center',}}>

                            <View style={{borderBottomColor:'#efeeee',borderBottomWidth:0.5,justifyContent:'center',height:40}}>
                                <Text style={{fontSize:16,}}>支付方式</Text>
                            </View>
                            {(()=>{
                                return this.state.payType.map(item=>{
                                    return (
                                        <View
                                            style={{flexDirection:'row',borderBottomColor:'#efeeee',borderBottomWidth:0.5,justifyContent:'center'}} key={item.code}>
                                            <View style={{flex:6,justifyContent:'center',height:46}}><Text style={{fontSize:15}}>{item.name}</Text></View>
                                            <View style={{flex:3,flexDirection:'row',justifyContent:'center',height:46}}>
                                                <TextInput style={styles.textInputprice}
                                                           ref={'textInput'}
                                                           underlineColorAndroid="transparent"
                                                           keyboardType="numeric"
                                                           onChangeText={(price) => {
                                                               let items = this.state.payType;
                                                               for(let ii of items){
                                                                   if(ii.code==item.code){
                                                                       ii.amount=price;
                                                                   }
                                                               }
                                                               this.setState({
                                                                   payType: items,
                                                               });
                                                           }}
                                                           value={item.amount}
                                                           onFocus = {()=>this._downLoadFocus('textInput')}
                                                           onBlur={()=>this._downLoadBlur()}
                                                />
                                                <View style={{justifyContent:'center',height:46}}><Text style={{fontSize:15,marginLeft:5}}>元</Text></View>
                                            </View>
                                            <View style={{flex:2,alignItems:'flex-end'}}>
                                                <TouchableOpacity onPress={()=>{this.deletePayType(item.code)}}>
                                                    <EvilIcons style={{marginTop:11}} name='minus' size={30} color="#108ee9" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })
                            })()}

                            <View style={{paddingLeft:20,paddingRight:20,paddingTop:20,justifyContent:'center'}}>
                                <TouchableOpacity style={styles.addPayType} onPress={()=>{this.setState({isModalpay:true})}}>
                                    <View style={{justifyContent:'center',height:35}}><Text>更改其他支付方式</Text></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{height:this.state.viewheight,backgroundColor:'#fff'}} />
                        {/*</KeyboardAwareScrollView>*/}
                    </ScrollView>
                    <View style={styles.position}>
                        <TouchableOpacity style={styles.TouchableOpacitySucess} underlayColor='#E1F6FF'
                                          disabled={this.state.isDisable}
                                          onPress={()=>{this.zengzhiSubmit()}}
                        >
                            <View style={{justifyContent:'center',height:45}}><Text style={styles.text}>{this.state.oktijiao==false?'提 交':'已提交'}</Text></View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*支付方式*/}
                <Modal
                    animationType='slide'           // 从底部滑入
                    transparent={true}             // 不透明
                    visible={this.state.isModalpay}    // 根据isModal决定是否显示
                    onRequestClose={() => {this.onRequestClosepayType()}}  // android必须实现
                >
                    <View style={styles.modalBackground}>
                    </View>
                    <View style={styles.modalViewStyle}>
                        <View style={{alignItems:'flex-end'}}>
                            <TouchableOpacity
                                onPress={() => {{
                                    this.setState({
                                        isModalpay:false,
                                    })
                                }}}
                            >
                                <EvilIcons style={{marginTop:6}} name='close-o' size={30} color="#777778" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{paddingRight:15,paddingLeft:15,}}>
                            {(()=>{
                                return this.state.items.map(item=>{
                                    return(
                                        <TouchableOpacity key={item.sort} onPress={()=>{this.selectPayType(item.code)}}>
                                            <View style={{alignItems:'center',borderBottomColor:"#ddd",borderBottomWidth:0.5,justifyContent:'center', height:45}}>
                                                <Text>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            })()}

                        </ScrollView>
                    </View>

                </Modal>

                {/*修改派送信息*/}
                <Modal
                    animationType='slide'           // 从底部滑入
                    transparent={false}             // 不透明
                    visible={this.state.isModalInfo}    // 根据isModal决定是否显示
                    onRequestClose={() => {this.onRequestCloseInfo()}}  // android必须实现
                >
                    <View>
                        <View style={{flexDirection:'row',backgroundColor:'#ebeaea',height:60}}>
                            <View style={{flex:1,paddingTop:25}}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            isModalInfo:false,
                                        })
                                    }}><Ionicons style={{marginLeft:16,}} name="ios-arrow-back" size={26} color="#393a3a" /></TouchableOpacity></View>
                            <View style={{flex:2,alignItems:'center',height:60,paddingTop:30}}><Text style={{fontSize:16,color:'#000',fontWeight:'bold'}}>修改派送信息</Text></View>
                            <View style={{flex:1,}}><Text> </Text></View>
                        </View>
                        <ScrollView style={{paddingRight:8,paddingBottom:100}}>
                            <View>
                                <View style={[styles.listTrBoxView,{paddingLeft:10}]}>
                                    <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>收件人</Text></View>
                                    <View style={{flex:8,justifyContent:'center',height:45}}>
                                        <TextInput
                                            style={{fontSize:18,color:'#666',height:45}}
                                            onChangeText={(recipient) => this.setState({recipient})}
                                            value={this.state.recipient}
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>
                                <View style={[styles.listTrBoxView,{paddingLeft:10}]}>
                                    <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>联系电话</Text></View>
                                    <View style={{flex:8,justifyContent:'center',height:45}}>
                                        <TextInput
                                            style={{fontSize:18,color:'#666',height:45}}
                                            onChangeText={(recipientPhone) => this.setState({recipientPhone})}
                                            value={this.state.recipientPhone}
                                            keyboardType="numeric"
                                            underlineColorAndroid="transparent"
                                        />
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
                                                style={styles.TextInputadress}
                                                onChangeText={(address) => this.setState({address})}
                                                value={this.state.address}
                                                placeholder='请输入详细街道门牌'
                                                multiline={this.state.multiline}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.submitBtn}>
                                <TouchableOpacity style={{flex:1,backgroundColor:'#108ee9',borderRadius:10,alignItems:'center',justifyContent:'center',height:40}} onPress={()=>{this.adressSubmit()}}>
                                    <Text style={{color:'#fff',fontSize:16,}}>确认提交</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </Modal>

                {/*修改意外险个人信息*/}
                <Modal
                    animationType='slide'           // 从底部滑入
                    transparent={false}             // 不透明
                    visible={this.state.isModalaccidentInfo}    // 根据isModal决定是否显示
                    onRequestClose={() => {this.onRequestCloseInfo()}}  // android必须实现
                >
                    <View>
                        <View style={{flexDirection:'row',backgroundColor:'#ebeaea',height:60,justifyContent:'center'}}>
                            <View style={{flex:1,paddingTop:25}}>
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            isModalaccidentInfo:false,
                                        })
                                    }}><Ionicons style={{marginLeft:16,}} name="ios-arrow-back" size={26} color="#393a3a" /></TouchableOpacity></View>
                            <View style={{flex:2,alignItems:'center',height:60,paddingTop:30}}><Text style={{fontSize:16,color:'#000',fontWeight:'bold'}}>修改意外险个人信息</Text></View>
                            <View style={{flex:1,}}><Text> </Text></View>
                        </View>
                        <ScrollView style={{paddingRight:8,}}>
                            <KeyboardAwareScrollView
                                resetScrollToCoords={{ x: 0, y:0}}
                                scrollEnabled={false}
                            >

                                <View style={styles.listTrBox}>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>被保险人</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(insured) => this.setState({insured})}
                                                value={this.state.insured}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>车牌</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(plate) => this.setState({plate})}
                                                value={this.state.plate}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>座位数</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(seating) => this.setState({seating})}
                                                value={this.state.seating}
                                                keyboardType="numeric"
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>手机号</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(phone) => this.setState({phone})}
                                                value={this.state.phone}
                                                keyboardType="numeric"
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>身份证</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(idCard) => this.setState({idCard})}
                                                value={this.state.idCard}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>

                                    <DatePicker
                                        mode="date"
                                        title="选择日期"
                                        extra="请选择"
                                        value={this.state.idCardDate}
                                        onChange={v => {
                                            console.log(v);
                                            this.setState({idCardDate:v})
                                        } }
                                    >
                                        <List.Item arrow="horizontal"><Text style={{fontSize:14}}>有效期</Text></List.Item>
                                    </DatePicker>

                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>车架号</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(vinCode) => this.setState({vinCode})}
                                                value={this.state.vinCode}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>厂牌号</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(brandModel) => this.setState({brandModel})}
                                                value={this.state.brandModel}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>发动机号</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(engineNumber) => this.setState({engineNumber})}
                                                value={this.state.engineNumber}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>邮箱</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(email) => this.setState({email})}
                                                value={this.state.email}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.listTrBoxView}>
                                        <View style={{flex:4,justifyContent:'center',height:45}}><Text style={{fontSize:18}}>备注</Text></View>
                                        <View style={{flex:8,justifyContent:'center',height:45}}>
                                            <TextInput
                                                style={{fontSize:18,color:'#666',height:45}}
                                                onChangeText={(expressRemark) => this.setState({expressRemark})}
                                                value={this.state.expressRemark}
                                                underlineColorAndroid="transparent"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                            <View style={styles.submitBtn}>
                                <TouchableOpacity style={{flex:1,backgroundColor:'#108ee9',borderRadius:10,alignItems:'center',justifyContent:'center',height:40}} onPress={()=>{this.infoSubmit()}}>
                                    <Text style={{color:'#fff',fontSize:16,}}>确认提交</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                    </View>

                </Modal>

                <Modal
                    animationType='slide'           // 从底部滑入
                    transparent={false}             // 不透明
                    visible={this.state.isModalCamera}    // 根据isModal决定是否显示
                    onRequestClose={() => {this.onRequestCloseInfo()}}  // android必须实现
                >
                    {
                        this.state.showCamra?(
                            <Camera
                                ref={ref => {
                                    this.camera = ref;
                                }}
                                style={{
                                    flex: 1,
                                }}
                                type={this.state.type}
                                flashMode={this.state.flash}
                                autoFocus={this.state.autoFocus}
                                zoom={this.state.zoom}
                                whiteBalance={this.state.whiteBalance}
                                ratio={this.state.ratio}
                                focusDepth={this.state.depth}>
                                <View
                                    style={{
                                        flex: 0.5,
                                        backgroundColor: 'transparent',
                                        flexDirection: 'row',
                                    }}>
                                    <TouchableOpacity
                                        style={styles.flipButton2}
                                        onPress={this.toggleFacing.bind(this)}>
                                        <Text style={styles.flipText2}> FLIP </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.flipButton2}
                                        onPress={this.toggleFlash.bind(this)}>
                                        <Text style={styles.flipText2}>
                                            {' '}FLASH: {this.state.flash}{' '}
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                                <View
                                    style={{
                                        flex: 0.4,
                                        backgroundColor: 'transparent',
                                        flexDirection: 'row',
                                        alignSelf: 'flex-end',
                                    }}>

                                </View>
                                <View
                                    style={{
                                        backgroundColor: 'transparent',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                    }}>
                                    <View style={{flex:2,alignItems:'flex-end',paddingRight:30,}}>
                                        <TouchableOpacity
                                            style={[
                                                styles.flipSnapButton2,
                                                styles.picButton2,
                                            ]}
                                            onPress={()=>{
                                                this.takePicture(this.state.categoryId)
                                            }
                                            }>
                                            <Text style={[styles.flipText,{color:'#fff'}]}> SNAP </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{flex:1,alignItems:'center'}}>
                                        <TouchableOpacity
                                            onPress={()=>{this.setState({
                                                isModalCamera:false,
                                                showCamra:false,
                                            })}}>
                                            <Ionicons style={{marginTop:20}}  name="ios-arrow-down" size={35} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Camera>
                        ):(
                            <View style={styles.pictures2}>
                                {this.state.ph.map(photoUri =>
                                    <Image
                                        style={styles.picture2}
                                        source={{
                                            uri: photoUri.uri,
                                        }}
                                        key={photoUri}
                                    />
                                )}
                                <View style={{position:'absolute',flexDirection:'row',bottom:50,left:0,right:0}}>
                                    <View style={{flex:1,alignItems:'center',}}>
                                        <TouchableOpacity
                                            style={{width:60,height:60,borderRadius:30,alignItems:'center',backgroundColor:'#ddd',justifyContent:'center'}}
                                            onPress={()=>{
                                                this.setState({
                                                    showCamra:true,
                                                })
                                            }}>
                                            <Ionicons  name="ios-return-left" size={40} color="#000" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex:1,alignItems:'center',}}>
                                        <TouchableOpacity
                                            style={{width:60,height:60,borderRadius:30,alignItems:'center',backgroundColor:'#fff',justifyContent:'center'}}
                                            onPress={()=>this.okPhoto(this.state.expressId,this.state.photoId,)}>
                                            <Ionicons  name="md-checkmark" size={40} color="green" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                </Modal>


            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#ebeaea',
        paddingBottom:50,
        height:ScreenHeight,
    },
    position:{
        position:'absolute',
        bottom:0,
        flexDirection:'row',
        height:45,
        left:0,
        right:0,
        backgroundColor:'#3f7fc0',
        alignItems:"center",
        zIndex:9999

    },
    TouchableOpacitySucess:{
        flex:1,
    },

    text:{
        color:'#fff',
        textAlign:'center',
        backgroundColor:null,
        fontSize:18,
    },
    textInput:{
        lineHeight:40,
        color:'#848485',
        backgroundColor:'#f4f5f6',
        marginTop:4,
        height:38,
        fontSize:14,
    },
    textInputprice:{
        width:70,
        height:38,
        borderColor:'#ddd',
        borderWidth:0.5,
        textAlign:'center',
        marginTop:4,
        justifyContent:'center',
    },
    textInputbeizhu:{
        lineHeight:20,
        color:'#6c6d6e',
        height:80,
        fontSize:14,
        paddingTop:14,
        paddingLeft:5,
        paddingRight:5,
        textAlignVertical: 'top'
    },
    modalViewStyle:{
        position:'absolute',
        zIndex:99,
        backgroundColor:'#fff',
        left:40,
        right:40,
        top:40,
        bottom:40,
        paddingBottom:15,
    },
    modalBackground:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    addPayType:{
        flex:1,
        alignItems:'center',
        borderColor:'#108ee9',
        borderWidth:1,
        borderRadius:20,
    },
    listTrBox:{
        backgroundColor:'#fff',
        paddingLeft:15,
    },
    listTrBoxView:{
        flexDirection:'row',
        borderBottomWidth:0.5,
        borderBottomColor:'#ddd',
        justifyContent:'center',
        flex:1
    },
    TextInputadress:{
        height: 85,
        backgroundColor:'#fff',
        padding:10,
        lineHeight:25,
        color:'#7d7d7d',
        fontSize:16,
        paddingTop:15,
        textAlignVertical: 'top'
    },
    submitBtn:{
        // paddingTop:23,
        //  paddingLeft:10,
        //  paddingRight:10,
        //  // paddingBottom:10,
        //  position:'absolute',
        //  bottom:0,
        //  left:10,
        //  right:10
        marginTop:25,
        paddingLeft:10,
        marginBottom:120,

    },
    cont:{
        backgroundColor:null,
    },
    row:{
        flexDirection:'row',
        borderBottomColor:'#efeeee',
        borderBottomWidth:0.5,
        marginLeft:10,
        marginRight:10
    },
    picture: {
        width: 80,
        height: 90,
        margin: 5,
        resizeMode: 'contain',
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
