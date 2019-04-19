import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Platform,
    BackHandler,
} from 'react-native';

import CommonItem from "../../componets/CommonItem";
import ToggleSwitch from "../../componets/ToggleSwitch";
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import {observer,inject} from 'mobx-react';
import API from "../../api/index";
import Toast, {DURATION} from 'react-native-easy-toast';
import Color from "../../config/color";
@inject('User')
@observer
export default class Setting extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isToggle:false,
        }
    }

    logout = () => {
        console.log(this.props.User.token);
        fetch(API.loginOut,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.props.User.token
            },
        })
            .then(response => response.json())
            .then(responseData => {
                console.log("logout",responseData);
                if(responseData.code == 0){
                    this.props.User.updateUser(false, "", "","","","","","","");
                    this.props.User.updateModuList([]);
                    this.props.User.logout();
                    this.props.navigation.navigate("Login");
                }else{
                    this.refs.toast.show("退出登录失败");
                }
            }).catch(err => {
                console.log(err);
        });
    }

    itemSwitch = (value) => {
        //调用免打扰接口
        this.setState({
            isToggle:value
        });
    }

    render(){
        return (
            <View style={[GlobalStyles.pageBg]}>
                <View style={[GlobalStyles.lineBottom,styles.itemStyle,GlobalStyles.flexDirectRow,
                    GlobalStyles.alignCenter,GlobalStyles.pageBg1,GlobalStyles.pdlr15]}>
                    <View style={[GlobalStyles.flex]}>
                        <Text style={[GlobalStyles.font15Gray]}>一键免打扰</Text>
                        <Text style={[GlobalStyles.font12Gray,GlobalStyles.mb5]}>开启后，所有的消息通知将都不会通知您</Text>
                    </View>

                    <ToggleSwitch isOn={this.state.isToggle}
                                onColor= {Color.btnColor}
                                offColor={Color.fontColor}
                                size='small'
                                onToggle={ (value) => this.itemSwitch(value)} />
                </View>

                <CommonItem  leftText="退出登录" style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}
                         rightIconVisible={true}  onPress={this.logout} />

                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} 
                    fadeOutDuration={1000} opacity={0.8}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemStyle:{
        height:60,
    },
    
});