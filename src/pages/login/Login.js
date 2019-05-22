import React, { Component } from 'react';
import {
    StyleSheet,ImageBackground,TouchableHighlight,
    Button,
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Platform,
    BackHandler,NativeModules,
} from 'react-native';

import LoginTextInput from '../../componets/LoginTextInput';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import CommonBtn from  '../../componets/CommonBtn';
import Toast, {DURATION} from 'react-native-easy-toast';
import API from '../../api/index';
import {observer,inject} from 'mobx-react';
import {getUserId} from "../../utils/Common";
import Color from "../../config/color";
import CommonFetch from "../../componets/CommonFetch";
import { Select } from 'teaset';


const {Xinge} = NativeModules;

console.log('NativeModules',NativeModules);
console.log('Xinge',Xinge);

@inject('User')
@observer
export default class Login extends Component{

    constructor(props) {
        super(props);
        
        let now = new Date().getTime();
        let expiration = this.props.User.expiration ? this.props.User.expiration : 0;
        if(now < expiration && this.props.User.userId ){
            this.props.navigation.replace('Main');
        }
        this.customItems = [
            {
                text: '公园天下',
                value: 10001,
            },
            {
                text: '民航小区',
                value: 10002,
            },
            {
                text: '红谷凯旋',
                value: 10003,
            },
            {
                text: '龙记学府城',
                value: 10004,
            },
            {
                text: '西城派出所',
                value: 10005,
            },
            {
                text: '凤凰家园',
                value: 10006,
            },
            {
                text: '廊坊安次',
                value: 10007,
            },
            {
                text: '酒泉凯旋苑',
                value: 10008,
            },
            {
                text: '众美绿都',
                value: 10009,
            },
            {
                text: '花果园',
                value: 10010,
            },
        ];

        this.state = {
            mobileNo: '',
            password: '',
            isChecked:false,
            valueCustom: null,
            faceToken: null,
        };
    }

    componentDidMount(){
        /*登录 分为几种情况：
        1.app启动，user初始化，会发送DeviceEventEmitter事件，跳转到main
        2.app已启动，user已经初始化了，不会再走DeviceEventEmitter事件，但login会走 constructor，componentDidMount生命周期，跳转到main
        3、
        token过期，清空User数据时，DeviceEventEmitter事件和 getUserId方法都执行，但getUserId先执行跳转到Main页面，有时间差
        */
        this.loginListener = DeviceEventEmitter.addListener('LoginStatus',(status,msg) => {
            console.info(status,msg);
            if(status == "success"){
                this.props.navigation.replace('Main');
            }
        });
    }
    
    componentWillMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }

        this.loginListener && this.loginListener.remove();
    }

    onBackAndroid = () => {
        //如果没有添加任何监听函数，或者所有的监听函数都返回 false，则会执行默认行为，退出应用
        const navigation = this.props.navigation;
        console.info("Login navigation",navigation);
        if (navigation) {
            // navigation.navigate("Main");
            return true;
        }
        return false;
    }

    checkClick = () => {
        this.setState({
            isChecked: !this.state.isChecked
        });
    }

    isSelected = (item) => {
        console.log('item',item);
        this.setState({ valueCustom: item.value },() => {
            console.log('valueCustom', this.state.valueCustom);
        });
    }

    render() {

        const { navigate } = this.props.navigation;
        return (
            <ImageBackground source={require("../../../assets/images/login_bg.png")} style={{ flex: 1 }}>
                <View style={[GlobalStyles.flex,GlobalStyles.pdlr15,{paddingTop:160}]}>
                    <View style={[GlobalStyles.flex,GlobalStyles.justifyCenter]}>
                        <Select
                            style={[GlobalStyles.mb15, GlobalStyles.p15, { backgroundColor: Color.headerBgColor, borderColor: Color.borderColor, height: 40 }]}
                            value={this.state.valueCustom}
                            valueStyle={{ flex: 1, color: Color.whiteColor, textAlign: 'left' }}
                            items={this.customItems}
                            getItemValue={(item, index) => item.value}
                            getItemText={(item, index) => item.text}
                            iconTintColor={Color.whiteColor}
                            placeholder='请选择网点'
                            pickerTitle='请选择网点'
                            pickerType='pull'
                            onSelected={(item, index) => this.isSelected(item)}
                        />
                        <LoginTextInput maxLength={11} placeholderTextColor={Color.whiteColor}
                                placeholder="请输入警员编号" iconVisible={true} iconName={"user"} iconColor={Color.whiteColor}
                                value={this.state.mobileNo} inputStyle={[GlobalStyles.font14White]}
                                onChangeText={(mobileNo) => this.setState({mobileNo})}
                                style={styles.loginContainer}
                        />

                        <LoginTextInput placeholderTextColor={Color.whiteColor} maxLength={16}
                            placeholder="请输入登录密码" iconVisible={true} iconName={"lock"} iconColor={Color.whiteColor}
                            value={this.state.password} inputStyle={[GlobalStyles.font14White]}
                            onChangeText={(password) => this.setState({password})}
                            secureTextEntry={true}   style={styles.loginContainer}            
                        />

                        {/* <TouchableHighlight underlayColor={'transparent'} onPress={() => this.checkClick()}>
                            <View style={[GlobalStyles.flexDirectRow,GlobalStyles.ml10,GlobalStyles.alignCenter]}>
                                <View style={[styles.check,GlobalStyles.mr10,GlobalStyles.center]}>
                                    {this.state.isChecked ? <FontAwesome name={"check"} color={Color.basicColor} size={10} /> :null }
                                </View>
                                <Text style={GlobalStyles.font12White}>记住密码</Text>
                            </View>
                        </TouchableHighlight> */}
                        
                        <CommonBtn text={'登 录'} onPress={this.login} style={{ marginTop: 10, colors: '#2663ff'}} ></CommonBtn> 
                    </View>

                    <Text style={[GlobalStyles.font13White,GlobalStyles.taCenter,GlobalStyles.mb20]}></Text>

                    <Toast ref="toast" position={"center"}  fadeInDuration={500} />
                </View>
         </ImageBackground>
        );
    }

    valid(){
        if(!this.state.valueCustom){
            this.refs.toast.show('请选择小区');
            return false;
        }
        if(!this.state.mobileNo){
            this.refs.toast.show('请输入警员编号');
            return false;
        }
        if(!this.state.password){
            this.refs.toast.show('请输入登录密码');
            return false;
        }
        return true;
    }

    login = () => {
        if(!this.valid()) return;
        this.loginMethod();
    }

    loginMethod = () =>{
        // let url = "http://192.168.1.23:8380/api/appserver/auth/login";
        let url = API.login;
        let params = {
            passwd:this.state.password,
            userName:this.state.mobileNo,
        };
        let requestParams = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    areaKey: this.state.valueCustom,
                },
                body:JSON.stringify(params)
            };
        fetch(url,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    areaKey: this.state.valueCustom,
                },
                body:JSON.stringify(params)
            }
        ).then(response => response.json())
            .then(responseData => {
                console.log("login",responseData);
                console.log('requestParams',requestParams);
                if(responseData.code == 0){
                    this.setState({
                        mobileNo: '',
                        password: ''
                    });
                    let data = responseData.data;
                    if(Platform.OS == 'android'){
                        Xinge.enableDebug(false);
                        Xinge.registerPushWithAccount(data.user.id).then(token =>{
                            console.info("Xinge推送的token",token);
                        });
                    }
                    //获取人脸的token
                    CommonFetch.doFetch(
                        API.longFace + '?loginname=admin&password=123456',
                        '',
                        (responseData)=>{                           
                            this.setState({
                                faceToken: `${responseData.data.token_type} ${responseData.data.access_token}`,
                            });                          
                            this.props.User.updateUser(true, data.token,this.state.valueCustom,data.user.userName,data.user.id,
                            data.user.idcardNum,data.user.userNameChn,data.user.superName,data.user.orgName,data.user.userPosi,this.state.faceToken);
                            this.props.User.updateModuList(data.moduList);
                            this.props.navigation.replace('Main');
                        }
                    )
                }else {
                    this.refs.toast.show(responseData.msg ?responseData.msg : "网络异常");
                }
            }).catch(err => {
                console.error(err);
                this.refs.toast.show("网络异常");
        });
    }
}

const styles = StyleSheet.create({
    loginContainer:{
        height:40,
        marginBottom:20,
    },
    check:{
        width:12,
        height:12,
        backgroundColor:Color.fontColor
    }



});
