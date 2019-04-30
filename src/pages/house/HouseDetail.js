import React, { Component } from 'react';
import {
    StyleSheet,FlatList,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import API from "../../api/index";
import {groupBy} from "../../utils/Utils";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getUserId} from "../../utils/Common";
import {copyData} from "../../utils/Utils";
import Toast, {DURATION} from 'react-native-easy-toast';
import Color from "../../config/color";
import {observer,inject} from 'mobx-react';

let ownerTitleArr =[ 
    {
        title:"姓名",
        value:"roomerName",
    },
    {
        title:"性别",
        value:"sex",
    },
    {
        title:"重点类型",
        value:"peopleType",
    },
    {
        title:"住户类型",
        value:"roomusertype",
    },]
let ownerTitleArrOther = [
    {
        title:"民族",
        value:"nation",
    },
    {
        title:"是否外籍",
        value:"isForeign",
    },
    {
        title:"身份证号码",
        value:"cardNumber",
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
        title:"登记时间",
        value:"createTime",
    },
    {
        title:"户籍地址",
        value:"housePlace",
    }];

let rentTitleArr =  copyData(ownerTitleArrOther);
rentTitleArr.splice(10, 0, {
    title:"租住时间",
    value:"tenantTime",
});


@inject('User')
@observer
export default class HouseDetail extends Component{

    static navigationOptions = ({navigation,screenProps}) => ({
        headerTitle: ( <Text style={[GlobalStyles.font20White,GlobalStyles.taCenter,{flex: 1}]}>
                {navigation.getParam('houseName', '')}详情</Text>),
        headerRight: (
            <TouchableOpacity onPress={navigation.getParam('submitCheck')}>
                <Text style={[GlobalStyles.font14White,{padding:15}]}>核查</Text>
            </TouchableOpacity>
        ),
    });

