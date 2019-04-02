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
export default class  WaitDispute extends Component {

    constructor(props) {
        super(props);
        let taskId = this.props.navigation.getParam('taskId','')
        console.log('taskId',taskId)

        this.state = {
            data:{},
            taskId:taskId,
            showItems:[],
        }
    }

    componentWillMount(){
        this.getTaskDetail();
        this.getTaskHistory();
    }

    getTaskHistory = () =>{

        let params={init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                taskId: this.state.taskId
            }};

        CommonFetch.doFetch(
            RoutApi.disputeHistory,
            params,
            (responseData)=>{
                this.setState({
                    history:responseData.data.list
                })
                console.log("历史记录:"+JSON.stringify(responseData))
            },
            this.refs.toast)
    }

    getTaskDetail = () => {
        let params={init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                taskId: this.state.taskId
            }};

        CommonFetch.doFetch(
            RoutApi.getWaitDispute,
            params,
            (responseData)=>{
                console.log(JSON.stringify(responseData))
                if(responseData.data.list){
                    this.setState({
                        data:responseData.data.list[0]
                    })
                }

            },
            this.refs.toast)
    }



    _renderItem = ({item,index})=>{
        return (
            <View>
                <ItemInput name={'记录'+ (index + 1)} textType={"text"}
                           style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]}
                           arrowVisible={true}
                           pressFunc={()=>this.showHistory(index)}/>
                {
                    this.state.showItems[index] ? (
                        <View>
                            <ItemInput name={'处理人'} textType={"text"}
                                       style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                       leftStyle={GlobalStyles.font14Gray}
                                       textValue={item.userName}
                            />
                            <ItemInput name={'处理结果'} textType={"text"}
                                       style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                       leftStyle={GlobalStyles.font14Gray}
                                       textValue={item.result}
                            />
                        </View>

                    ) : (<View/>)

                }


            </View>

        )
    }

    showHistory =(index)=>{
        let showList = this.state.showItems;

        showList[index] = !showList[index]
        this.setState({
            showList
        })

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
                this.props.navigation.navigate('DisputeTask',{taskId:this.state.taskId});
                DeviceEventEmitter.emit('reloadCheckList',"登录成功");
            },
            this.refs.toast,
            this.props.User.token)

    }

    //纠纷照片
    goDisputePhoto = () => {
        this.props.navigation.navigate('DisputeTaskPhoto', {
            type: 'dispute',
            taskId: this.state.taskId,
            viewType:'view',
        })
    }


    render() {
        return (
            <ScrollView style={GlobalStyles.pageBg}>

                <ItemInput name={'案由类型'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.causeType} ></ItemInput>
                <ItemInput name={'案由描述'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom,GlobalStyles.lineBottom]} textValue={this.state.data.causeDesc} ></ItemInput>
                <ItemInput name={'发生时间'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.createDate} ></ItemInput>
                <ItemInput name={'涉事人姓名'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.persInvoName} ></ItemInput>
                <ItemInput name={'涉事人电话'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.persInvoTel} ></ItemInput>
                <ItemInput name={'登记人'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.userName} ></ItemInput>
                <ItemInput name={'案发地址'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]} textValue={this.state.data.caseAddr} ></ItemInput>
                {/*<ItemInput name={'照片采集'} textType={"text"} style={styles.item} textValue={'立即查看'}*/}
                           {/*arrowVisible={true} pressFunc={this.goDisputePhoto}*/}
                {/*/>*/}

                <ItemInput name={'历史处理记录'} textType={"text"}  
                    style={[GlobalStyles.pdlr15,GlobalStyles.pageBg1,styles.history,GlobalStyles.lineBottom]}
                    arrowVisible={true}
                     leftStyle={GlobalStyles.font12Gray}></ItemInput>

                <FlatList
                    keyExtractor={(item, index) => index+''}
                    extraData={this.state}
                    data={this.state.history}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.2}
                    //onEndReached={this.getWaitList}
                />

                {
                    this.state.data.userName==this.props.User.userInfo.userNameChn?(
                        <CommonBtn text={'处置反馈'} onPress={this.doTask} 
                            style={[GlobalStyles.mt30,GlobalStyles.pdlr15]} 
                            containerStyle = {styles.submitBtn}></CommonBtn>
                        ):null
                }


                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>

            </ScrollView>
        )
    }


}

const  styles = StyleSheet.create({
    history:{
        height:38,
    },
    submitBtn:{
        borderRadius:8
    }

});