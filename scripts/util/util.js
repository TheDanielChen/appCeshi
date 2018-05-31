import React, { Component } from 'react';
import {
    PixelRatio,
    ActivityIndicator,
    Fetch,
    Alert
} from 'react-native';
import Dimensions from 'Dimensions';
var Util={
    pixel:1/PixelRatio.get(),
    baseUrl: "http://erp.chexs.cn:8082/",
    size:{
        width:Dimensions.get("window").width,
        height:Dimensions.get("window").height
    },
    get:function(url,successCallback,failCallback){
        fetch(url)
            .then((response)=>response.text())
            .then((responseText)=>{
                successCallback(JSON.parse(responseText));
            })
            .catch(function(err){
                failCallback(err);
            });
    },
    fetch:function(url,data,callback){
        var opts={
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        };
        //url="http://192.168.1.161:8080/" + url;
        url="http://erp.chexs.cn:8082/" + url;
        fetch(url,opts)
            .then((response)=>response.text())
            .then((responseText)=>{
                if(callback){
                    callback(JSON.parse(responseText))
                }
            })
    },
    fetchfix:function(url,data,callback){
        var opts={
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body:data
        };
        //url="http://192.168.1.161:8080/" + url;
        url="http://erp.chexs.cn:8082/" + url;
        fetch(url,opts)
            .then((response)=>response.text())
            .then((responseText)=>{
                if(callback){
                    callback(JSON.parse(responseText))
                }
            })
    },
    formatDate:function(date,send){
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        if(month<10){
            month="0"+month;
        }
        var day=date.getDate();
        if(day<10){
            day="0"+day;
        }
        if(send){
            return year+month+day;
        }else{
            return year+"-"+month+"-"+day;
        }
    },
    arrUnique:function (arr) {
        let hashTable={};
        let data=[];
        for(let i=0,l=arr.length;i<l;i++){
            if(!hashTable[arr[i]]){
                hashTable[arr[i]]=true;
                data.push(arr[i]);
            }
        }
        return data
    },
    error:function(){
        Alert.alert(
            '网络请求异常',
            '请检查您的网络',
            [
                {text: '确认', onPress: () => console.log('异常')},
            ]
        )
    },
    alert:function (msg,detail) {
        Alert.alert(
            msg?msg:"",
            detail?detail:"",
            [
                {text: '确认', onPress: () => console.log('异常')},
            ]
        )
    },
    loading:<ActivityIndicator color="#3E00FF"/>
};

export default Util;