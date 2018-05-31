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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Util from '../util/util';
import { Toast ,} from 'antd-mobile';


export default class FailReasonQita extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'提交具体原因',
        headerRight:null,
    });
    constructor(props){
        super(props)
        this.state={
            beizhu:'',
            multiline:true,
            userId:'',
            expressId:'',
            status:'',
            failureReasons:'',
        }
    }


    componentWillUnMount(){
        this.timer && clearTimeout(this.timer)
    }
    componentWillMount(){
        const { params } = this.props.navigation.state;
        this.setState({
            expressId:params.expressId,
            status:params.status,
            userId:params.userId,
            failureReasons:params.failureReasons,
        });

    }
    beiZhuTijiao(){
        let remark = this.state.beizhu;
        if(remark==null||remark.length==0){
            Toast.info("备注原因不能为空！")
        }else{
            Util.fetch("mobile/express/failure",{expressId:this.state.expressId,userId:this.state.userId,status:'15004',failureReasons:this.state.failureReasons,remark:remark}, (result) => {
                if(result.code == "200") {
                    Toast.success('提交成功',1,()=>{
                        this.props.navigation.navigate('SendPieces', { transition: 'forVertical'});
                    });
                }
            });
        }
    }


    render(){
        return (
            <View style={styles.container}>
                <View style={styles.listTrBox}>
                    <View style={styles.listTrBoxView}>
                        <View style={{flex:2}}><Text style={{lineHeight:45,fontSize:18}}>备注</Text></View>
                        <View style={{flex:8}}>
                            <TextInput
                                style={styles.TextInput}
                                onChangeText={(beizhu) => this.setState({beizhu})}
                                value={this.state.beizhu}
                                placeholder='请输入具体原因'
                                multiline={this.state.multiline}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.position}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#108ee9',borderRadius:10,alignItems:'center',justifyContent:'center'}} onPress={()=>{this.beiZhuTijiao()}}>
                        <Text style={{color:'#fff',fontSize:16,}}>确认提交</Text>
                    </TouchableOpacity>
                </View>
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
        paddingRight:10
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
    }

});
