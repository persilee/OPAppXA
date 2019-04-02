import React, { Component } from 'react';
import {
    StyleSheet,
    View,ScrollView,
    Text,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
    Platform,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Color from "../../config/color";
let itemArr = [
    {
        title:"姓名",
        value:"roomerName",
    },
    {
        title:"民族",
        value:"nation",
    },
    {
        title:"重点类型",
        value:"peopleType",
    },
    {
        title:"住户类型",
        value:"roomUserType",
    },
    {
        title:"是否外籍",
        value:"isForeign",
    },
    {
        title:"联系电话",
        value:"callPhone",
    },
    {
        title:"小区名称",
        value:"areaName",
    },
    {
        title:"楼宇名称",
        value:"buildingName",
    },
    {
        title:"身份证号码",
        value:"cardNumber",
    },
    {
        title:"户籍地址",
        value:"housePlace",
    },
    {
        title:"车牌号码",
        value:"vehicleNo",
    },
    {
        title:"所辖所",
        value:"orgName",
    },
    {
        title:"登记时间",
        value:"createTime"
    }
];
export default class QuickSearchDetail extends Component{
    constructor(props) {
        super(props);
        this.item = this.props.navigation.getParam("params",{});
    }

    renderPersonItem = () => {
        return (
            itemArr.map((obj,i) => {
                if((obj.title == "重点类型" && this.item[obj.value]) || obj.title != "重点类型"  ){
                    let valueColor = GlobalStyles.font14Gray,starImg = null;
                    if(obj.title == "重点类型"){
                        valueColor = GlobalStyles.font14Red;
                    }else if(obj.title == "姓名" && this.item.peopleType) {
                        starImg = (<Image source={require("../../../assets/images/five_star.png")} style={styles.fiveStartStyle} />);
                    }
                    return (
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]} key={`item-${i}`}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>{obj.title}：</Text>
                            <Text style={[valueColor,GlobalStyles.flex,GlobalStyles.justifyCenter]}>
                                {this.item[obj.value]}{starImg}
                            </Text>
                        </View>
                    );
                }else{
                    return null;
                }
            })
        );
    }

    render(){
        return (
            <ScrollView style={[GlobalStyles.pageBg,GlobalStyles.pdlr15]}>
                <View style={[GlobalStyles.containerBg,styles.itemContainer]}>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10]}>
                        {this.item.identyPhoto ? <Image source={{uri:this.item.identyPhoto,cache:true}} style={styles.imgStyle}/>
                            : <Image source={require("../../../assets/images/idcard_default.png")} style={styles.imgStyle}/> }
                        {this.item.imgUrl ? <Image source={{uri:this.item.imgUrl,cache:true}} style={[styles.imgStyle,{marginLeft:40}]}/>
                            : <Image source={require("../../../assets/images/image_default.png")} style={[styles.imgStyle,{marginLeft:40}]}/> }
                    </View>
                    <View>
                        { this.renderPersonItem() }
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer:{
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Color.blackColor,
        elevation:1,
        marginTop:25,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:15,
        paddingBottom:15,
    },
    imgStyle:{
        width:106,
        height:123,
        borderRadius:4,
    }
});