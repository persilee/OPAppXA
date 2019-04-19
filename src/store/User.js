import { observable, action ,computed} from "mobx";
//import CookieManager from "react-native-cookiemanager";
import {AsyncStorage,DeviceEventEmitter} from 'react-native';


//import DateUtil from "../utils/DateUtil";

class User {


    @observable userInfo = {
        isLogin:false,
        token:"",
        mobileNo:"",
        userId:"",
        idcardNum: "",
        userNameChn:"",
        superName:"",
        orgName:"",
        userPosi:"",
        expiration:"",
    };

    @observable moduList = [];

    @computed get isLogin(){
        return this.userInfo.isLogin;
    }; // 注册变量，使其成为可检测的
    @computed get token(){
        return this.userInfo.token;
    };
    @computed get mobileNo(){
        return this.userInfo.mobileNo;
    };
    @computed get userId(){
        return this.userInfo.userId;
    };
    @computed get idcardNum(){
        return this.userInfo.idcardNum;
    };
    @computed get userNameChn(){
        return this.userInfo.userNameChn;
    };
    @computed get superName(){
        return this.userInfo.superName;
    };
    @computed get orgName(){
        return this.userInfo.orgName;
    };

    @computed get expiration(){
        return this.userInfo.expiration;
    }

    @computed get userPosi(){ //0民警  1辅警
        return this.userInfo.userPosi;
    };

    @computed get moduleList(){
        return this.moduList.map(item => {
            return item;
        });
    }

    constructor() {
        this.refreshInfo();
    }

    @action
    updateUser = (flag, _token, areaKey, _mobileNo, userId,idcardNum,userNameChn,superName,orgName,userPosi) =>{

        let date = new Date();//token有效期 7天
        date.setTime(date.getTime() + 1000*60*60*24*7);
        // date.setTime(date.getTime() + 1000*60*2);//测试用

        this.userInfo = {
            isLogin:flag,
            token:_token,
            areaKey: areaKey,
            mobileNo:_mobileNo,
            userId:userId,
            idcardNum: idcardNum,
            userNameChn:userNameChn,
            superName:superName,
            orgName:orgName,
            userPosi:userPosi,
            expiration:date.getTime(),
        }
        AsyncStorage.setItem("_userInfo",JSON.stringify(this.userInfo));
        AsyncStorage.setItem("_userId",userId);
    }

    @action 
    updateModuList = (data) => {
        this.moduList = data;
        AsyncStorage.setItem("_moduleTree",JSON.stringify(data));
    }

    @action
    logout = ()=>{
        AsyncStorage.removeItem("_userInfo");
        AsyncStorage.removeItem("_moduleTree");
        AsyncStorage.removeItem("_userId");
    }

    @action
    refreshInfo = async ()=>{

        let info = await AsyncStorage.getItem("_userInfo");
        console.log("_userInfo",info);
        if(info){
            let _userInfo = JSON.parse(info);
            console.log(_userInfo);
            let now = new Date().getTime();
            if(now > _userInfo.expiration){
                console.log("token过期了");
                DeviceEventEmitter.emit('LoginStatus',"fail","token过期");
                this.logout();
                this.userInfo = {
                    isLogin:false,
                    token:"",
                    areaKey:"",
                    mobileNo:"",
                    userId:"",
                    idcardNum:"",
                    userNameChn:"",
                    superName:"",
                    orgName:"",
                    userPosi:"",
                    expiration:"",
                }
                this.moduList = [];
                
            }else{
                this.userInfo = _userInfo;
                AsyncStorage.setItem("_userInfo",JSON.stringify(this.userInfo));
                
                let _moduleTree = await AsyncStorage.getItem("_moduleTree");
                console.log("刷新时间",_moduleTree);
                this.moduList = JSON.parse(_moduleTree) || [];
                DeviceEventEmitter.emit('LoginStatus',"success","登录成功");
                
            }
        }


    }


}

export default new User()