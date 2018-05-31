import React, { Component } from 'react';
import {
    View,
    AppRegistry,
    Text,
    StyleSheet,
    Button,
    FlatList,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Animated,
    Easing,
    Modal,
    Alert,
    AsyncStorage,
} from 'react-native';
import Util from '../util/util';
import $codes_data from '../util/code';
import { Ionicons,EvilIcons } from '@expo/vector-icons';
import {  Toast } from 'antd-mobile';
const STORAGE_KEY_LOGIN_USER_INFO = "LOGIN_USER_INFO";
const STORAGE_KEY_CARTLIST = "CARTLIST";
export default class Increment extends Component{
    constructor(props){
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.state={
            userId:'',
            expressId:'',
            status:'1',
            isShow:true,
            items:[],//保险列表
            data:[],
            isDisable:true,//是否被禁用
            isModal:false,
            cartData:[],   //购物车列表
            cartPrice:'0.00',
        }
    }

    componentWillMount(){
        // this.loadUserData().done();
        let status = this.state.status;
        this.getmenu(status);
    }
    getmenu(status){
        AsyncStorage.getItem(STORAGE_KEY_LOGIN_USER_INFO,(error, userInfo) =>{
            if(!error){
                if (userInfo !== '' && userInfo !== null){
                    const userId = JSON.parse(userInfo).userId;
                    console.log('登入ID'+userId);
                    Util.fetch("accident/getProForApp",userId,(result) => {
                        console.log(result);
                        if(result.code == "200" && result.data){
                            let items = result.data;
                            if (items && items.length > 0) {
                                let firstItem = items[0];
                                this.setState({
                                    items:items,
                                    data:firstItem.accidentProSchemeDtoList,
                                    status: firstItem.id,
                                    isShow:false,
                                })
                            }
                        }
                    });
                }
            }
        })
    }

    //选保险价格加入购物车
    selecrPrice=(proId,caseId,name,price)=>{
        console.log(caseId);
        let data = this.state.data;
        let cartData =this.state.cartData;
        let cartPrice=0;
        for(let item of data){
            if(caseId==item.id){
                if(item.checked!=true){
                    item.checked=true;
                    this.setState({
                        data:data,
                    });
                    let cart = {proId:proId,schemeId:caseId,name:name,price:price,amount:1,};
                    cartData.push(cart);
                    for(let item of cartData){
                        cartPrice += item.price*item.amount;
                    }
                    console.log(cartData)
                }else{
                    item.checked=false;
                    this.setState({
                        data:data,
                    });
                    for(var i=0 ;i<cartData.length ;i++){
                        if(proId==cartData[i].proId&&caseId==cartData[i].schemeId){
                            cartData.splice(i,1);
                        }
                    }
                    console.log(cartData)
                    for(let item of cartData){
                        cartPrice += item.price*item.amount;
                    }
                }

                // for(let ii of item.priceArray){
                //     if(priceId==ii.id){
                //         if(ii.checked!=true){
                //             ii.checked=true;
                //             this.setState({
                //                 data:data,
                //             });
                //             let cart = {code:status,baoxianlistId:baoxianlistId,title:title,priceId:priceId,price:price,count:1,};
                //             cartData.push(cart);
                //             for(let item of cartData){
                //                 cartPrice += item.price*item.count;
                //             }
                //             console.log(cartData)
                //         }else{
                //             ii.checked=false;
                //             this.setState({
                //                 data:data,
                //             });
                //             for(var i=0 ;i<cartData.length ;i++){
                //                 if(status==cartData[i].code&&baoxianlistId==cartData[i].baoxianlistId&&priceId==cartData[i].priceId){
                //                     cartData.splice(i,1);
                //                 }
                //             }
                //             console.log(cartData)
                //             for(let item of cartData){
                //                 cartPrice += item.price*item.count;
                //             }
                //         }
                //     }
                // }
            }
        }
        this.setState({
            cartData:cartData,
            cartPrice:cartPrice.toFixed(2),
        });
        if(cartData.length>0){
            this.setState({isDisable:false})
        }else{
            this.setState({isDisable:true})
        }
    };

