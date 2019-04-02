import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,PixelRatio,TouchableOpacity
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import Color from "../config/color";
export default  class CommonItem extends  Component{
    constructor(props){
        super(props);
    }

    render(){
        /*
        leftIconVisible 默认是false
        rightIconVisible 默认是false
        * <MeItem leftIconVisible={true} leftIconName="" leftIconColor="" leftIconSize={30} leftText="实名认证" rightText=""
                        rightIconVisible={true} rightIconName="" rightIconColor="" rightIconSize={} leftTextStyle={} rightTextStyle={}
                        onPress={() => alert('test')}>
                </MeItem>
                */
        let leftIcon  = null,rightIcon  = null,leftText=null,rightText=null,leftStyle = null,rightStyle = null;
        if(this.props.leftIconVisible){
            let width = this.props.leftIconSize ? (this.props.leftIconSize + 10) : 25;
            leftIcon = (
                <View style={[{width:width,height:width,borderRadius:width/2},styles.iconView,GlobalStyles.center]}>
                    <FontAwesome size={this.props.leftIconSize ? this.props.leftIconSize :15}
                                 name={this.props.leftIconName ? this.props.leftIconName :"envelope"}
                                 color={this.props.leftIconColor ? this.props.leftIconColor :Color.whiteColor}></FontAwesome>
                </View>
            );
        }
        if(this.props.leftIconVisible){
            leftStyle = {
                marginLeft:8,
                marginRight:8
            }

        }

        if(this.props.rightText){
            rightStyle = {
                marginRight:8,
            }
            rightText = (
                <Text style={[rightStyle,GlobalStyles.font16White,this.props.rightTextStyle]}>{this.props.rightText}</Text>
            );
        }
        if(this.props.rightIconVisible){
            rightIcon = (
                <View>
                    <FontAwesome size={this.props.rightIconSize ? this.props.rightIconSize :22}
                                 name={this.props.rightIconName ? this.props.rightIconName :"angle-right"}
                                 color={this.props.rightIconColor ? this.props.rightIconColor :Color.whiteColor}></FontAwesome>
                </View>
            );
        }

        if(!leftIcon && !rightIcon && !rightText){
            //只有一个文本，文字居中
            leftText = (
                <Text style={[GlobalStyles.font14White,this.props.leftTextStyle]}> {this.props.leftText} </Text>
            );
        }else{
            leftText = (
                <Text style={[GlobalStyles.flex,GlobalStyles.font14White,leftStyle,this.props.leftTextStyle]}> {this.props.leftText} </Text>
            );
        }

        return (
            <TouchableOpacity onPress={this.props.onPress} style={[styles.itemContainer,
                GlobalStyles.pageBg1,GlobalStyles.flexDirectRow,GlobalStyles.center,this.props.style]}>
                {leftIcon}
                {leftText}
                {rightText}
                {rightIcon}
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    iconView:{
      backgroundColor:Color.basicColor,
    },
    itemContainer:{
        height:50,
    },

});