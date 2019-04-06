import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,RefreshControl,AsyncStorage,
    Button,NativeModules,
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import SpacingView from "../../componets/SpacingView";
import HomeTextImage from '../../componets/HomeTextImage';
import CommonSearch from "../../componets/CommonSearch";
import {width,getUserId} from "../../utils/Common";
import CommonFetch from "../../componets/CommonFetch";
import API from "../../api/index";
import {observer,inject} from 'mobx-react';
import {groupBy} from "../../utils/Utils";
import NotifService from '../../componets/NotifService';
import BackgroundJob from 'react-native-background-job';
import Color from "../../config/color";

const {Xinge} = NativeModules;
let itemArr = [{
    title:"房屋核查",
    color:"#FCC23F",
    isImage:true,
    name:require("../../../assets/images/home_check.png"),
    iconOutSize:48,
    height:66,
    iconSize:30,
    page:"Check",
    moduCode:"Check",
},{
    title:"纠纷化解",
    color:"#B9E669",
    isImage:true,
    name:require("../../../assets/images/home_dispute.png"),
    iconOutSize:48,
    height:66,
    iconSize:30,
    page:"Dispute",
    moduCode:"DisputeCheck",
},{
    title:"布控预警",
    color:"#FEA095",
    isImage:true,
    name:require("../../../assets/images/home_control.png"),
    iconOutSize:48,
    height:66,
    iconSize:30,
    page:"Control",
    moduCode:"ControlPrecaution",
},
{
    title:"任务统计",
    color:"#89DBFD",
    isImage:true,
    name:require("../../../assets/images/home_task.png"),
    iconOutSize:48,
    height:66,
    iconSize:30,
    page:"History",
    moduCode:"TaskStatistics",
},
{
    title:"实有房屋",
    color:"#89DBFD",
    isImage:true,
    name:require("../../../assets/images/home_house.png"),
    iconOutSize:48,
    height:66,
    iconSize:30,
    page:"HouseReal",
    moduCode:"RealHouse",
},{
    title:"实有人口",
    color:"#FD6D6D",
    isImage:true,
    name:require("../../../assets/images/home_population.png"),
    iconOutSize:48,
    height:66,
    iconSize:30,
    page:"Distribution",
    moduCode:"RealPopulation",
},{
    title:"实有单位",
    color:"#B9E669",
    isImage:true,
    name:require("../../../assets/images/home_unit.png"),
    iconOutSize:48,
    height:66,
    iconSize:30,
    page:"RealUnit",
    moduCode:"RealUnit",
},{
    title:"实有车辆",
    color:"#FCC23F",
    isImage:true,
    name:require("../../../assets/images/home_car.png"),
    iconOutSize:48,
    height:66,
    iconSize:30,
    page:"VehicleRegional",
    moduCode:"RealVehicle",
}];

