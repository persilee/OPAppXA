import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,DeviceEventEmitter
} from 'react-native';

import CommonFetch from "../../componets/CommonFetch";
import Toast from 'react-native-easy-toast';
import RoutApi from '../../api/index';
import ItemInput from '../../componets/ItemInput';
import {observer, inject} from 'mobx-react';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Color from "../../config/color";

@inject('User')
@observer
export default class WaitDisputeList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            modalVisible:false,
            clickIndex:0,
            type:this.props.type
        }
        this.pageNo = 1;
        this.totalNum = -1;
    }

    componentDidMount(){
        this.getWaitList();
        this.reload = DeviceEventEmitter.addListener('reloadDisputeList',(msg) => {
            this.setState({
                data:[],
                modalVisible:false,
                clickIndex:0,
                type:this.props.type
            },this.getWaitList)
        });

    }

    componentWillUnmount(){
        this.reload && this.reload.remove();
    }

    getWaitList = () => {
        if(this.totalNum == -1 || this.totalNum > this.state.pageNo*10){
            let params={init: 0,
                pageNum: this.pageNo,
                pageSize: 10,
                queryPair: {
                    taskType:3,
                    userId: this.props.User.userInfo.userId
                }};

            let url = '';

            if(this.state.type=='wait'){
                url = RoutApi.getWaitDisputeList;
            }else{
                url = RoutApi.getSuccessDisputeList;
            }

            CommonFetch.doFetch(
                url,
                params,
                (responseData)=>{
                    let data =  this.state.data.concat(responseData.data.list?responseData.data.list:[]);
                    console.info(JSON.stringify(data))
                    this.setState({
                        data:data,
                        waitTotalNum:responseData.data.total,
                        searchFlag:false,
                    })
                },
                this.refs.toast)

            // this.state.waitPageNo = this.state.waitPageNo+1;
        }
    }

    _renderItem = ({item,index})=>{
        let rightStyle = {
//            backgroundColor: '#FF4618',
            borderRadius: 3
        }

        let rightFont = {
            paddingTop:2,
            fontSize: 11,
            marginRight: 4,
            marginLeft: 4,
            color: Color.whiteColor
        }

        switch(item.taskStatusId){
            case('1'):
                rightStyle.backgroundColor= '#FF4618';
                break;
            case('2'):
                rightStyle.backgroundColor= '#F5A623';
                break;
            case('3'):
                rightStyle.backgroundColor= Color.whiteColor;
                rightFont.color= Color.whiteColor;
                rightFont.fontSize=13;
        }
        return (
            <TouchableOpacity key={index} style={[styles.item,GlobalStyles.pageBg1,GlobalStyles.lineBottom]} 
                onPress={()=>{this.taskPress(index,item)}}>
                <ItemInput name={item.taskName} textType={"text"}  textValue={item.taskStatus}
                           leftStyle={[styles.leftStyle,GlobalStyles.font14Gray]}
                           rightStyle={rightStyle}
                           rightFontStyle={rightFont}
                           arrowVisible={true}></ItemInput>
            </TouchableOpacity>
        )
    }

    taskPress =(index,item)=>{
        if(this.state.type=='wait'){
            console.log(item)
            this.setState({
                clickIndex:index,
                modalVisible:true
            })
        }else{
            // this.goDealTask()
            this.props.navigation.navigate('DisputeTaskDetail',{
                taskId:this.state.data[index].taskId,
                procId:this.state.data[index].procId,
                taskDisputeId:this.state.data[index].taskDisputeId,
            });
        }


    }

    closeModal=()=>{
        console.log('closeModal')
        this.setState({
            modalVisible:false
        })
    }

    goDealTask=()=>{
        this.closeModal();
        let params={taskId:this.state.data[this.state.clickIndex].taskId,
            userId:this.props.User.userId,
            readStatus:'1'};
        console.log(JSON.stringify(params))
        CommonFetch.doPut(
            RoutApi.taskperson,
            params,
            (responseData)=>{
            },
            null,this.props.User.token);

        this.props.navigation.navigate('WaitDispute',{taskId:this.state.data[this.state.clickIndex].taskId});
    }


    render() {

        return (
            <View style={GlobalStyles.pageBg} tabLabel={this.state.type=='wait'?'待处理纠纷':'已处理纠纷'}>
                <FlatList
                    keyExtractor={(item, index) => index+''}
                    data={this.state.data}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.2}
                    //onEndReached={this.getWaitList}
                    >
                </FlatList>

                {
                    this.state.type=='wait' ?(
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={this.closeModal}
                        >
                            <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]} onPress={this.closeModal}>
                                <View style={[styles.modal,GlobalStyles.containerBg]}>
                                    <View style={[GlobalStyles.center,styles.modalInfoView,GlobalStyles.lineBlackBottom]}>
                                        <View>
                                            <Text style={GlobalStyles.font15White} numberOfLines={2}>该任务有{this.state.data.length!=0?this.state.data[this.state.clickIndex].allUserName.split(',').length:0}人接受分别是
                                                <Text style={GlobalStyles.font14White} numberOfLines={2}>{this.state.data.length!=0?this.state.data[this.state.clickIndex].allUserName:''}</Text>
                                            </Text>

                                        </View>
                                        <View style={{marginTop: 10}}>
                                            <Text style={GlobalStyles.font15White}>目前
                                                <Text style={GlobalStyles.font14Red}> {this.state.data.length!=0?this.state.data[this.state.clickIndex].userName:''} </Text>
                                                正在处理
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={[GlobalStyles.center,styles.modalButtonView]} onPress={this.goDealTask}>
                                        <Text style={GlobalStyles.font14White}>立即查看</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    ):(<View/>)

                }

                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>
            </View>
        );
    }
}

const  styles = StyleSheet.create({

    item:{
        borderBottomWidth: 1 ,
        paddingLeft: 19,
        paddingRight: 16
    },
    leftStyle:{
        width:240,
    },
    modal:{
        height: 156,
        width:324,
        borderRadius: 5,
        flexDirection: 'column',
    },
    modalInfoView:{
        height:108,
        paddingLeft: 20,
        paddingRight: 20
    },

    modalButtonView:{
        height:48
    },


});