    //清空购物车
    deletecart(){
        Alert.alert(
            '温馨提示',
            '确认清空购物车吗？',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {text: '确定', onPress: () =>{
                    let items = this.state.items;
                    for(let ii of items){
                        for(let jj of ii.accidentProSchemeDtoList){
                                if(jj.checked==true){
                                    jj.checked=false;
                                }
                        }
                    }
                    this.setState({
                        items:items,
                        cartData:[],
                        cartPrice:'0.00',
                        isDisable:true,
                        isModal:false,
                    })
                }
                },
            ]
        )
    }
    //增加购物车数量
    addcartcount(proId,schemeId){
        let cartData = this.state.cartData;
        let cartPrice=0;
        for(let item of cartData){
            if(proId==item.proId&&schemeId==item.schemeId){
                item.amount++;
            }
        }
        for(let item of cartData){
            cartPrice += item.price*item.amount;
        }
        this.setState({
            cartData:cartData,
            cartPrice:cartPrice.toFixed(2),
        });
        console.log(cartData);
    }
    //减少购物车数量
    mincartcount(proId,schemeId){
        let items = this.state.items;
        let cartData = this.state.cartData;
        let cartPrice=0;
        for(let item of cartData){
            if(proId==item.proId&&schemeId==item.schemeId){
                item.amount--;
            }
        }
        for(var i=0 ;i<cartData.length ;i++){
            if(cartData[i].amount==0){
                for(let ii of items){
                    if(ii.id==proId){
                        for(let jj of ii.accidentProSchemeDtoList){
                            if(jj.id==schemeId){
                                jj.checked=false;
                            }
                        }
                    }
                }
                cartData.splice(i,1);
            }
        }
        for(let item of cartData){
            cartPrice += item.price*item.amount;
        }

        if(cartData.length>0){
            this.setState({isDisable:false,isModal:true,})
        }else{
            this.setState({isDisable:true,isModal:false,})
        }
        this.setState({
            items:items,
            cartData:cartData,
            cartPrice:cartPrice.toFixed(2),
        });
        console.log(cartData);
    }

    //切换保险类型
    insuranceType(id){
        this.setState({
            status:id,
        });
        let items = this.state.items;
        let data=[];
        for(let item of items){
            if(id==item.id){
                data=item.accidentProSchemeDtoList;
            }
        }
        this.setState({
            data:data,
        })
    }

    // startAnimation() {
    //     this.setState({
    //         stuid:!this.state.stuid,
    //     });
    //     this.animatedValue.setValue(0);
    //     Animated.timing(
    //         this.animatedValue,
    //         {
    //             toValue: 1,
    //             duration: 600,
    //             easing: Easing.linear,
    //         }
    //     ).start();
    //
    // }

    showModal() {
        this.setState({
            isModal:!this.state.isModal,
        })
    }
    _setModalVisible = (visible) => {
        this.setState({ isModal: visible });
    };
    IncrementSubmit(){
        this.setState({
            isModal:false,
        });
        let cartData = this.state.cartData;
        let data = this.state.items;
        for(let item of cartData){
            for(let ii of data){
                if(item.proId==ii.id){
                    item.title = ii.name;
                }
            }
        }
        this.setState({
            cartData:cartData,
        });
        AsyncStorage.setItem(STORAGE_KEY_CARTLIST, JSON.stringify(cartData) ,(error) =>{
            if(error){
                console.log(error);
            }
        });
        console.log((this.state.cartPrice).toString());
        this.props.navigation.navigate('IncrementSubmit',{cartPrice:(this.state.cartPrice).toString()});
    }
    companyCode(companyCode){
       return $codes_data.t[companyCode];
    }
    proName(proid){
        let items = this.state.items;
        for(let item of items){
            if(proid==item.id){
                return item.name;
            }
        }
    }

    render(){
        return (
            <View style={{flex:1}}>
        {
            this.state.isShow==true?(
            <View style={{alignItems:'center',height:1500,backgroundColor:'#fff'}} >
                <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
            </View>
        ):(
            <View style={styles.container}>
                <View style={{flex:1,backgroundColor:'#fff',paddingBottom:50}}>
                    <ScrollView>
                        {(()=>{
                            return this.state.items.map(item=>{
                                return (
                                    <TouchableOpacity  key={item.id} onPress={()=>{this.insuranceType(item.id)}}>
                                        <View style={[styles.leftMeun,item.id==this.state.status?{backgroundColor:'#efeeee',}:null]}>
                                            <View><Text style={[styles.leftText,item.id==this.state.status?{color:'red'}:'']}>{this.companyCode(item.companyCode)}</Text></View>
                                            <View><Text style={[styles.leftText2,item.id==this.state.status?{color:'red'}:'']}>{item.name}</Text></View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        })()}
                    </ScrollView>
                </View>
                <View style={{flex:3,marginLeft:8,backgroundColor:'#fff',paddingBottom:50}}>
                    <ScrollView>
                        {(()=>{
                            return this.state.data.map(item=>{
                                return (
                                    <View style={{borderBottomColor:'#efeeee',borderBottomWidth:1,padding:10,}} key={item.id}>
                                        <TouchableOpacity
                                            onPress={()=>{this.selecrPrice(this.state.status,item.id,item.name,item.price)}}>
                                            <View style={{flex:1,flexDirection:'row',height:60,justifyContent: 'center',}}>
                                                <View style={{flexWrap:'wrap',flex:5,justifyContent: 'center',}}><Text>{item.name}</Text></View>
                                                <View style={{flex:2,justifyContent: 'center',}}>
                                                    <Text>{item.price}</Text>
                                                </View>
                                                <View style={{flex:1}}>
                                                    <Ionicons style={{marginTop:13}} name="ios-checkmark-circle" size={30} color={item.checked==true?"#108ee9":"#dfdfdf"} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        })()}
                    </ScrollView>
                </View>
                <View style={{position:'absolute',bottom:0,left:0,right:0,height:45,backgroundColor:'#454546',flexDirection:'row',zIndex:999999999}}>
                    <View style={{flexDirection:'row',flex:2,justifyContent: 'center',}}>
                        <TouchableOpacity onPress={()=>{this.showModal()}} style={{flexDirection:'row',flex:1,}} disabled={this.state.isDisable}>
                            <View style={{marginRight:10,marginLeft:20}}><Ionicons style={{marginTop:8}} name="ios-cart" size={30} color="#fff" /></View>
                            <View style={{height:45, justifyContent: 'center',}}><Text style={{color:'#fff',fontSize:16,}}>¥{this.state.cartPrice}</Text></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,justifyContent: 'center',backgroundColor:this.state.isDisable==true?'#616162':'#3f7fc0'}}>
                        <TouchableOpacity style={{alignItems:'center',justifyContent: 'center',}} onPress={()=>{this.IncrementSubmit()}} disabled={this.state.isDisable} >
                            <Text style={{color:'#fff',fontSize:18,textAlignVertical:'center',}}>提交</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    animationType='slide'           // 从底部滑入
                    transparent={true}             // 不透明
                    visible={this.state.isModal}    // 根据isModal决定是否显示
                    onRequestClose={() => {this._setModalVisible(false) }}  // android必须实现
                >
                    <TouchableOpacity style={{flex:1}} onPress={()=>{this.setState({isModal:false,})}}>
                        <View style={styles.modalBackground}>
                        </View>
                    </TouchableOpacity>
                    <View style={{position:'absolute',bottom:49,left:0,right:0,backgroundColor:'#fff',zIndex:99,}}>
                        <View style={{flexDirection:'row',backgroundColor:'#e2e3e4',justifyContent: 'center',}}>
                            <View style={{flex:5,flexDirection:'row',paddingLeft:12}}>
                                <View style={{width:3,height:19,backgroundColor:'#108ee9',marginTop:11,}}></View>
                                <View style={{justifyContent: 'center',height:40}}><Text style={{marginLeft:7,fontSize:16,}}>已选险种</Text></View>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent: 'center',height:40}}>
                                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{this.deletecart()}}>
                                    <Ionicons style={{marginTop:11}} name="ios-trash-outline" size={20} color="#626364" />
                                    <View style={{justifyContent: 'center',height:40}}><Text style={{color:'#626364'}}>清空</Text></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView style={{backgroundColor:'#fff',paddingLeft:10,height:225,}}>

                            {(()=>{
                                return this.state.cartData.map(item=>{
                                    return (
                                        <View style={styles.cartlist} key={item.proId+item.schemeId}>
                                            <View style={{flex:7,justifyContent: 'center',height:53}}><Text numberOfLines={1} ellipsizeMode='tail'>{this.proName(item.proId)}{item.name}</Text></View>
                                            <View style={{flex:2,justifyContent: 'center',height:53}}><Text style={{color:'#3f7fc0'}}>¥{item.price*item.amount}</Text></View>
                                            <View style={{flex:1,alignItems:'center'}}>
                                                <TouchableOpacity onPress={()=>{this.mincartcount(item.proId,item.schemeId)}}>
                                                    <EvilIcons style={{marginTop:13}} name='minus' size={30} color="#108ee9" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:1,alignItems:'center',justifyContent: 'center',height:53}}><Text>{item.amount}</Text></View>
                                            <View style={{flex:1,alignItems:'center'}}>
                                                <TouchableOpacity  onPress={()=>{this.addcartcount(item.proId,item.schemeId)}}>
                                                    <Ionicons style={{marginTop:13}} name='ios-add-circle' size={26} color="#108ee9" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })
                            })()}
                        </ScrollView>
                        <View style={{backgroundColor:'#454546',flexDirection:'row',justifyContent: 'center',}}>
                            <View style={{flexDirection:'row',flex:2}}>
                                <TouchableOpacity onPress={()=>{this.showModal()}} style={{flexDirection:'row',flex:1}}>
                                    <View style={{marginRight:10,marginLeft:20}}><Ionicons style={{marginTop:8}} name="ios-cart" size={30} color="#fff" /></View>
                                    <View style={{height:45, justifyContent: 'center',}}><Text style={{color:'#fff',fontSize:16}}>¥{this.state.cartPrice}</Text></View>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,backgroundColor:'#3f7fc0',justifyContent: 'center',}}>
                                <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{this.IncrementSubmit()}} >
                                    <Text style={{color:'#fff',fontSize:18}}>提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
        }
        </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#efeeee',
        flexDirection:'row',
    },
    leftMeun:{
        borderBottomColor:'#ddd',
        borderBottomWidth:1,
    },
    leftText:{
        textAlign:'center',
        lineHeight:30,
        fontSize:15,
        fontWeight:'bold',
    },
    leftText2:{
        textAlign:'center',
        lineHeight:20,
        fontSize:14,
        paddingBottom:10,
    },
    cartlist:{
        flexDirection:'row',
        backgroundColor:'#fff',
        borderBottomColor:'#efeeee',
        borderBottomWidth:1,
        height:55,
        paddingRight:10,
        justifyContent:'center'
    },

    priceBtnTxt:{
        lineHeight:22,
        color:'#848485',
        textAlign:'center',
    },

    modalBackground:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.5)'
    }
})