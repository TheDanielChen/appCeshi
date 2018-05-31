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
import { Ionicons,EvilIcons } from '@expo/vector-icons';
import {  Toast } from 'antd-mobile';
const STORAGE_KEY_CARTLIST = "CARTLIST";
export default class Increment extends Component{
    constructor(props){
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.state={
            userId:'',
            expressId:'',
            status:'1',
            items:[
                // {code:'1',name:'平安',
                //     baoxianlist:[
                //     {id:1,title:'平安保险业务第一责任先险业务1',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //     {id:2,title:'平安保险业务第一责任先险业务2',priceArray:[{id:1,price:191,},{id:2,price:291,},{id:3,price:491,}]},
                //     {id:3,title:'平安保险业务第一责任先险业务3',priceArray:[{id:1,price:195,},{id:2,price:295,},{id:3,price:495,},{id:4,price:695,}]},
                //     {id:4,title:'平安保险业务第一责任先险业务4',priceArray:[{id:1,price:197},{id:2,price:297},{id:3,price:497}]},
                //     {id:5,title:'平安保险业务第一责任先险业务5',priceArray:[{id:1,price:192},{id:2,price:292},{id:3,price:492}]},
                //     {id:6,title:'平安保险业务第一责任先险业务6',priceArray:[{id:1,price:190},{id:2,price:290},{id:3,price:490}]},
                //     ]
                // },
                // {code:'2',name:'人保',
                //     baoxianlist:[
                //         {id:1,title:'人保保险业务第一责任先险业务1',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //         {id:2,title:'人保保险业务第一责任先险业务2',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //         {id:3,title:'人保保险业务第一责任先险业务3',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]}]},
                // {code:'3',name:'太保',
                //     baoxianlist:[
                //         {id:1,title:'太保保险业务第一责任先险业务1',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //         {id:2,title:'太保保险业务第一责任先险业务2',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //         {id:3,title:'太保保险业务第一责任先险业务3',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]}]},
                // {code:'4',name:'大地',
                //     baoxianlist:[
                //         {id:1,title:'大地保险业务第一责任先险业务1',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //         {id:2,title:'大地保险业务第一责任先险业务2',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //         {id:3,title:'大地保险业务第一责任先险业务3',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]}]},
                // {code:'5',name:'海泰',
                //     baoxianlist:[
                //         {id:1,title:'海泰保险业务第一责任先险业务1',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //         {id:2,title:'海泰保险业务第一责任先险业务2',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]},
                //         {id:3,title:'海泰保险业务第一责任先险业务3',priceArray:[{id:1,price:199,},{id:2,price:299,},{id:3,price:499,},{id:4,price:699,}]}]},

            ],
            data:[],
            isDisable:true,//是否被禁用
            isModal:false,
            cartData:[],
            cartPrice:'0.00',
        }
    }

