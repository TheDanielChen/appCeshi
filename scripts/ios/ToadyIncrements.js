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
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Util from '../util/util';

export default class ToadyIncrements extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'增值服务汇总',
        headerRight:null,
    });

    constructor(props){
        super(props);
        this.state = {
            items:[
                // {code:'1',title:'现金',icon:'ios-stats',count:11,cash:'5252'},
                // {code:'2',title:'上门刷卡',icon:'ios-card',count:11,cash:'5252'},
            ],
            sumPrice:'',
            isShow: true,
        };
    }
    componentWillMount(){
        const { params } = this.props.navigation.state;
        var delivererId = params.userId;
        this.getTotalCash(delivererId);
    }
    getTotalCash(delivererId){
        // console.log('111111111111-----------------'+delivererId);
        let deliveryTime = new Date();
        let year =deliveryTime.getFullYear() + "";
        let month = deliveryTime.getMonth()+1;
        let day = deliveryTime.getDate();
        const pad = n => n < 10 ? `0${n}` : n;
        let date = year + pad(month) + pad(day);
        // console.log('日期'+date);
        Util.fetch("accidentDoc/sumPrice?delivererId="+delivererId+'&createDate='+date,{}, (result) =>{
            if(result.code == "200"){
                this.setState({
                    sumPrice:result.data,
                })
            }
        });
        Util.fetch("accidentDoc/docList?delivererId="+delivererId+'&createDate='+date,{}, (result) =>{
            console.log(result);
            if(result.code == "200"&& result.data){
                this.setState({
                    items:result.data,
                    isShow: false,
                })
            }
        })
    }


    render(){
            return (
                <View style={styles.container}>
                    {this.state.isShow==true?(
                        <View style={{alignItems:'center',height:1500,backgroundColor:'#fff'}} >
                            <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
                        </View>
                    ):(
                    <View style={{flex:1}}>
                        { !this.state.items.length>0?(
                            <View style={{paddingTop:100,alignItems:'center'}}>
                                <View><Ionicons name="ios-paper" size={40} color="#666" /></View>
                                <View><Text style={{color:'#666',fontSize:17,marginTop:15}}>暂无数据</Text></View>
                            </View>
                        ):(
                            <View style={{flex:1}}>
                                <ScrollView>
                                    <View style={{paddingBottom:60}}>
                                        {(()=>{
                                            return this.state.items.map(item=>{
                                                return(
                                                    <View style={styles.listTrBox} key={item.id}>
                                                        <View style={styles.listTrBoxView}>
                                                            <View style={{marginRight:20,justifyContent:'center',height:45}}><Text style={{fontSize:16}}>{item.plate}</Text></View>
                                                            <View style={{justifyContent:'center',height:45}}><Text style={{fontSize:16}}>{item.proSchemeName}</Text></View>
                                                        </View>
                                                        <View style={{alignItems:'flex-end',}}>
                                                            <View style={{justifyContent:'center',height:35}}><Text>{item.price}元</Text></View>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        })()}
                                    </View>
                                </ScrollView>
                                <View style={{alignItems:'flex-end',position:'absolute',bottom:0,left:0,right:0,height:50,backgroundColor:'#108ee9',zIndex:999,justifyContent:'center',}}>
                                    <View style={{justifyContent:'center',height:50}}><Text style={{marginRight:15,fontSize:16,color:'#fff',}}>总计：{this.state.sumPrice}元</Text></View>
                                </View>
                            </View>
                        )

                        }
                    </View>
                    )}

                </View>


            )


    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeeee',
    },
    logoBox:{
        width:130,
        height:130,
        borderRadius:65,
        borderWidth:5,
        borderColor:'#fff',
        alignItems:'center',
        justifyContent:'center'
    },
    mineTop:{
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20,
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#ddd',
    },
    listTrBox:{
        backgroundColor:'#fff',
        paddingLeft:10,
        paddingRight:10,
        marginBottom:15,
    },
    listTrBoxView:{
        flexDirection:'row',
    },
    listTrBoxViewRight:{
        lineHeight:45,
        textAlign:'right',
        color:'#838586'
    },
});