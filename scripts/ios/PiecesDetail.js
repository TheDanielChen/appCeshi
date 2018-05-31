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
    Vibration,
    Alert,
    Modal
} from 'react-native';
import Util from '../util/util';
import Communications from 'react-native-communications';
import $codes_data from '../util/code';
import CameraScreen from './CameraScreen';
import { List ,} from 'antd-mobile';
import { Ionicons } from '@expo/vector-icons';
var Dimensions = require('Dimensions');
let ScreenWidth = Dimensions.get('window').width;
let ScreenHeight = Dimensions.get('window').height;
const STORAGE_KEY_EXPRESS = "EXPRESS_ID";
const Item = List.Item;
const Brief = Item.Brief;

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


export default class PiecesDetail extends Component{
    static navigationOptions = ({ navigation ,screenProps}) => ({
        headerTitle:'派件详情',
        // headerLeft:  <TouchableOpacity
        //     onPress={()=>navigation.state.params.selectedMuen()}
        // >
        //     <View style={{paddingLeft:13}}><Ionicons style={{marginTop:3,marginLeft:6,}} name="ios-arrow-back" size={26} color="#393a3a" /></View>
        // </TouchableOpacity>,

        headerRight:<TouchableOpacity onPress={()=>navigation.state.params.selectedMuen()}>
            <Ionicons style={{marginRight:10}} name="ios-home-outline" size={30} color="#4c4c4c" />
        </TouchableOpacity>,
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



    componentDidMount() {
        this.props.navigation.setParams({selectedMuen:()=>this.backPriece()});
    }
    backPriece(){
        const { navigate } = this.props.navigation;
        navigate('SendPieces', { transition: 'forVertical'});
    }

    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            price:'',
            code:'',
            expressId:'',
            data:[],  //详情数据
            isShow: true,
            payTypeId:'',
            status:'',
            animating: false,
            photoitem:[
                {id:1,name:'身份证正面',},
                {id:2,name:'身份证反面',},
                {id:3,name:'驾驶证正面',},
                {id:4,name:'驾驶证反面',},
                {id:5,name:'行驶证正面',},
                {id:6,name:'行驶证反面',},
            ],

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
        // this.loadUserData().done();
        const { params } = this.props.navigation.state;
        console.log(params.status);
        this.setState({
            expressId:params.expressId,
            userId:params.userId,
            status:params.status,
        });
        this.getPiecesdetail(params.expressId);
        // this.getPhoto()
    }


//获取详情数据
    getPiecesdetail(expressId){
        console.log('派件ID'+expressId);
        Util.fetch("mobile/express/detail", {expressId: expressId}, (result) => {
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
                });

                giftArray = newData.giftList;
                newData.companyCode= $codes_data.t[newData.companyCode];
                newData.payType = $codes_data.t[newData.payType];
                let photo = newData.photo;
                let photoData=this.state.photoitem;
                for(let ii of photoData){
                    if(ii.id==1){
                        ii.file=photo.idcardPath;
                    }else if(ii.id==2){
                        ii.file=photo.idcardBackPath;
                    }else if(ii.id==3){
                        ii.file=photo.drivingLicensePath;
                    }else if(ii.id==4){
                        ii.file=photo.drivingLicenseBackPath;
                    }else if(ii.id==5){
                        ii.file=photo.vehicleLicensePath;
                    }else if(ii.id==6){
                        ii.file=photo.vehicleLicenseBackPath;
                    }
                }
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
                this.setState({
                    data:Data,
                    isShow:false,
                    photoitem:photoData,
                });
            }
                });
    }

    ToPressSucess = (userId,expressId,totalPrice,payType,status)=>{
        this.props.navigation.navigate('PiecesSucess',{userId:userId,price:totalPrice,expressId:expressId,payType:payType,status:status});
    };

    ToPressFail = (userId,expressId,status)=>{
        this.props.navigation.navigate('PiecesFail',{userId:userId,expressId:expressId,status:status,orderFlag:'0'});
    };

    //调取相机
    takePhoto(photoId){
        this.setState({
            isModalCamera:true,
            showCamra:true,
            photoId:photoId,
        });
    }

    //手机号码转换
    phoneZhuanhuan(phone){
        if(phone!=null){
            let phoneNumber = phone.substring(0,3)+'****'+phone.substring(7,11);
            return phoneNumber;
        }else{
            return '';
        }
    }


    okPhoto(userId,expressId,photoId){
        console.log('用户'+userId+'派件'+expressId+'照片'+photoId);
        var img= this.state.ph[0];
        let formData = new FormData();
        let file = {uri: img, type: 'multipart/form-data', name: 'a.jpg'};

        formData.append("file",file);
        formData.append("userId",userId);
        formData.append("expressId",expressId);
        formData.append("category",photoId);
        formData.append("suffix",'.jpg');

        fetch(Util.baseUrl + 'mobile/express/uploadImg1',{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
            },
            body:formData,
        })
            .then((response) => response.text() )
            .then((responseData)=>{
               this.setState({
                   isModalCamera:false,
                   showCamra:false,
               });
                this.getPiecesdetail(this.state.expressId)
            })
            .catch((error)=>{console.error('error',error)});
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
        return (
            <View>
                {
                    this.state.isShow==true?(
                        <View style={{alignItems:'center',height:1500,backgroundColor:'#fff'}} >
                            <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
                        </View>
                    ):(
                        <View>
                            <ScrollView>
                                <View style={styles.container}>
                                    {(()=>{
                                        return this.state.data.map(item =>{
                                            return(
                                                <View key={item.expressId}>
                                                    <List className="my-list">
                                                        <Item extra={item.recipient} >姓名</Item>
                                                        <Item extra={item.plateNumber} >车牌号</Item>
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
                                                    </List>
                                                </View>
                                            )
                                        })
                                    })()}
                                    <View style={{backgroundColor:'#fff',marginTop:15,paddingLeft:10,paddingRight:10,}}>
                                        <View style={{borderBottomWidth:0.5,borderBottomColor:'#ddd',justifyContent:'center',height:45,}}><Text style={{fontSize:16,}}>证件资料</Text></View>
                                        {(()=>{
                                            return this.state.photoitem.map(item=>{
                                                return(
                                                    <View style={{flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#ddd'}} key={item.id}>
                                                        <View style={{flex:2,justifyContent:'center',height:45}}>
                                                            <Text style={{fontSize:15}}>{item.name}</Text>
                                                        </View>
                                                        {item.file==null?(
                                                            <View style={{flex:4,alignItems:'flex-end'}}>
                                                                <TouchableOpacity  onPress={()=>{this.takePhoto(item.id)}}>
                                                                    <Ionicons style={{marginTop:7}} name="md-add-circle" size={30} color="#666" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        ):(
                                                            <View style={{flex:4,alignItems:'flex-end'}}>
                                                                <TouchableOpacity  onPress={()=>{this.takePhoto(item.id)}}>
                                                                    <Image
                                                                        style={styles.picture}
                                                                        source={{
                                                                            uri:item.file + "?" + new Date().getTime(),
                                                                        }}
                                                                        key={item.id}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )}
                                                    </View>
                                                )
                                            })
                                        })()}
                                    </View>

                                </View>
                            </ScrollView>
                            <View>
                                {
                                    this.state.status==15003?(null):(<View style={styles.position}>
                                        <View style={{flex:1,alignItems:'center'}}>
                                            <TouchableOpacity style={styles.TouchableOpacitySucess} underlayColor='#E1F6FF'
                                                              disabled={this.state.isDisable}
                                                              onPress={()=>this.ToPressSucess(this.state.userId,this.state.expressId,this.state.price,this.state.payTypeId,this.state.status)}
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
                                            onPress={()=>this.okPhoto(this.state.userId,this.state.expressId,this.state.photoId,)}>
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
    // navigation: {
    //     flex: 1,
    // },
    // gallery: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    // },
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
