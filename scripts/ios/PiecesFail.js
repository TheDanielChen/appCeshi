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
    Image,
    TouchableHighlight,
} from 'react-native';
import { Toast ,} from 'antd-mobile';
import Util from '../util/util';
export default class PiecesFail extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'失败原因',
        headerRight:null,
    });
    constructor(props){
        super(props);
        this.state={
            userId:'',
            expressId:'',
            status:'',
            items:[

                ],
        }
    }
    componentWillMount(){
        const { params } = this.props.navigation.state;
        this.setState({
            expressId:params.expressId,
            status:params.status,
            userId:params.userId,
            orderFlag:params.orderFlag
        });
        // 获取失败理由数据
        this.getFailData()
    }
    getFailData(){
        Util.fetch("mobile/summary/payType",'00031',(result) => {
            console.log(result);
            if(result.code==200){
                this.setState({
                    items:result.data,
                })
            }
        })
    }

    _clickReason =(code)=>{
        if(code==='31001'){
            this.props.navigation.navigate('ChangePieceAdress',{userId:this.state.userId,expressId:this.state.expressId,status:'15004',failureReasons:code,orderFlag:this.state.orderFlag,});
        }else if(code==='31016'){
            this.props.navigation.navigate('FailReasonQita',{userId:this.state.userId,expressId:this.state.expressId,status:'15004',failureReasons:code});
        }else{
            Util.fetch("mobile/express/failure",{expressId:this.state.expressId,userId:this.state.userId,status:'15004',failureReasons:code}, (result) => {
                if(result.code == "200") {
                    Toast.success('提交成功',1,()=>{
                        this.props.navigation.navigate('SendPieces', { transition: 'forVertical'});
                    });
                }
            });
        }
    };
    render(){
        return (
                <View style={styles.container}>
                    <View style={{alignItems:'center'}}><Image style={styles.gifPic} source={require('../images/timg.gif')}/></View>
                    <View style={styles.gifPicBox}>
                        <View style={{width:280,flexDirection:'row',}}>
                            <View style={{width:60,height:40}}><Image style={{width:60,height:40}} source={require('../images/fail_03.jpg')}/></View>
                            <View><Text style={{lineHeight:40,fontSize:15,color:'#848586'}}>派件失败，请选择以下具体原因</Text></View>
                        </View>
                    </View>
                    <ScrollView>
                    {(()=>{
                        return this.state.items.map(item=>{
                            return(
                                <View key={item.code} style={{flex:1,paddingLeft:15,paddingRight:15,paddingBottom:10,}}>
                                    <TouchableOpacity disabled={this.state.isDisable} style={styles.bottom} onPress={()=>{this._clickReason(item.code);}}>
                                        <Text style={{textAlign:'center',}}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    })()}
                    </ScrollView>
                </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor:'#fff',
        flex:1,
        paddingBottom:20,
    },
    gifPicBox:{
        alignItems:'center',
        paddingBottom:15,
        borderBottomWidth:1,
        borderBottomColor:'#ddd',
        backgroundColor:'#fff',
        marginBottom:10,
    },
    gifPic:{
        width:150,
        height:150,
    },
    bottom:{
        borderWidth:1,
        borderColor:'#108ee9',
        paddingTop:10,
        paddingBottom:10,
        borderRadius:8,
    }
});