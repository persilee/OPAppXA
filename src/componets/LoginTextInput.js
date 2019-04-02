import React, { Component } from 'react';
import {
	View, TextInput, StyleSheet, TouchableOpacity,Text,KeyboardAvoidingView
} from 'react-native';

import GlobalStyles from '../../assets/styles/GlobalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast';
import {isPoneAvailable} from '../utils/Utils';
import Color from "../config/color";
export default class LoginTextInput extends Component{

	constructor(props){
        super(props);
        this.state = {
            countDownFlag:false,
            time:60,
        }

        this._timer=null;
        //Can only update a mounted or mounting component. This usually means you called setState, replaceState, or forceUpdate on an unmounted component. This is a no-op.
        //解决上面的提示bug
        this.lock = false;
    }

    componentWillUnmount(){
        this.lock = true;
    }
    confirmInfo =()=> {
        let phoneNumber = this.props.phoneNumber;
        if(!phoneNumber){
            this.props.tipFunc && this.props.tipFunc('请输入手机号码');
            return false;
        }
        if(!isPoneAvailable(phoneNumber)){
            this.props.tipFunc && this.props.tipFunc('请输入正确手机号');
            return false;
        }
        return true;
    }

    countDown = () => {
        if(!this.state.countDownFlag){
            if(!this.confirmInfo()){
                return;
            }
            this.props.onPress(); //发送验证码
            this.setState({
                countDownFlag:true
            });
            this.beginTime();
        }
    }

    beginTime = () => {
        this._timer = setInterval( () => {
            if(!this.lock) {
                if(!this.props.hasRegister) { //用户已被注册
                    if (this.state.time < 1) {
                        this.stopTime();
                    } else {
                        this.setState({
                            time: this.state.time - 1
                        });
                    }
                }else{
                    this.stopTime();
                }
            }
        },1000);
    }

    stopTime = () => {
	    this.initCount();
        this._timer && clearInterval(this._timer);
    }

    initCount = () => {
        this.setState({
            countDownFlag:false,
            time:60,
        });
    }

    componentWillUnmount() {
        this.stopTime();
    }


    render(){
    	let {codeVisble,style,iconVisible,iconName,iconSize,iconColor,hasRegister,inputStyle,...props} = this.props;

        let viewStyle = [GlobalStyles.h50,GlobalStyles.flexDirectRow,GlobalStyles.center,
                GlobalStyles.borderColor,styles.loginContainer,style],codeView = null,iconView =null;

        if(codeVisble){
            codeView = (
                <View style={styles.confirmContainer}>
                    <Text style={styles.confirmFont} onPress={this.countDown}>
                        {this.state.countDownFlag ? `已发送(${this.state.time}s)` :'获取验证码'}
                        </Text>
                </View>
            );
        }

        if(iconVisible){
            iconView = <FontAwesome name={iconName} color={iconColor?iconColor:Color.whiteColor} size={iconSize?iconSize:16} style={GlobalStyles.mr10} />;
        }

    	return (
			<View style={viewStyle}>
                {iconView}
                <KeyboardAvoidingView style={GlobalStyles.flex}>
        			<TextInput
      		         underlineColorAndroid={"transparent"}
      		         style={[GlobalStyles.flex,GlobalStyles.font14White,inputStyle]}
      		       	 {...props}
      		        />
                </KeyboardAvoidingView>
                {codeView}
                <Toast ref="toast" position={"center"}  fadeInDuration={1000} />
	    	</View>
    	);
    }

}

const styles = {
    loginContainer:{
        paddingLeft:10,
        paddingRight:10,
        borderRadius:3,
        borderWidth:1,
        opacity: 0.8,
        backgroundColor: Color.basicColor,
    },
    confirmContainer:{
        width:86,
        height:20,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:1,
    },
    confirmFont:{
        fontSize:13,
        color:"#999"
    }
}