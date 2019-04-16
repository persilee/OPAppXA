import React, { Component } from 'react';
import {
    PixelRatio
} from 'react-native';
import Color from "../../src/config/color";

export default  GlobalStyles = {
    flex:{
        flex:1
    },
    flexDirectRow:{
        flexDirection:"row"
    },
    flexDirectColumn:{
        flexDirection:"column"
    },
    center:{
        justifyContent:"center",
        alignItems:"center",
    },
    justifyCenter:{
        justifyContent:"center",
    },
    justifyBetween:{
        justifyContent:"space-between",
    },
    justifyAround:{
        justifyContent:"space-around",
    },
    alignCenter:{
        alignItems:"center",
    },
    lineBottom:{
        // borderBottomWidth:1/PixelRatio.get(),
        borderBottomWidth:1,
        borderColor:Color.tabAndOtherBgColor,
    },
    lineBlackBottom:{
        borderBottomWidth:1,
        borderColor:Color.blackColor,
    },
    lineBlackTop:{
        borderTopWidth:1,
        borderColor:Color.blackColor,
    },
    lineBlackRight:{
        borderRightWidth:1,
        borderColor:Color.blackColor,
    },
    pageBg:{
        backgroundColor:Color.basicColor,
        flex:1,
    },
    pageBg1:{
        backgroundColor:Color.basicColor,
    },
    containerBg:{
        backgroundColor:Color.tabAndOtherBgColor,
    },
    headerBg:{
        backgroundColor:Color.headerBgColor,
    },
    blackBg:{
        backgroundColor:Color.blackColor,
    },
    whiteBg:{
        backgroundColor:Color.whiteColor,
    },
    grayBg:{
        backgroundColor:"#f5f5f5",
        flex:1,
    },
    blackColor:{
        color:Color.blackColor,
    },
    whiteColor:{
        color:Color.whiteColor,
    },
    tabAndOtherBgColor:{
        color:Color.tabAndOtherBgColor,
    },
    borderColor:{
        borderColor:Color.borderColor,
    },
    homeSearchBorderLeftColor:{
        borderLeftColor:Color.tabAndOtherBgColor
    },
    pdlr15:{
        paddingRight:15,
        paddingLeft:15,
    },
    pdlr10:{
        paddingRight:10,
        paddingLeft:10,
    },
    pdlr5:{
        paddingRight:10,
        paddingLeft:10,
    },
    containerBorder:{
        borderWidth:1,
        borderColor:Color.blackAlpha50Color,
    },
    p25:{
        padding: 25,
    },
    p15:{
        padding:15,
    },
    mr5:{
        marginRight:5,
    },
    ml5:{
      marginLeft:5,
    },
    ml10:{
        marginLeft:10
    },
    ml20:{
        marginLeft:20
    },
    mr10:{
        marginRight:10,
    },
    mt10:{
        marginTop:10,
    },
    mt15:{
        marginTop:15,
    },
    mr15:{
        marginRight:15,
    },
    mb10:{
        marginBottom:10,
    },
    mt30:{
        marginTop:30,
    },
    mb5:{
        marginBottom:5
    },
    mb20:{
        marginBottom:20
    },
    mb30:{
      marginBottom:30
    },
    mt40:{
      marginTop:40,
    },
    blackAlpha50:{
        backgroundColor:Color.blackAlpha50Color,
    },
    h50:{
        height:50,
    },
    w100:{
        width:"100%",
    },
    font14Black:{
        fontSize:14,
        color:Color.blackColor,
    },
    font15Black:{
        fontSize:15,
        color:Color.blackColor,
    },
    font12White:{
        fontSize:12,
        color:Color.whiteColor,
    },
    font13White:{
        fontSize:13,
        color:Color.whiteColor,
    },
    font14White:{
        fontSize:14,
        color:Color.whiteColor,
    },
    font15White:{
        fontSize:15,
        color:Color.whiteColor,
    },
    font16White:{
        fontSize:16,
        color:Color.whiteColor,
    },
    font18White:{
        fontSize:18,
        color:Color.whiteColor,
    },
    font20White:{
        fontSize:20,
        color:Color.whiteColor,
    },
    font50White:{
        fontSize:50,
        color:Color.whiteColor,
    },
    font12Gray:{
        fontSize:12,
        color:Color.fontColor,
    },
    font13Gray:{
        fontSize:13,
        color:Color.fontColor,
    },
    font14Blue: {
        fontSize: 14,
        color: Color.btnColor,
    },
    font14Gray:{
        fontSize:14,
        color:Color.fontColor,
    },
    font15Gray:{
        fontSize:15,
        color:Color.fontColor,
    },
    font16Gray:{
        fontSize:16,
        color:Color.fontColor,
    },
    font17Gray:{
        fontSize:17,
        color:Color.fontColor,
    },
    font18Gray:{
        fontSize:18,
        color:Color.fontColor,
    },
    font12Red:{
        fontSize:12,
        color:Color.specialColor,
    },
    font14Red:{
        fontSize:14,
        color:Color.specialColor,
    },
    font15Red:{
        fontSize:14,
        color:Color.specialColor,
    },
    taCenter:{
        textAlign:"center"
    },
    taRight:{
        textAlign:"right"
    },


}