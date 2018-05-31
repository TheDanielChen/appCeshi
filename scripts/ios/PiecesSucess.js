import React, { Component } from 'react';
import {
    View,
    AppRegistry,
    Text,
    StyleSheet,
    Button,
    TextInput,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import { InputItem, Checkbox ,Toast} from 'antd-mobile';
import Util from '../util/util';
const CheckboxItem = Checkbox.CheckboxItem;

var Dimensions = require('Dimensions');
let ScreenHeight = Dimensions.get('window').height;

export default class PiecesSucess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            totalPrice:'',
            expressId:'',
            status:'',
            items: [],
            cashBack:'',
        };
    }
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'保单支付',
        headerRight:null,
    });
    componentWillMount(){
        const { params } = this.props.navigation.state;
        this.setState({
            totalPrice:params.price,
            expressId:params.expressId,
            status:params.status,
            userId:params.userId,
            cashBack:params.cashBack,
        });
        //获取支付方式
        this.getPayTypeData();
    }
    getPayTypeData(){
        const { params } = this.props.navigation.state;
        Util.fetch("mobile/summary/payType",'00030',(result) => {
            console.log(result);
            if(result.code==200){
                let items = result.data;
                for(let item of items){
                    if(item.code == params.payType){
                        item.price = params.price.toString();
                        item.checked = true;
                    }else{
                        item.price='';
                        item.checked = false;
                    }
                }
                this.setState({
                    items: items
                });
            }
        })
    }

    checkItem(code) {
        let totalPrice = new Number(this.state.totalPrice);
        let items = this.state.items;
        for (let item of items) {
            if (item.checked) {
                totalPrice -= new Number(item.price);
            }
        }
        for (let item of items) {
            if (item.code === code) {
               item.checked = !item.checked;
                if (item.checked) {
                    item.price = totalPrice.toString();
                } else {
                    item.price = "";
                }
                break;
            }
        }

        this.setState({
            items: items
        });
    }

    render() {
        return(
        <View>
        <ScrollView style={{backgroundColor:'#fff'}}>
        <View style={styles.container}>
            {(()=>{
                return this.state.items.map(item=>{
                    return (
                        <View key={item.code} style={{flexDirection:'row',borderBottomColor:'#ddd',borderBottomWidth:1,backgroundColor:'#fff',justifyContent: 'center',}}>
                            <View style={{flex:8}}>
                                <CheckboxItem  checked={item.checked} onChange={() => {
                                    this.checkItem(item.code);
                                }}>
                                    {item.name}
                                </CheckboxItem>
                            </View>
                            <View style={{justifyContent: 'center',height:45}}>
                            <TextInput
                                style={{width:100,flex:2,textAlign:'right',}}
                                onChangeText={
                                    (price) => {
                                        let items = this.state.items;
                                        for (let i of items) {
                                            if (i.code == item.code) {
                                                i.price = price;
                                            }
                                        }
                                        this.setState({
                                            items: items
                                        });
                                    }
                                }
                                value={item.price}

                                editable={item.checked}
                                underlineColorAndroid="transparent"
                            />
                            </View>
                            <View style={{justifyContent: 'center',height:45}}>
                                <Text style={{textAlign:'right',paddingRight:10,fontSize:14,color:'#949495'}}>元</Text>
                            </View>
                        </View>
                    );
                });
            })()}
        </View>
        </ScrollView>
            <View style={styles.position}>
                <TouchableOpacity style={{flex:1,backgroundColor:'#108ee9',borderRadius:10,alignItems:'center',justifyContent:'center'}} onPress={()=>this.tijiao()}>
                    <Text style={{color:'#fff',fontSize:16,}}>提 交</Text>
                </TouchableOpacity>
            </View>
        </View>

        )

    }
    tijiao = async ()=>{
        let items = this.state.items;
        let price =0;
        let totalPrice = this.state.totalPrice;
        let receipItems=[];
        for(let i of items){
            if(i.checked){
                price += new Number(i.price)
                receipItems.push({payType:i.code,amount:i.price})
            }
        }
        console.log(price);
        console.log(receipItems);
        console.log('派件ID:'+this.state.expressId + '用户ID:'+ this.state.userId +'派件状态:'+ this.state.status);
        if(price>totalPrice){
            Toast.info("实收总价大于保单总价！",0.5,)
        }else{
            Util.fetch("mobile/express/success",{expressId:this.state.expressId,userId:this.state.userId,status:'15003',receipItems:receipItems}, (result) => {
                if(result.code == "200") {
                    Toast.success("提交成功！",1,()=>{
                        this.props.navigation.navigate('SendPieces', { transition: 'forVertical'});
                    });
                }else if(result.code == "500"){
                    Toast.info(result.message,0.5);
                }else{
                    Toast.info('提交失败',0.5);
                }
            });
        }

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff',
        height:ScreenHeight,
        paddingBottom:90,
    },
    position:{
        position:'absolute',
        bottom:0,
        height:80,
        left:0,
        right:0,
        paddingTop:13,
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:20,

    },


});