@inject('User')
@observer
export default class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing:false,
            alarmLst:[],
            senderId: 'senderID',
        }

        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
    }

    onRegister(token) {
        Alert.alert("Registered !", JSON.stringify(token));
        console.log(token);
        this.setState({ registerToken: token.token, gcmRegistered: true });
    }

    onNotif(notif) {
        console.log(notif);
        Alert.alert(notif.title, notif.message);
    }

    componentWillMount() {
        if (Platform.OS === 'android') {
            const backgroundJob = {
                jobKey: 'backgroundNotif',
                job: () => this.notif.getAlarmList()
            };
            BackgroundJob.register(backgroundJob);
        }
    }

    componentDidMount(){
        getUserId().then(_userId => {
            this.userId = _userId;
            if (this.findmoduleIndex("TodayAlarm") > -1 ){
                this.getHomeAlarmList();
            }
        });

        if (BackgroundJob) {
            BackgroundJob.schedule({
                jobKey: "backgroundNotif",       //后台运行任务的key
                period: 5000,                     //任务执行周期
                exact: true,                     //安排一个作业在提供的时间段内准确执行
                allowWhileIdle: true,            //允许计划作业在睡眠模式下执行
                allowExecutionInForeground: true,//允许任务在前台执行
            });
        }

        // Xinge.enableDebug(true);
        // Xinge.registerPushWithAccount(this.props.User.userId).then(token =>{
        //     console.info("Xinge推送的token",token);
        // });
        // Xinge.registerPush().then(token =>{
        //     console.info("Xinge推送的token",token);
        // });

        // Xinge.bindAccount("aaa").then(data => {
        //     console.info("Xinge绑定账户",data);
        // });
    }

    findIndexAlarm = (arr,sorted,type) =>{
        let newArr = arr;
        let index =  sorted.findIndex(item => {
            return item[0].alarmType ==  type;
        });
        if(index > -1){
            newArr = arr.concat(sorted[index]);
        }
        return newArr;
    }
    getHomeAlarmList = () => {
        let params = {init: 0,
            pageNum: 1,
            pageSize: 3,
            queryPair: {
                // userId: "001"
                userId:this.userId,
            }};
        CommonFetch.doFetch(API.getHomeAlarmList,params,(responseData)=>{
            console.info('getHomeAlarmList', responseData);
            if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                let sorted = groupBy(responseData.data.list, function (item) {
                    return [item.alarmType];
                });
                let arr = []; //排序
                arr = this.findIndexAlarm(arr,sorted,"人脸报警");
                arr = this.findIndexAlarm(arr,sorted,"车辆报警");
                arr = this.findIndexAlarm(arr,sorted,"信息报警");
                this.setState({
                    alarmLst:arr,
                });
            }
        });
    }

    onHeaderRefresh = () => {
        this.setState({
            isRefreshing:false,
        });
    }

    userPress =  async (page) => {
        const { navigate } = this.props.navigation;
        navigate(page);
    }

    convertAlarmColor = (type) => {
        let color = "#D0021B";
        if(type == "人脸报警"){
            color = "#D0021B";
        }else if(type == "车辆报警"){
            color = "#FE7C03";
        }else if(type == "信息报警"){
            color = "#F8E71C";
        }
        return color;
    }

    findmoduleIndex = (itemCode) => {
        let index = this.props.User.moduleList.findIndex(moduleCode => {
            return moduleCode == itemCode;
        });
        return index;
    }

    jumpAlarm = (item) => {
        let page = ""; //1-车辆报警 2-人脸报警 3-手机报警 
        if(item.alarmTypeId == "1"){
            page = "CarAlarm";
        }else if(item.alarmTypeId == "2"){
            page = "FaceAlarm";
        }else if(item.alarmTypeId == "3"){
            page = "InfoAlarm";
        }
        this.props.navigation.navigate(page);
    }

    render(){
        let filterArr = [];
        itemArr.map(item => {
            let index = this.findmoduleIndex(item.moduCode);
            if(index != -1){
                filterArr.push(item);
            }
        });
        return (
            <ScrollView style={GlobalStyles.pageBg} refreshControl={
                <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onHeaderRefresh()}
                    tintColor={Color.basicColor}
                    title="加载中..."
                    titleColor={Color.basicColor}
                    colors={[Color.basicColor, Color.basicColor, Color.basicColor]}
                    progressBackgroundColor={Color.whiteColor}
                />
            }>

                <View style={[GlobalStyles.headerBg,{position:"relative",marginBottom:20,paddingTop:20}]}>
                    <View style={[styles.contentContainer,GlobalStyles.flexDirectRow,GlobalStyles.center]}>
                            <Image source={require("../../../assets/images/police_badge.png")} style={styles.contentImage}/>

                            <View style={[GlobalStyles.flex]}>
                            {
                                this.props.User.userPosi == "0" ? 
                                <Text style={[GlobalStyles.font14White,GlobalStyles.mb5]}>民警：{this.props.User.userNameChn}</Text> 
                                :
                                <View>
                                    <Text style={[GlobalStyles.font14White,GlobalStyles.mb5]}>辅警：{this.props.User.userNameChn}</Text>
                                    <Text style={[GlobalStyles.font14White,GlobalStyles.mb5]}>隶属民警：{this.props.User.superName}</Text>
                                </View>
                            }
                                <Text style={[GlobalStyles.font14White,GlobalStyles.mb5]}>警务责任区：{this.props.User.orgName}</Text>
                            </View>
                    </View>

                    <View style={styles.leftTriangleStyle}></View>
                    <View style={styles.rightTriangleStyle}></View>
                </View>


                {
                    this.findmoduleIndex("QuickSearch") > -1  ? (
                        <View style={[GlobalStyles.containerBg,GlobalStyles.h50,GlobalStyles.justifyCenter,GlobalStyles.pdlr15]}>
                            <View style={[GlobalStyles.flexDirectRow,GlobalStyles.alignCenter,GlobalStyles.containerBg,
                            GlobalStyles.borderColor,
                                {borderWidth:1,borderRadius:3}]}>
                                <View style={[GlobalStyles.flexDirectRow,GlobalStyles.center,GlobalStyles.flex,GlobalStyles.pageBg1,
                                        styles.searchContainer]}>
                                    <FontAwesome name={"search"} size={12} color={"#8E8E93"} style={[GlobalStyles.mr10,GlobalStyles.ml10]} />
                                    <TextInput underlineColorAndroid={"transparent"} style={[GlobalStyles.flex,GlobalStyles.font14White,
                                            styles.textInput]}
                                            placeholder={"请输入关键字"} placeholderTextColor={Color.whiteColor}  
                                            maxLength={8}
                                            autoFocus={false} value={this.state.keyword}
                                            onFocus={() => this.userPress("QuickSearch") }
                                            onChangeText={(keyword) => this.setState({keyword})}
                                        />
                                </View>
                                <TouchableOpacity onPress={() => this.userPress("QuickSearch")}>
                                    <Text style={[GlobalStyles.font14White,GlobalStyles.homeSearchBorderLeftColor,
                                    {paddingLeft:10,paddingRight:10,borderLeftWidth:1}]}>警务快搜</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) :null
                }

                <View style={[GlobalStyles.mb20,GlobalStyles.mt30,{flexDirection: 'row', flexWrap: 'wrap'}]}>
                        
                        {
                            filterArr.map((item,index) => {
                                return (
                                    <HomeTextImage style={[styles.width4]} title={item.title} color={item.color} 
                                        isImage={item.isImage} key={`${item.moduCode}-${index}`}
                                        name={item.name} iconOutSize={item.iconOutSize}
                                        height={item.height} iconSize={item.iconSize} onPress={() => this.userPress(item.page)}></HomeTextImage>
                                );
                            })
                        }
                </View>

                {
                    this.findmoduleIndex("TodayAlarm") > -1 ?  (
                        <View >
                            <SpacingView />
                            <View style={GlobalStyles.pdlr15}>
                                <View style={[GlobalStyles.flexDirectRow,GlobalStyles.alignCenter,GlobalStyles.justifyBetween]}>
                                    <Text style={[GlobalStyles.font15Gray,GlobalStyles.mt10,GlobalStyles.mb10]}>今日报警</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AlarmList')}>
                                        <Text style={[GlobalStyles.font12White]}>更多></Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    {
                                        this.state.alarmLst.map( (item,index) => {
                                            let color = this.convertAlarmColor(item.alarmType);
                                            return (
                                                <TouchableOpacity style={[styles.policeItem,GlobalStyles.flexDirectRow,GlobalStyles.center,GlobalStyles.containerBg]} 
                                                    key={`alram-${index}`} onPress={() => this.jumpAlarm(item)}>
                                                    <FontAwesome name={"warning"} color={color} size={13}  style={GlobalStyles.mr5}/>
                                                    <Text style={[GlobalStyles.font14White,GlobalStyles.flex]} ellipsizeMode='tail' numberOfLines={1}
                                                        >{index+1}.{item.alarmType}：{item.alarmTime}</Text>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </View>
                            
                            </View>
                        </View>
                        ) : null
                }

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    searchStyle:{
        marginTop:10,
        marginBottom:20,
        marginLeft:15,
        marginRight:15,
    },
    contentContainer:{
        height:100,
        borderRadius:8,
        backgroundColor:Color.tabAndOtherBgColor,
        shadowColor:Color.blackColor,
        shadowOffset:{width: 0,height:3},
        shadowOpacity:0.2,
        shadowRadius:10,
        elevation: 1,
        marginLeft:15,
        marginRight:15,
    },
    contentImage:{
        width:56,
        height:56,
        marginLeft:28,
        marginRight:20,
    },
    leftTriangleStyle:{
        position:"absolute",
        bottom:-10,
        left:0,
        width: 0,
        height: 0,
        borderTopWidth: 30, 
        borderTopColor: 'transparent',
        borderRightWidth:60,
        borderRightColor: 'transparent',
        borderLeftWidth: 60,
        borderLeftColor: Color.basicColor,
        borderBottomWidth:30,
        borderBottomColor: 'transparent',
    },
    rightTriangleStyle:{
        position:"absolute",
        bottom:-10,
        right:0,
        width: 0,
        height: 0,
        borderTopWidth: 30, 
        borderTopColor: 'transparent',
        borderRightWidth:60,
        borderRightColor: Color.basicColor,
        borderLeftWidth: 60,
        borderLeftColor: 'transparent',
        borderBottomWidth:30,
        borderBottomColor: 'transparent',
    },
    policeItem:{
        height:40,
        paddingLeft:10,
        paddingRight:20,
        borderRadius:3,
        shadowColor:Color.blackColor,
        shadowOffset:{width: 0,height:0},
        shadowOpacity:0.15,
        shadowRadius:4,
        elevation: 2,
        marginBottom:10,
    },
    width4:{
        width:width/4,
        marginBottom:20,
    },
    searchContainer:{
        borderRadius: 3,
        height:36,
    },
    textInput:{
        padding:0,
        margin:0,
    },

});