    componentWillMount(){
        // this.loadUserData().done();
        let status = this.state.status;
        this.getmenu(status);
    }
    getmenu(status){
        let data=[];
        let items= this.state.items;
        for(let item of items){
            if(status==item.code){
                data=item.baoxianlist
            }
        }
        this.setState({
            data:data,
        })
    }
    //选保险价格加入购物车
    selecrPrice=(baoxianlistId,priceId,status,title,price)=>{
        console.log(baoxianlistId);
        console.log(priceId);
        let data = this.state.data;
        let cartData =this.state.cartData;
        let cartPrice=0;
        for(let item of data){
            if(baoxianlistId==item.id){
                for(let ii of item.priceArray){
                    if(priceId==ii.id){
                        if(ii.checked!=true){
                            ii.checked=true;
                            this.setState({
                                data:data,
                            });
                            let cart = {code:status,baoxianlistId:baoxianlistId,title:title,priceId:priceId,price:price,count:1,};
                            cartData.push(cart);
                            for(let item of cartData){
                                cartPrice += item.price*item.count;
                            }
                            console.log(cartData)
                        }else{
                            ii.checked=false;
                            this.setState({
                                data:data,
                            });
                            for(var i=0 ;i<cartData.length ;i++){
                                if(status==cartData[i].code&&baoxianlistId==cartData[i].baoxianlistId&&priceId==cartData[i].priceId){
                                    cartData.splice(i,1);
                                }
                            }
                            console.log(cartData)
                            for(let item of cartData){
                                cartPrice += item.price*item.count;
                            }
                        }
                    }
                }
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
            null,
            '确认清空购物车吗？',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {text: '确定', onPress: () =>{
                    let items = this.state.items;
                    for(let ii of items){
                        for(let jj of ii.baoxianlist){
                            for(let a of jj.priceArray){
                                if(a.checked==true){
                                    a.checked=false;
                                }
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
    addcartcount(code,baoxianlistId,priceId){
        let cartData = this.state.cartData;
        let cartPrice=0;
        for(let item of cartData){
            if(code==item.code&&baoxianlistId==item.baoxianlistId&&priceId==item.priceId){
                item.count++;
            }
        }
        for(let item of cartData){
            cartPrice += item.price*item.count;
        }
        this.setState({
            cartData:cartData,
            cartPrice:cartPrice.toFixed(2),
        });
        console.log(cartData);
    }
    //减少购物车数量
    mincartcount(code,baoxianlistId,priceId){
        let items = this.state.items;
        let cartData = this.state.cartData;
        let cartPrice=0;
        for(let item of cartData){
            if(code==item.code&&baoxianlistId==item.baoxianlistId&&priceId==item.priceId){
                item.count--;
            }
        }

        for(var i=0 ;i<cartData.length ;i++){
            //cartPrice += cartData[i].price*cartData[i].count;
            if(cartData[i].count==0){
                for(let ii of items){
                    if(ii.code==cartData[i].code){
                        for(let jj of ii.baoxianlist){
                            if(jj.id==cartData[i].baoxianlistId){
                                for(let a of jj.priceArray){
                                    if( a.id==cartData[i].priceId){
                                        a.checked=false;
                                    }
                                }
                            }
                        }
                    }
                }
                cartData.splice(i,1);
            }
        }
        for(let item of cartData){
            cartPrice += item.price*item.count;
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
    insuranceType(code){
        this.setState({
            status:code,
        });
        this.getmenu(code);
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
        AsyncStorage.setItem(STORAGE_KEY_CARTLIST, JSON.stringify(this.state.cartData) ,(error) =>{
            if(error){
                console.log(error);
            }
        });
        console.log((this.state.cartPrice).toString())
        this.props.navigation.navigate('IncrementSubmit',{cartPrice:(this.state.cartPrice).toString()});
    }


    render(){

        return (
            <View style={styles.container}>
                <View style={{flex:1,backgroundColor:'#fff',paddingBottom:50}}>
                    <ScrollView>
                        {(()=>{
                            return this.state.items.map(item=>{
                                return (
                                    <TouchableOpacity  key={item.code} onPress={()=>{this.insuranceType(item.code)}}>
                                        <View style={[styles.leftMeun,item.code==this.state.status?{backgroundColor:'#efeeee',}:null]}>
                                            <Text style={[styles.leftText,item.code==this.state.status?{color:'red'}:'']}>{item.name}</Text>
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
                                    <View style={{borderBottomColor:'#efeeee',borderBottomWidth:1,padding:10}} key={item.id}>
                                        <View>
                                            <View style={{flex:1,}}>
                                                <View><Text>{item.title}</Text></View>
                                                <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:5}}>
                                                    {(()=>{
                                                        return item.priceArray.map(i=>{
                                                            return(
                                                                <TouchableHighlight style={[styles.priceBtn,i.checked==true?styles.priceBtncheck : '']} key={i.id}
                                                                                    onPress={()=>{this.selecrPrice(item.id,i.id,this.state.status,item.title,i.price)}}>
                                                                    <Text style={[styles.priceBtnTxt,i.checked==true?styles.priceBtnTxtOn:'']}>{i.price}</Text>
                                                                </TouchableHighlight>
                                                            )
                                                        })
                                                    })()}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        })()}
                    </ScrollView>
                </View>
                <View style={{position:'absolute',bottom:0,left:0,right:0,height:45,backgroundColor:'#454546',flexDirection:'row',zIndex:999999999}}>
                    <View style={{flexDirection:'row',flex:2}}>
                        <TouchableOpacity onPress={()=>{this.showModal()}} style={{flexDirection:'row',flex:1}} disabled={this.state.isDisable}>
                            <View style={{marginRight:10,marginLeft:20}}><Ionicons style={{marginTop:8}} name="ios-cart" size={30} color="#fff" /></View>
                            <View><Text style={{lineHeight:45,color:'#fff',fontSize:16}}>¥{this.state.cartPrice}</Text></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,backgroundColor:this.state.isDisable==true?'#616162':'#3f7fc0'}}>
                        <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{this.IncrementSubmit()}} disabled={this.state.isDisable}>
                            <Text style={{color:'#fff',lineHeight:45,fontSize:18}}>提交</Text>
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
                        <View style={{flexDirection:'row',backgroundColor:'#e2e3e4'}}>
                            <View style={{flex:5,flexDirection:'row',paddingLeft:12}}><View style={{width:3,height:19,backgroundColor:'#108ee9',marginTop:11,}}></View><Text style={{lineHeight:40,marginLeft:7,fontSize:16,}}>已选险种</Text></View>
                            <View style={{flex:1,flexDirection:'row'}}>
                                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{this.deletecart()}}>
                                    <Ionicons style={{marginTop:11}} name="ios-trash-outline" size={20} color="#626364" /><Text style={{lineHeight:40,color:'#626364'}}>清空</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView style={{backgroundColor:'#fff',paddingLeft:10,height:225,}}>

                            {(()=>{
                                return this.state.cartData.map(item=>{
                                    return (
                                        <View style={styles.cartlist} key={item.code+item.baoxianlistId+item.priceId}>
                                            <View style={{flex:7,}}><Text style={{lineHeight:53,}} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text></View>
                                            <View style={{flex:2,}}><Text style={{lineHeight:53,color:'#3f7fc0'}}>¥{item.price*item.count}</Text></View>
                                            <View style={{flex:1,alignItems:'center'}}>
                                                <TouchableOpacity onPress={()=>{this.mincartcount(item.code,item.baoxianlistId,item.priceId)}}>
                                                    <EvilIcons style={{marginTop:13}} name='minus' size={30} color="#108ee9" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:1,alignItems:'center'}}><Text style={{lineHeight:53}}>{item.count}</Text></View>
                                            <View style={{flex:1,alignItems:'center'}}>
                                                <TouchableOpacity  onPress={()=>{this.addcartcount(item.code,item.baoxianlistId,item.priceId)}}>
                                                    <Ionicons style={{marginTop:13}} name='ios-add-circle' size={26} color="#108ee9" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })
                            })()}
                        </ScrollView>
                        <View style={{backgroundColor:'#454546',flexDirection:'row',}}>
                            <View style={{flexDirection:'row',flex:2}}>
                                <TouchableOpacity onPress={()=>{this.showModal()}} style={{flexDirection:'row',flex:1}}>
                                    <View style={{marginRight:10,marginLeft:20}}><Ionicons style={{marginTop:8}} name="ios-cart" size={30} color="#fff" /></View>
                                    <View><Text style={{lineHeight:45,color:'#fff',fontSize:16}}>¥{this.state.cartPrice}</Text></View>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex:1,backgroundColor:'#3f7fc0'}}>
                                <TouchableOpacity style={{alignItems:'center'}} onPress={()=>{this.IncrementSubmit()}} >
                                    <Text style={{color:'#fff',lineHeight:45,fontSize:18}}>提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                </Modal>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeeee',
        flexDirection:'row',
    },
    leftMeun:{
        borderBottomColor:'#ddd',
        borderBottomWidth:1,
    },
    leftText:{
        textAlign:'center',
        lineHeight:50,
    },
    cartlist:{
        flexDirection:'row',
        backgroundColor:'#fff',
        borderBottomColor:'#efeeee',
        borderBottomWidth:1,
        height:55,
        paddingRight:10,
    },
    priceBtn:{
        width:45,
        borderColor:'#ddd',
        borderWidth:1,
        margin:3,
    },
    priceBtnTxt:{
        lineHeight:22,
        color:'#848485',
        textAlign:'center',
    },
    priceBtncheck:{
        backgroundColor:'#2977c8',
    },
    priceBtnTxtOn:{
        color:'#fff',
    },
    modalBackground:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.5)'
    }
})