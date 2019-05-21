import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image,DeviceEventEmitter
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Shadow from "../../componets/Shadow";
import Toast, {DURATION} from 'react-native-easy-toast';
import CommonFetch from "../../componets/CommonFetch";
import RoutApi from '../../api/index';
import {observer,inject} from 'mobx-react/native'
import CommonBtn from  '../../componets/CommonBtn';

@inject('User')
@observer
export default class  WaitCheck extends Component {


    constructor(props) {
        super(props);
        let taskId = this.props.navigation.getParam('taskId','')
        console.log('taskId',taskId)

        this.state = {
            data:{},
            taskId:taskId,    
        }
    }

    componentWillMount(){
        this.getTaskDetail();
    }

    getTaskDetail = () => {
        let params={init: 0,
               pageNum: 1,
               pageSize: 10,
               queryPair: {
                   taskId: this.state.taskId
               }};

        CommonFetch.doFetch(
            RoutApi.getCheckTaskInfo,
            params,
            (responseData)=>{
                console.log('responseData',responseData);
                if(responseData.data && responseData.data.list && responseData.data.list.length > 0 ){
                    this.setState({
                        data:responseData.data.list[0]
                    });
                }
            },
            this.refs.toast)
    }



    showHistory =()=>{
        console.log('showHistory')
    }

    doTask=()=>{

        let params={
            id:this.state.taskId,
            taskStatus:'2'
        };

        CommonFetch.doPut(
            RoutApi.dealCheckTask,
            params,
            (responseData)=>{
                console.log('responseData',responseData);
                this.props.navigation.navigate('DealTask',{taskId:this.state.taskId});
                DeviceEventEmitter.emit('reloadCheckList',"登录成功");
            },
            this.refs.toast,
            this.props.User.token)

    }





    render() {


        return (
            <ScrollView style={GlobalStyles.pageBg}>
                <ItemInput name={'任务类型'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.roomCheckType} ></ItemInput>
                <ItemInput name={'小区名称'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom,GlobalStyles.lineBottom]} textValue={this.state.data.areaName} ></ItemInput>
                <ItemInput name={'楼宇单元'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.buildingName} ></ItemInput>
                <ItemInput name={'登记人'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.createUserName} ></ItemInput>
                <ItemInput name={'历史核查记录'} textType={"text"} arrowVisible={true} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]}  
                    pressFunc={this.showHistory}></ItemInput>

                {this.state.data.userId==this.props.User.userInfo.userId?(
                    <CommonBtn text={'立即处理'} onPress={this.doTask} 
                        style={[GlobalStyles.mt30,GlobalStyles.pdlr15]} 
                        containerStyle = {styles.submitBtn}></CommonBtn>):null}

                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>

            </ScrollView>
        )
    }

   
}

const  styles = StyleSheet.create({
    submitBtn:{
        borderRadius:8,
    },
});