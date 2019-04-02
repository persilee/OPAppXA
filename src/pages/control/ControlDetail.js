import React, { Component } from 'react';
import {
    StyleSheet,WebView,ScrollView,DeviceEventEmitter,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import API from '../../api/index';
import {width,getUserId} from "../../utils/Common";
import CommonFetch from "../../componets/CommonFetch";
import {observer,inject} from 'mobx-react/native';
// import {MapView} from 'react-native-amap3d';
let titleArr = [{
    title:"身高",
    value:"height",
},{
    title:"外貌特征",
    value:"appeFeat",
},{
    title:"身份证号码",
    value:"cardNumber",
},{
    title:"暂住地址",
    value:"areaAddr",
},{
    title:"布控时间",
    value:"conlDate",
}];

@inject('User')
@observer
export default class ControlDetail extends Component{

    constructor(props){
        super(props);
        this.params =  this.props.navigation.getParam("params");
        this.state = {
            data:{},
            readStatus:this.props.navigation.getParam("readStatus"),
        }
    }

    componentDidMount(){
        getUserId().then(_userId => {
            this.userId = _userId;
            this.getControlDetail();
            //只有待处理任务才更新状态
            if(this.state.readStatus == "0"){
                this.updateStatus();
            }
        });
    }

    updateStatus = () => {
        let params = {
            "taskId": this.params.taskId,
            "userId":this.userId,
            // userId:"001",
            "readStatus": "1",//0 未读 1 已读
        };
        console.info("updateControlDetailStatus",params,API.updateControlDetailStatus);

        CommonFetch.doPut(
            API.updateControlDetailStatus,
            params,
            (responseData)=>{
                console.info("updateControlDetailStatus",responseData);
                DeviceEventEmitter.emit("reloadControllList");
            },null,this.props.User.token);
    }

    getControlDetail = () =>{
        let params={init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                taskId:this.params.taskId,
        }};
        console.info("ControlDetail params",params);
        CommonFetch.doFetch(
            API.getControlDetail,
            params,
            (responseData)=>{
                console.info("ControlDetail",responseData);
                if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                    let data = responseData.data.list;
                    this.setState({
                        data:data[0],
                    });
                }
            });
    }


    renderPersonItem = () => {
        return (
            <View>
            {
                titleArr.map((item,index) =>{
                    return (
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]} key={`item-${index}`}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>{item.title}：</Text>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex,GlobalStyles.justifyCenter]}>{this.state.data[item.value]}</Text>
                        </View>
                    );
                })
            }
            </View>
        );
    }

    render(){
        console.info("render",this.state);
        // let mapUrl = `http://work.meishutech.com/test/map.html?lng=116.397428&lat=39.90923`;
        let mapUrl = `http://work.meishutech.com/test/map.html?lng=${this.state.data.lon}&lat=${this.state.data.lat}`;
        return (
            <ScrollView style={GlobalStyles.pageBg1}>
                <View style={[styles.sectionStyle,GlobalStyles.containerBg,GlobalStyles.pdlr15,GlobalStyles.justifyCenter]}>
                    <Text style={GlobalStyles.font14White}>人员信息</Text>
                </View>

                <View style={[styles.itemContainer,GlobalStyles.containerBg]} >
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10,GlobalStyles.center]}>
                        {
                            this.state.data.identyPhoto ? <Image source={{uri:this.state.data.identyPhoto,cache:true}} style={[styles.imgStyle]}/> 
                            :<Image source={require("../../../assets/images/idcard_default.png")} style={[styles.imgStyle]}/> 
                        }
                         
                         <View style={GlobalStyles.flex}>
                             <Text style={[GlobalStyles.font14Gray,GlobalStyles.mb5]}>姓名：{this.state.data.name}</Text>
                             <Text style={[GlobalStyles.font14Gray,GlobalStyles.mb5]}>民族：{this.state.data.nation}</Text>
                             <Text style={[GlobalStyles.font14Gray,GlobalStyles.mb5]}>前科类型：{this.state.data.peopleType}</Text>
                         </View>
                    </View>
                    <View>
                        { this.renderPersonItem() }
                    </View>
                </View>
                
                {
                    this.state.readStatus == "0" ?
                    <View>
                        <View style={[styles.sectionStyle,GlobalStyles.containerBg,GlobalStyles.pdlr15,GlobalStyles.justifyCenter]}>
                            <Text style={GlobalStyles.font14White}>布控人员定位</Text>
                        </View>

                        <WebView source={{uri: mapUrl}} 
                            javaScriptEnabled={true} 
                            style={styles.mapContainer} />
                    </View>
                    :null
                }
                
            </ScrollView>
        );
    }
}



const styles = StyleSheet.create({
    sectionStyle:{
        height:48,
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
    imgStyle:{
        width:106,
        height:123,
        borderRadius:4,
        marginRight:15,
    },
    mapContainer:{
        width:(width-30),
        height:200,
        marginLeft:15,
        marginRight:15,
        marginTop:10,
        marginBottom:20,
    }
});