    constructor(props) {
        super(props);
        this.houseId = this.props.navigation.getParam('houseId', '');
        this.state = {
            data:[],
            showOtherInfoSwitch:{},
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({ submitCheck: this.submitCheck });
        getUserId().then(_userId => {
            this.userId = _userId;
            this.fetchData();
        });
    }

    submitCheck = () => {
        if(this.state.data.length == 0){
            this.refs.toast.show("空置房屋无法核查");
            return;
        }
        let obj = {};
        this.state.data.forEach(item => {
           if(item.type == 1){ //业主
             if(item.data.length > 0){
                let ownerObj = item.data[0];
                obj = {
                    areaName:ownerObj.areaName,
                    buildingName:ownerObj.buildingName,
                    callPhone:ownerObj.callPhone,
                    roomerName:ownerObj.roomerName,
                    areaId:ownerObj.areaId,
                }
             }
           }else{
               if(item.data.length > 0){
                    let otherObj = item.data[0].data;
                    obj.areaId = otherObj.areaId;
                    obj.areaName = otherObj.areaName;
                    obj.buildingName = otherObj.buildingName;
               }
           } 
        });
        obj.roomId = this.houseId;
        console.info("submitCheck",obj);
        this.props.navigation.navigate("HouseCheck",{params:obj});
    }

    fetchData = () => {
       let url =  API.getHousePersonDetail;
       fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'areaKey': this.props.User.areaKey
                // 'Authorization': this.props.User.token
            },
            body:JSON.stringify({init: 0,
                pageNum: 1,
                pageSize: 10,
                queryPair: {
                    // userId: "001",
                    userId:this.userId,
                    roomId:this.houseId,
                    // roomId:"7441518",
                }})
        })
        .then(response => response.json())
        .then(responseData => {
            console.info("getHouseUnitInfo",responseData);
            if (responseData.data  && responseData.data.list && responseData.data.list.length > 0) {
                let arr = this.convertTreeData(responseData.data.list);
                this.setState({
                    data: arr,
                });
            }
        }).catch( err => {
            console.error(err);
        });
    }

    convertTreeData = (list) => {
        /* 多个业主
         数据格式：[
             {
                index:0,title:"业主",type:1,data:[
                    {
                        callPhone: "138****4077"
                        cardNumber: "362203****11090453"
                        housePlace: "江西省南昌市经济技术开发区枫林西大街56号西一区3栋2单元201室"
                        identyPhoto: "http://doordustorage.oss-cn-shenzhen.aliyuncs.com/doordu_admin/other/20181001/bf1bc177d8d43d6af7a1538377613701.png"
                        imgUrl: "http://doordustorage.oss-cn-shenzhen.aliyuncs.com/doordu_admin/other/20181001/d241b419fb34349b44c1538377636223.jpg"
                        nation: "汉"
                        peopleType: ""
                        roomerName: "叶*昌"
                        roomusertype: "业主"
                        tenantEndTime: "2021-09-30"
                        tenantStartTime: "2018-10-01"
                    }
                ]
             },{
                 index:1,title:"租客",type:0,data:[
                    title:"租客1",name:"张三",expanded:false,data:{
                        callPhone: "157****0638"
                        cardNumber: "362202****05193585"
                        housePlace: "江西省丰城市泉港镇稂洲村大园组５７号"
                        identyPhoto: "http://doordustorage.oss-cn-shenzhen.aliyuncs.com/doordu_admin/other/20180820/efc531deea34c00bb091534726025808.png"
                        imgUrl: "http://doordustorage.oss-cn-shenzhen.aliyuncs.com/doordu_admin/other/20180820/5b0e68f5e1c454fb2cb1534726039197.jpg"
                        nation: "汉"
                        peopleType: ""
                        roomerName: "龚*美"
                        roomusertype: "临时客人"
                        tenantEndTime: "2019-08-20"
                        tenantStartTime: "2018-08-20"
                    }
                 ]
             }
         ]
        */
        let arr = [];
        if(list.length > 0){
            let sorted = groupBy(list, function (item) {
                return [item.roomusertype];
            });
            console.info("convertTreeData convertTreeData",sorted);
            sorted.forEach((plist,index) => {
                if(plist.length > 0 ){
                    arr.push({
                        index:index,
                        title:plist[0].roomusertype,
                        data:[],
                    });
                    if(plist[0].roomusertype == "业主"){
                        arr[index].type = 1;
                        arr[index].data = plist;
                    }else{
                        if(plist[0].roomusertype == "租客"){
                            arr[index].type = 0;
                        }else{
                            arr[index].type = 2;
                        }
                        plist.forEach((p,i) => {
                            arr[index].data.push({
                                title:`${p.roomusertype}${i+1}`,
                                name:p.roomerName,
                                expanded:false,
                                data:p
                            });
                        });
                    }
                }
            });
        }
        console.info("HouseDetail convertTreeData arr ",arr);
        return arr;
    }

    _renderSectionHeader = ({item,index}) => {
        return (
            <View>
                <View style={[styles.sectionStyle,GlobalStyles.containerBg,GlobalStyles.pdlr15,GlobalStyles.justifyCenter]}>
                    <Text style={GlobalStyles.font12Gray}>{item.title}</Text>
                </View>
                <View>
                    {
                        item.type == 1 ? item.data.map((p,i) => {
                            return this.renderPersonInfo(p,item.type);
                        }) : item.data.map((p,i) => {
                            return this.renderSubExpandItem(p,i,item, index);
                        })
                    }
                </View>
            </View>
        );
    }

    renderSubExpandItem = (secondItem,secondIndex,firstItem,firstIndex) =>{
        console.log("secondItem:"+JSON.stringify(secondItem))
        console.log("secondItem.identyPhoto:"+secondItem.identyPhoto)

        return (<View key={`${secondItem.title}-${secondIndex}`}>
            <TouchableOpacity style={[GlobalStyles.flexDirectRow,GlobalStyles.center,GlobalStyles.pageBg1,
                    GlobalStyles.lineBottom,styles.subItemStyle,GlobalStyles.pdlr15,GlobalStyles.lineBottom]}
                onPress={() => this.headerPress(secondItem,secondIndex,firstItem, firstIndex)}>
                <Text style={[GlobalStyles.flex,GlobalStyles.font14Gray]}>{secondItem.title}</Text>

                {secondItem.data.identyPhoto ? <Image source={{uri:secondItem.data.identyPhoto,cache:true}} style={styles.titleImgStyle}/>
                    : <Image source={require("../../../assets/images/idcard_default.png")} style={styles.titleImgStyle}/> }

                <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5,{width:50}]}>{secondItem.name}</Text>
                <FontAwesome name={secondItem.expanded?"angle-down":"angle-right"} color={Color.whiteColor} size={20} />
            </TouchableOpacity>
            {
                secondItem.expanded ? this.renderPersonInfo(secondItem.data,firstItem.type) : null
            }
            </View>)
    }

    renderPersonInfo = (item,type) => {
        //显示更多信息的开关
        let key = item.cardNumber;
        let showOtherInfoSwitch = this.state.showOtherInfoSwitch;
        return (
            <View style={[styles.itemContainer,GlobalStyles.containerBg]} key={`person-${item.cardNumber}`}>
                <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10]}>
                   {item.identyPhoto ? <Image source={{uri:item.identyPhoto,cache:true}} style={styles.imgStyle}/>
                    : <Image source={require("../../../assets/images/idcard_default.png")} style={styles.imgStyle}/> }
                    {item.imgUrl ? <Image source={{uri:item.imgUrl,cache:true}} style={[styles.imgStyle,{marginLeft:40}]}/>
                    : <Image source={require("../../../assets/images/image_default.png")} style={[styles.imgStyle,{marginLeft:40}]}/> }
                </View>
                <View>
                    { this.renderPersonItem(item,type) }
                    { showOtherInfoSwitch[key]?this.renderPersonOtherItem(item,type):null}
                    <TouchableOpacity style={GlobalStyles.center} onPress={()=>this.onPressShowOtherInfo(item)}>
                        <FontAwesome name={showOtherInfoSwitch[key]?"angle-up":"angle-down"} color={"#ccc"} size={22} style={GlobalStyles.ml5} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onPressShowOtherInfo = (item) => {
        //使用用户身份证作为开关
        let key = item.cardNumber
        let showOtherInfoSwitch = this.state.showOtherInfoSwitch;
        showOtherInfoSwitch[key] = ! showOtherInfoSwitch[key];
        this.setState({
            showOtherInfoSwitch:showOtherInfoSwitch
        })
    }

    renderPersonItem = (item,type) => {
        // console.info("renderPersonItem",item,type);
        return (
            ownerTitleArr.map((obj,i) => {
                if((obj.title == "重点类型" && item[obj.value]) || obj.title != "重点类型"  ){
                    let valueColor = GlobalStyles.font14Gray,starImg = null;
                    if(obj.title == "重点类型"){
                        valueColor = GlobalStyles.font14Red;
                    }else if(obj.title == "姓名" && item.peopleType) {
                        starImg = (<Image source={require("../../../assets/images/five_star.png")} style={styles.fiveStartStyle} />);
                    }
                    return (
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]} key={`item-${i}`}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>{obj.title}：</Text>
                            <Text style={[valueColor,GlobalStyles.flex,GlobalStyles.justifyCenter]}>
                                {item[obj.value]}{starImg}
                            </Text>
                        </View>
                    );
                }else{
                    return null;
                }
            })
        );
    }

    renderPersonOtherItem = (item,type) => {
        let arr = type > 0  ?  ownerTitleArrOther : rentTitleArr ; //type 1业主，家人 0租客
        return (
            arr.map((obj,i) => {
                    return (
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]} key={`item-${i}`}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>{obj.title}：</Text>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex,GlobalStyles.justifyCenter]}>
                                {item[obj.value]}
                            </Text>
                        </View>
                    );

            })
        );
    }

    headerPress = (secondItem,secondIndex,firstItem,firstIndex) =>{
        // console.info("headerPress",secondItem,secondIndex,firstItem,firstIndex);
        //ListView有点特殊，必须修改datasource才会更新
        let list = [...this.state.data];
        list[firstIndex].data.map((item,ind)=>{
            if(ind == secondIndex){
                item.expanded = !item.expanded;
            }else{
                item.expanded = false;
            }
        });
        this.setState({
            data:list
        });
    }

    _renderEmptyComponent = () => {
        return (
            <View style={[GlobalStyles.center,GlobalStyles.mt40]}>
                <Text style={[GlobalStyles.font14Gray]}>无数据</Text>
            </View>
        );
    }
    
    render(){
        return (
            <View style={GlobalStyles.pageBg}>
                <FlatList
                    ListEmptyComponent = {this._renderEmptyComponent}
                    renderItem={this._renderSectionHeader}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={(item,index) => `person-${index}`}
                />
                 <Toast ref="toast" position={"center"} />
            </View>
        );
    }


}

const styles = StyleSheet.create({
    sectionStyle:{
        height:40,
    },
    subItemStyle:{
        height:50,
    },
    itemContainer:{
        borderRadius:8,
        elevation:2,
        margin:15,
        marginBottom:24,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:15,
        paddingBottom:15,
    },
    titleImgStyle:{
        width:40,
        height:40,
        borderRadius:40,
        marginRight:10,
    },
    imgStyle:{
        width:106,
        height:123,
        borderRadius:4,
    },
    fiveStartStyle:{
        width:15,
        height:15,
        marginLeft:5,
    }
});