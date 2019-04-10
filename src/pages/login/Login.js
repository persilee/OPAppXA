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
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const {Xinge} = NativeModules;

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

        this.state = {
            mobileNo: '',
            password: '',
            isChecked:false,
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

    render() {

        const { navigate } = this.props.navigation;
        return (
            <ImageBackground source={require("../../../assets/images/login_bg.jpg")} style={{ flex: 1 }}>
                <View style={[GlobalStyles.flex,GlobalStyles.pdlr15,{paddingTop:160}]}>
                    <View style={[GlobalStyles.flex,GlobalStyles.justifyCenter]}>
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
                        
                        <CommonBtn text={'登录'} onPress={this.login} style={{marginTop:140}} ></CommonBtn>       
                    </View>

                    <Text style={[GlobalStyles.font13White,GlobalStyles.taCenter,GlobalStyles.mb20]}>远宏科技</Text>

                    <Toast ref="toast" position={"center"}  fadeInDuration={500} />
                </View>
         </ImageBackground>
        );
    }

    valid(){
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
        }
        fetch(url,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(params)
            }
        ).then(response => response.json())
            .then(responseData => {
                console.log("login",responseData);
                if(responseData.code == 0){
                    this.setState({
                        mobileNo: '',
                        password: ''
                    });
                    let data = responseData.data;
                    Xinge.enableDebug(false);
                    Xinge.registerPushWithAccount(data.user.id).then(token =>{
                        console.info("Xinge推送的token",token);
                    });
                    this.props.User.updateUser(true,data.token,data.user.userName,data.user.id,
                        data.user.idcardNum,data.user.userNameChn,data.user.superName,data.user.orgName,data.user.userPosi);
                    this.props.User.updateModuList(data.moduList);
                    this.props.navigation.replace('Main');
                }else {
                    this.refs.toast.show(responseData.msg ?responseData.msg : "网络异常");
                }
            }).catch(err => {
                // console.error(err);
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
