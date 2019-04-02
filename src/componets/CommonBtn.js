import React, { Component } from 'react';
import {
    StyleSheet,
    Text,TouchableOpacity,
    View,PixelRatio,Image,

} from 'react-native';

import GlobalStyles from '../../assets/styles/GlobalStyles';
import Color from "../config/color";

let basicColor = Color.btnColor;

export default class CommonBtn extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let {style,colors,fontStyle,text,containerStyle,...props} = this.props;
        let linearColor = colors ? colors : basicColor;

        return (
            <TouchableOpacity style={[styles.btnContainer,style]} 
                onPress={this.props.onPress}>
                <View style={[GlobalStyles.flex,GlobalStyles.center,{backgroundColor:linearColor},containerStyle]}>
                    <Text style={[GlobalStyles.font15White,styles.btn,fontStyle]}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const  styles = StyleSheet.create({
    btnContainer:{
        width:"100%",
        height:38,
        borderRadius:8,
        justifyContent:'center',
        overflow:'hidden',
    },
    btn:{
        textAlign:"center",
        // backgroundColor:"transparent",
    },
});