import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image,DeviceEventEmitter
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import ScrollableTabView, {DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast';
import CommonFetch from "../../componets/CommonFetch";
import RoutApi from '../../api/index';
import {observer,inject} from 'mobx-react';
import Color from "../../config/color";

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;



@inject('User')
@observer
export default class  CheckListWait extends Component {


    constructor(props) {
        super(props);

        this.state = {
            waitData:[],
            

            modalVisible:false,
            modalView:null,
            clickIndex:0,
            waitPageNo:1,
            waitTotalNum:-1,
        
        }
    }

    componentDidMount(){
        this.getWaitList();
        this.reload = DeviceEventEmitter.addListener('reloadCheckList',(msg) => {
            this.setState({
                clickIndex:0,
                waitData:[],
                waitPageNo:1,
                waitTotalNum:-1,
            },this.getWaitList)
        });
    }

    componentWillUnmount(){
        this.reload && this.reload.remove();
        this.closeModal();
    }


    getWaitList = () => {

        if(this.state.waitTotalNum == -1 || this.state.waitTotalNum > (this.state.waitPageNo-1)*10){
            
            this.state.waitPageNo = this.state.waitPageNo+1;

            let params={init: 0,
                   pageNum: this.state.waitPageNo-1,
                   pageSize: 10,
                   queryPair: {
                       userId: this.props.User.userId,
                       taskType:'1'
                   }};

            console.info("getWaitCheckList params",params);

            CommonFetch.doFetch(
                RoutApi.getWaitCheckList,
                params,
                (responseData)=>{
                    let data =  this.state.waitData.concat(responseData.data.list?responseData.data.list:[]);
                    
                    this.setState({
                        waitData:data,
                        waitTotalNum:responseData.data.total,
                        searchFlag:false,
                    })
                },
                this.refs.toast)

            
        }
    }



    taskPress =(index,item)=>{
        console.log(item)
        this.setState({
            clickIndex:index,
            modalVisible:true
        })
    }

    closeModal=()=>{
        this.setState({
            modalVisible:false
        })
    }

    goDealTask=()=>{
        this.closeModal();

        let params={taskId:this.state.waitData[this.state.clickIndex].taskId,
                    userId:this.props.User.userId,
                    readStatus:'1'};

        CommonFetch.doPut(
            RoutApi.taskperson,
            params,
            (responseData)=>{
            },
            null,this.props.User.token);
            
            this.props.navigation.navigate('WaitCheck',{taskId:this.state.waitData[this.state.clickIndex].taskId});
    }

    _renderItem = ({item,index})=>{


        let rightStyle = {
            backgroundColor: '#FF4618',
            borderRadius: 3
        }

        let rightFont = {
            paddingTop:2,
            fontSize: 11,
            marginRight: 4,
            marginLeft: 4,
            color:Color.whiteColor
        }

        switch(item.taskStatusId){
            case('1'):
                rightStyle.backgroundColor= '#FF4618';
                break;
            case('2'):
                rightStyle.backgroundColor= '#F5A623';
                item.taskStatus='处理中';
                break;
            case('3'):
                rightStyle.backgroundColor= Color.whiteColor;
                rightFont.color= '#333';
                rightFont.fontSize=13;
        }
        return (
            <TouchableOpacity key={index} style={[styles.item,GlobalStyles.lineBottom]} onPress={()=>{this.taskPress(index,item)}}>
                 <ItemInput name={item.taskName} textType={"text"}  textValue={item.taskStatus} 
                 leftStyle={[GlobalStyles.font14Gray,styles.leftStyle]}
                 rightStyle={rightStyle}
                 rightFontStyle={rightFont}
                 arrowVisible={true}></ItemInput>
            </TouchableOpacity>
        )
    }

    _renderEmptyComponent = () => {
        return (
            <View style={[GlobalStyles.center,GlobalStyles.mt40]}>
                <Text style={[GlobalStyles.font14Gray]}>无数据</Text>
            </View>
        );
    }

    


    render() {

        return (


            <View style={GlobalStyles.pageBg} tabLabel='待核查任务'>

                <FlatList
                    ListEmptyComponent = {this._renderEmptyComponent}
                    keyExtractor={(item, index) => index+''}
                    data={this.state.waitData}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.getWaitList}>

                </FlatList>
            
                    

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
                                    <Text style={[GlobalStyles.font15White]} numberOfLines={2}>该任务有{this.state.waitData.length!=0?this.state.waitData[this.state.clickIndex].allUserName.split(',').length:0}人接受分别是 
                                        <Text style={GlobalStyles.font15White} numberOfLines={2}>{this.state.waitData.length!=0?this.state.waitData[this.state.clickIndex].allUserName:''}</Text>
                                    </Text>
                                    
                                </View>
                                <View style={{marginTop: 10}}>
                                    <Text style={[GlobalStyles.font15White]}>目前
                                       <Text style={GlobalStyles.font15Red}> {this.state.waitData.length!=0?this.state.waitData[this.state.clickIndex].userName:''} </Text> 
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

                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>
            </View>
        );
    }

   
}

const  styles = StyleSheet.create({


    listView:{
        flexDirection:  'column' ,
        justifyContent: 'flex-start' ,

    },

    item:{
        paddingLeft: 19,
        paddingRight: 16
    },

    subItem:{

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

    dealPersonNum:{
        color:'red',
        fontSize: 15,
    },

    modalButtonView:{
        height:48
    },

});