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
    title:"姓名",
    value:"name",
},{
    title:"相似度",
    value:"like", 
},{
    title:"小区",
    value:"areaName",
},{
    title:"手机号",
    value:"phone",
},{
    title:"地址",
    value:"address",
},{
    title:"登记时间",
    value:"createTime",
},{
    title:"报警库",
    value:"type",
}];
const arr = [
    {
        originalImage:"http://171.34.44.55:8081/ifaas/api/uploads/2018-12-14-15-39-56-032_format_f.jpg",
        captureImage:"http://171.34.44.55:8081/ifsrc/engine1/store2_0/FaceWareHouse/src_0_1/20190128/20190128T092322_1016067_1044439_56839.jpg",
        name:"饶斌",
        like:"92%",
        areaName:"红谷凯旋小区南门人脸进",
        phone:"13712345678",
        address:"江西南昌红谷凯旋小区2203室",
        createTime:formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
        type:"涉毒",
    },
    {
        originalImage:"http://doordustorage.oss-cn-shenzhen.aliyuncs.com/doordu_admin/other/20180818/8dac64d08bc468cacd91534575743527.png",
        captureImage:"http://doordustorage.oss-cn-shenzhen.aliyuncs.com/doordu_admin/other/20180818/4f64d5c517e4655a52f1534575796661.jpg",
        name:"万霞",
        like:"92%",
        areaName:"红谷凯旋小区南门人脸进",
        phone:"15212345678",
        address:"江西南昌红谷凯旋小区2603室",
        createTime:formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
        type:"在逃",
    },
    {
        originalImage:"http://doordustorage.oss-cn-shenzhen.aliyuncs.com/doordu_admin/other/20180924/bc69127fe444203a0041537759970442.png",
        captureImage:"http://171.34.44.55:8081/ifaas/api/uploads/2018-12-14-15-36-41-322_format_f.jpg",
        name:"郭瑞",
        like:"92%",
        areaName:"红谷凯旋小区南门人脸进",
        phone:"13612345678",
        address:"江西南昌红谷凯旋小区0702室",
        createTime:formatDate(new Date(),"yyyy-MM-dd hh:mm:ss"),
        type:"抢劫-前科",
    }
];
export default class AlarmInfo extends Component{

    constructor(props){
        super(props);
        this.state ={
            data:arr[Math.floor(Math.random() *3)],
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
        let mapUrl = `https://meishutest-1256675553.cos.ap-chengdu.myqcloud.com/%E8%AD%A6%E5%8A%A1%E9%80%9AAPP(%E7%94%9F%E4%BA%A7)/map.html?lng=115.862411&lat=28.692943&myLng=121.458033&myLat=31.232279`;
        return (
            <View style={[GlobalStyles.pageBg,GlobalStyles.pdlr15]}>
                
                <View style={[GlobalStyles.containerBg,styles.itemContainer]}>

                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10,GlobalStyles.alignCenter,{justifyContent:"space-between",}]}>
                        <View style={[styles.imgContainer,GlobalStyles.alignCenter,GlobalStyles.borderColor]}>
                             <Image source={{uri:this.state.data.originalImage}} style={styles.imgStyle} />
                             <Text style={[GlobalStyles.font12Gray,styles.imgText]}>原始图片</Text> 
                         </View>
                       <View style={GlobalStyles.justifyCenter}>
                            <Text style={[GlobalStyles.font12Gray,GlobalStyles.mb5,GlobalStyles.taCenter]}>VS</Text>
                            <Text style={[GlobalStyles.font12Gray]}>相似度:<Text style={GlobalStyles.font12Red}>92%</Text></Text>
                         </View>
                        <View style={[styles.imgContainer,GlobalStyles.alignCenter,GlobalStyles.borderColor]}>
                            <Image source={{uri:this.state.data.captureImage}} style={styles.imgStyle} />
                            <Text style={[GlobalStyles.font12Gray,styles.imgText]}>抓拍照片</Text> 
                         </View>
                    </View>

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
    mapContainer:{
        width:(width-30),
        height:300,
        marginTop:10,
        marginBottom:20,
    },

});