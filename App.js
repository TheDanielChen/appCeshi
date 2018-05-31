import React, { Component } from 'react';
import {
    View,
    AppRegistry,
    Text,
    StyleSheet,
    Button,
} from 'react-native';

import LoginScreen from './scripts/ios/Login';
import SendPieces from './scripts/ios/SendPieces';
import PiecesDetail from './scripts/ios/PiecesDetail';
import Setup from './scripts/ios/Setup';
import PiecesSucess from './scripts/ios/PiecesSucess';
import RealPiecesSucess from './scripts/ios/RealPiecesSucess';
import PiecesFail from './scripts/ios/PiecesFail';
import ChangePieceAdress from './scripts/ios/ChangePieceAdress';
import TotalCash from './scripts/ios/TotalCash';
import TotalPiece from './scripts/ios/TotalPiece';
import GiftInventory from './scripts/ios/GiftInventory';
import TodayGift from './scripts/ios/TodayGift';
import RealNameSyetemDetail from './scripts/ios/RealNameSyetemDetail';
import ChangePwd from './scripts/ios/ChangePwd';
import FailReasonQita from './scripts/ios/FailReasonQita';
import ReasonSucess from './scripts/ios/ReasonSucess';
import Scanning from './scripts/ios/Scanning';
import ScannDetail from './scripts/ios/ScannDetail';
import IncrementSubmit from './scripts/ios/IncrementSubmit';
import NavigationCustomBackMenu from './scripts/ios/goBack';
import ToadyIncrements from './scripts/ios/ToadyIncrements';

import { StackNavigator } from 'react-navigation';


export default class App extends Component{
  render(){
    return(
        <SimpleApp />
    )
  }
}
// NavigationCustomBackMenu为自定义按钮
const navigationConfig = {
  navigationOptions: ({navigation}) => ({
    headerLeft: <NavigationCustomBackMenu nav = {navigation} />,
    headerTitleStyle:{alignSelf:'center'},
    gesturesEnabled:true
  })
};

const SimpleApp = StackNavigator({
  Login: { screen: LoginScreen},
  SendPieces: { screen: SendPieces},
  PiecesDetail: { screen: PiecesDetail},
  Setup: { screen: Setup},
  PiecesSucess: { screen: PiecesSucess},
  RealPiecesSucess: { screen: RealPiecesSucess},
  PiecesFail: { screen: PiecesFail},
  ChangePieceAdress: { screen: ChangePieceAdress},
  TotalCash:{screen:TotalCash},
  TotalPiece:{screen:TotalPiece},
  GiftInventory:{screen:GiftInventory},
  TodayGift:{screen:TodayGift},
  ChangePwd:{screen:ChangePwd},
  FailReasonQita:{screen:FailReasonQita},
  ReasonSucess:{screen:ReasonSucess},
  Scanning:{screen:Scanning},
  ScannDetail:{screen:ScannDetail},
  IncrementSubmit:{screen:IncrementSubmit},
  ToadyIncrements:{screen:ToadyIncrements},
  RealNameSyetemDetail:{screen:RealNameSyetemDetail}
},navigationConfig);




AppRegistry.registerComponent('App', () => App);