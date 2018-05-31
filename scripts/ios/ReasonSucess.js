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
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class ReasonSucess extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'提交原因成功',
        headerLeft:null,
        header:null
    });
    constructor(props){
        super(props);
        this.state={

        }
    }


    componentWillUnMount(){
        this.timer && clearTimeout(this.timer)
    }

    gomine = async ()=>{
        const {onPress} = this.props;
        const { navigate } = this.props.navigation;
        onPress&&onPress()
        await this.setState({isDisable:true})//防重复点击
        navigate('SendPieces', { transition: 'forVertical'});
        this.timer = setTimeout(async()=>{
            await this.setState({isDisable:false})//2秒后可点击
        },2000)
    };

    render(){
        return (
            <View style={styles.container}>
                <ScrollView>
                <View style={{alignItems:'center',marginTop:60,}}>
                    <Ionicons style={{marginTop:13}} name='ios-checkmark-circle' size={90} color="#3aa112" />
                </View>
                <View style={{alignItems:'center'}}>
                   <Text style={{fontSize:20}}>提交成功</Text>
                </View>
                </ScrollView>
                <View style={styles.position}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'#108ee9',borderRadius:10,alignItems:'center',justifyContent:'center'}}
                          disabled={this.state.isDisable} onPress={()=>{this.gomine()}}>
                        <Text style={{color:'#fff',fontSize:16,}}>完成</Text>
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
        position:'absolute',
        left:0,
        right:0,
        bottom:0,
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
