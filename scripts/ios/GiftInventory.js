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


export default class GiftInventory extends Component{
    static navigationOptions = ({ navigation }) => ({
        headerTitle:'礼品库存',
        headerRight:null,
    });

    constructor(props){
        super(props);
        this.state = {
            items:[
                // {code:'1',title:'礼品一',count:11},
                // {code:'2',title:'礼品二',count:11},
                // {code:'3',title:'礼品三',count:11},
                // {code:'4',title:'礼品四',count:11},
                // {code:'5',title:'礼品五',count:11},
            ],
            countTotal:0,
            isShow: true,
        };
    }
    componentWillUnMount(){

    }
    componentWillMount(){
        const { params } = this.props.navigation.state;
        var userId = params.userId;
        this.getGiftLeft(userId);
    }
    async getGiftLeft(userId){
        console.log('用户'+userId);
        Util.fetch("mobile/summary/giftLeft", userId, (result) =>{
            if(result.code == "200" && result.data){
                // console.log(result.data)
                this.setState({
                    items:result.data,
                    isShow:false,
                })
            }
        })
    }

    render(){
        return (
            <View>
                {
                    this.state.isShow==true?(
                    <View style={{alignItems:'center',height:1500,backgroundColor:'#fff'}} >
                        <Image style={{width:400,height:300}}  source={require('../images/loading.gif')}/>
                    </View>
                ):( <View>
                        <ScrollView>
                        <View style={styles.container}>
                                {/*<View style={styles.mineTop}>*/}
                                    {/*<View style={styles.logoBox}>*/}
                                        {/*<View><Text style={{fontSize:20}}>库存总计</Text></View>*/}
                                        {/*<View><Text style={{fontSize:15,color:'red',marginTop:10}}>{this.state.countTotal}件</Text></View>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                                <View>
                                    {(()=>{
                                        return this.state.items.map(item=>{
                                            return(
                                                <View style={styles.listTrBox} key={item.giftId}>
                                                    <TouchableHighlight>
                                                        <View style={styles.listTrBoxView}>
                                                            <View style={{flex:2,alignItems:'center'}}><Ionicons style={{marginTop:12}} name='ios-done-all' size={24} color="#979595" /></View>
                                                            <View style={{flex:10,justifyContent: 'center',height:45}}><Text style={{fontSize:16}}>{item.name}</Text></View>
                                                            <View style={{flex:4,justifyContent: 'center',height:45}}><Text style={styles.listTrBoxViewRight}>{item.amount==null?0:item.amount}件</Text></View>
                                                        </View>
                                                    </TouchableHighlight>
                                                </View>
                                            )
                                        })
                                    })()}
                                </View>
                        </View>
                        </ScrollView>
                    </View>
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
    logoBox:{
        width:130,
        height:130,
        borderRadius:65,
        borderWidth:5,
        borderColor:'#108ee9',
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
        paddingRight:10
    },
    listTrBoxView:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#ddd',
        justifyContent: 'center',
    },
    listTrBoxViewRight:{
        textAlign:'right',
        color:'#838586'
    },
});