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
    title:"车辆号码",
    value:"carNo",
},{
    title:"车主信息",
    value:"ownerName", 
},{
    title:"车身颜色",
    value:"carColor",
},{
    title:"车辆类型",
    value:"carType",
},{
    title:"车辆品牌",
    value:"carBrand",
},{
    title:"车辆系列",
    value:"carSeries",
},{
    title:"卡口名称",
    value:"entranceName",
},{
    title:"通过卡口时间",
    value:"entranceTime",
}];
export default class CarAlarm extends Component{

    constructor(props){
        super(props);
        this.state ={
            data:{
                carNo:"赣AY9536",
                ownerName:"王燕群",
                carColor:"黑色",
                carType:"小轿车",
                carBrand:"英朗XT",
                carSeries:"B3",
                entranceName:"南口",
                entranceTime:formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
            },
        }
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
        return (
            <View style={[GlobalStyles.pageBg,GlobalStyles.pdlr15]}>
                
                <View style={[GlobalStyles.containerBg,styles.itemContainer]}>

                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10,GlobalStyles.alignCenter]}>
                        <View style={[styles.imgContainer,GlobalStyles.alignCenter,GlobalStyles.borderColor]}>
                             <View style={[GlobalStyles.center,{position:"relative"}]}>
                                 <Image source={{uri:"http://171.34.44.55:8083/464237311308070915/2019/01/22/21/NM-J/21311881444029302.jpg?fid=500864-AA5A0002A-74D97F-46218"}} style={styles.imgStyle} />
                                 <Text style={[GlobalStyles.font14Gray,styles.alarmTips]}>原始图片</Text>
                             </View>
                             <Text style={[GlobalStyles.font12Gray,styles.imgText]}>原始图片</Text> 
                         </View>
                        <View style={[styles.imgContainer,GlobalStyles.alignCenter,GlobalStyles.borderColor,GlobalStyles.ml20]}>
                            <View style={[GlobalStyles.center,{position:"relative"}]}>
                                <Image source={{uri:"http://171.34.44.55:8083/464237311308070915/2019/01/22/21/NM-J/21311881444029302.jpg?fid=500864-AA5A0002A-74D97F-46218"}} style={styles.imgStyle} />
                                <Text style={[GlobalStyles.font14Gray,styles.alarmTips]}>车辆照片</Text>
                            </View>
                            <Text style={[GlobalStyles.font12Gray,styles.imgText]}>抓拍照片</Text> 
                         </View>
                    </View>

                        {
                            this.renderPersonItem()
                        }

                </View>
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
    imgContainer:{
        width:106,
        height:153,
        borderWidth:1,
        borderRadius:4,
    },
    imgStyle:{
        width:106,
        height:123,
        borderRadius:3,
    },
    imgText:{
        height:30,
        lineHeight:30,
    },
    alarmTips:{
        position:"absolute",
        left:25,
        top:55,
    }

});