import React, { Component } from 'react';
import {
    StyleSheet,WebView,ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import API from '../../api/index';
import {width,getUserId} from "../../utils/Common";
import CommonFetch from "../../componets/CommonFetch";
import Geolocation from 'Geolocation';
import {formatDate} from "../../utils/Utils";
let titleArr = [{
    title:"手机号",
    value:"phone",
},{
    title:"身份证号",
    value:"idCard", 
},{
    title:"报警时间",
    value:"alarmTime",
}];
export default class InfoAlarm extends Component{

    constructor(props){
        super(props);
        this.state ={
            data:{
                phone:"17709876543",
                idCard:"34434556677887888888",
                alarmTime:formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
            },
            lon:"",
            lat:"",
        }
        this.getLocation();
    }

    getLocation(){
        Geolocation.getCurrentPosition((location) => {
            console.info("gps定位",location);
            this.setState({
                lon:location.coords.longitude,
                lat:location.coords.latitude,
            });
       });
    }

    renderPersonItem = () => {
       
        return (
            <View>
            {
                titleArr.map((item,index) =>{
                    let specialColor = GlobalStyles.font14Gray;
                    if(item.value == "like"){
                        specialColor = GlobalStyles.font14Red;
                    }
                    return (
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5,GlobalStyles.justifyCenter]} key={`item-${index}`}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>{item.title}：</Text>
                            <Text style={[GlobalStyles.flex,GlobalStyles.justifyCenter,specialColor]}>{this.state.data[item.value]}</Text>
                        </View>
                    );
                })
            }
            </View>
        );
    }


    render(){
      // let mapUrl = `http://work.meishutech.com/test/map.html?lng=${this.state.lon}&lat=${this.state.lat}`; 
        let mapUrl = `https://meishutest-1256675553.cos.ap-chengdu.myqcloud.com/%E8%AD%A6%E5%8A%A1%E9%80%9AAPP(%E7%94%9F%E4%BA%A7)/map.html?lng=115.863276&lat=28.69269&myLng=121.458033&myLat=31.232279`;
        return (
            <View style={[GlobalStyles.pageBg,GlobalStyles.pdlr15]}>
                
                <View style={[GlobalStyles.containerBg,styles.itemContainer,GlobalStyles.flexDirectColumn]}>
                    {
                        this.renderPersonItem()
                    }
                </View>

                 <WebView source={{uri: mapUrl}} 
                        javaScriptEnabled={true} 
                        style={styles.mapContainer} />

            </View>
        );
    }


}

const styles = StyleSheet.create({
    itemContainer:{
        borderRadius:8,
        elevation:2,
        marginTop:20,
        marginBottom:20,
        padding:15,
    },
    mapContainer:{
        width:(width-30),
        height:200,
        marginTop:10,
        marginBottom:20,
    },
});