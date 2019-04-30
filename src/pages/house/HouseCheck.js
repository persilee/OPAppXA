import React, { Component } from 'react';
import {
    StyleSheet,Modal,FlatList,
    View,
    Text,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import CommonBtn from  '../../componets/CommonBtn';
import API from '../../api/index';
import {getUserId} from "../../utils/Common";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {formatDate} from  '../../utils/Utils';
import ItemInput from '../../componets/ItemInput';
import CommonFetch from "../../componets/CommonFetch";
import Toast, {DURATION} from 'react-native-easy-toast';
import {observer,inject} from 'mobx-react';

@inject('User')
@observer
export default class HouseDetail extends Component{
    constructor(props) {
        super(props);
        this.ownerInfo =  this.props.navigation.getParam('params', '');
        this.submitLoading = false;
        this.state = {
            ownerInfo:{
                callPhone:this.ownerInfo.callPhone,
                roomerName:this.ownerInfo.roomerName,
            },
            roomcheckType:"7人以上群租房信息登记", //核查类型
            roomcheckTypeCode:1, //核查类型code
            endTime:"",
            checkUserId:"", //核查人ID
            checkUserName:"",//核查人名字
            ccUserId:"",//抄送人
            ccUserName:"",//抄送人
            taskPlanDt:"",//任务预计完成时间
            checkTypeVisible:false,
            dateVisible:false,
            dateType:"",
            checkTypeVisible:false,
            peopleVisible:false,
            peopleData:[],
            checkType:"",
        }

        getUserId().then(_userId => {
            this.userId = _userId;
        });
    }

    componentDidMount(){
        this.getHouseOWnerInfo();
        this.getPoliceList();
    }

    getHouseOWnerInfo = () => {
        let params={init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                roomId:this.ownerInfo.roomId,
        }};
        console.info("getHouseCheckOwnerInfo params",params);
        CommonFetch.doFetch(
            API.getHouseCheckOwnerInfo,
            params,
            (responseData)=>{
                console.info("getHouseCheckOwnerInfo",responseData);
                if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                     let data = responseData.data.list[0];
                     let ownerInfo = {
                        callPhone:data.masterPhone,
                        roomerName:data.masterName,
                     };
                    this.setState({
                        ownerInfo:ownerInfo,
                    });
                }
            });
    }

    getPoliceList = () =>{
        let params={init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                // areaId:"5206",
                areaId:this.ownerInfo.areaId,
        }};
        console.info("getPoliceList params",params);
        CommonFetch.doFetch(
            API.getHouseCheckPoliceList,
            params,
            (responseData)=>{
                console.info("getPoliceList",responseData);
                if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                    let data = responseData.data.list;
                    this.setState({
                        peopleData:data,
                    });
                }
            },null,(msg)=>{
                this.refs.toast.show(msg);
            },(msg) => {
                this.refs.toast.show(msg);
            });
    }

    submitValid = () => {
        if(!this.state.checkUserId){
            this.refs.toast.show("请选择核查人");
            return false;
        }
        if(!this.state.ccUserId){
            this.refs.toast.show("请选择抄送人");
            return false;
        }
        if(this.state.checkUserId == this.state.ccUserId){
            this.refs.toast.show("核查人和抄送人不能为同一个人");
            return false;
        }
        if(!this.state.taskPlanDt){
            this.refs.toast.show("请选择任务截止时间");
            return false;
        }
        return true;
    }

    submit = () =>{
        if(!this.submitValid())return;
        if(this.submitLoading) return;
        this.submitLoading = true;
        let url = API.addHouseCheck;
        // let url = "http://192.168.1.25:8096/appserver/roomtask/add";
        let params = {
            taskRoomcheck:{
                "roomcheckType": this.state.roomcheckTypeCode,
                "checkUserId": this.state.checkUserId,
                "roomId":this.ownerInfo.roomId,
            },
            task:{
                taskName: `${this.ownerInfo.areaName}${this.ownerInfo.buildingName}${this.state.roomcheckType}`,
                taskPlanDt:this.state.taskPlanDt,
                "taskStatus": "1",
                "taskType": "1",
                "createId":this.userId,
            },
            taskPersonList:[
                {
                    "readStatus": "0",
                    "userId": this.state.checkUserId,
                    "userType": "1",//人员类型：1 核查人 2 抄送人
                },{
                    
                    "readStatus": "0",
                    "userId": this.state.ccUserId,
                    "userType": "2",
                }
            ]
        }
        console.info("addHouseCheck params",JSON.stringify(params));

        fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.props.User.token
            },
            body:JSON.stringify(params)
        })
            .then(response => response.json())
            .then(responseData => {
                this.submitLoading = false;
                console.info("addHouseCheck",responseData);
                if (responseData.code == 0) {
                    this.refs.toast.show("提交成功");
                    DeviceEventEmitter.emit("reloadCheckList");
                    this.props.navigation.navigate("Check");
                }else{
                    this.refs.toast.show("提交失败");
                }
            }).catch( err => {
                this.submitLoading = false;
                console.log(err);
                this.refs.toast.show(err.message ? err.message :"提交失败");
        });
            
        // CommonFetch.doFetch(url,params,(responseData) =>{
        //     console.info("addHouseCheck",responseData);
        //     if(responseData.code == 0){
        //         this.refs.toast.show("提交成功");
        //         this.props.navigation.navigate("Check");
        //     }else{
        //         this.refs.toast.show("提交失败");
        //     }
        // });
    }

    dateSelect = (flag,type) => {
        this.setState({
            dateVisible:flag,
            dateType:type
        });
    }

    confirmDate = (date) => {
        let dateStr = formatDate(new Date(date),"yyyy-MM-dd");
        this.setState({
            [this.state.dateType]:dateStr
        });
        this.dateSelect(false);
    }

    checkTypeSelect = (flag)  =>{
        this.setState({
            checkTypeVisible:flag,
        });
    }

    checkTypeChange = (type) =>{
        let personTypeStr= '';
        switch(type){
            case(1):
                personTypeStr='7人以上群租房信息登记';
                break;
            case(2):
                personTypeStr='重点关注人员信息登记';
                break;
        }
        this.setState({
            roomcheckTypeCode:type,
            roomcheckType:personTypeStr
        });
        this.checkTypeSelect(false);
    }

    peopleSelect = (flag,checkType) =>{
        this.setState({
            peopleVisible:flag,
            checkType:checkType,
        });
    }

    peopleTypeChange = (item,index) =>{
        if(this.state.checkType == "checkUserName"){
            this.setState({
                checkUserId:item.userId,
                checkUserName:item.userNameChn,
            });
        }else if(this.state.checkType == "ccUserName"){
            this.setState({
                ccUserId:item.userId,//抄送人
                ccUserName:item.userNameChn,//抄送人
            });
        }
        this.peopleSelect(false);
    }
    
    _renderPeopleItem = ({item,index}) =>{
        return (
            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} 
                    onPress={() => this.peopleTypeChange(item,index)}>
                <Text style={[GlobalStyles.font15White]}>{item.userNameChn}({item.userName})</Text>
            </TouchableOpacity>
        );
    }

    render(){
        return (
            <View style={GlobalStyles.pageBg}>
                <ItemInput name={'核查类型'} textType={"text"}  style={[GlobalStyles.lineBottom,styles.item]} 
                     textValue={this.state.roomcheckType} 
                    arrowVisible={true} pressFunc={()=>{this.checkTypeSelect(true)}} ></ItemInput>
                
                <ItemInput name={'小区名称'} textType={"text"}  style={[GlobalStyles.lineBottom,styles.item]} 
                    textValue={this.ownerInfo.areaName}></ItemInput>

                <ItemInput name={'楼宇单元'} textType={"text"}  style={[GlobalStyles.lineBottom,styles.item]} 
                     textValue={this.ownerInfo.buildingName}></ItemInput>

                <ItemInput name={'业主姓名'} textType={"text"}  style={[GlobalStyles.lineBottom,styles.item]} 
                    textValue={this.state.ownerInfo.roomerName} ></ItemInput>

                <ItemInput name={'业主手机号码'} textType={"text"} style={[GlobalStyles.lineBottom,styles.item]} 
                    textValue={this.state.ownerInfo.callPhone} ></ItemInput>

                {/* <ItemInput name={'房屋入住人数'} textType={"text"}  style={styles.item} textValue={this.state.type} 
                   arrowVisible={true} pressFunc={()=>{this.checkTypeSelect(true)}} ></ItemInput> */}

                <ItemInput name={'指定选择主核查人'} textType={"text"}  style={[GlobalStyles.lineBottom,styles.item]}  textValue={this.state.checkUserName} 
                    arrowVisible={true} pressFunc={()=>{ this.peopleSelect(true,"checkUserName")}} ></ItemInput>

                <ItemInput name={'抄送人'} textType={"text"}  style={[GlobalStyles.lineBottom,styles.item]}  textValue={this.state.ccUserName} 
                    arrowVisible={true} pressFunc={()=>{ this.peopleSelect(true,"ccUserName")}} ></ItemInput>

                {/* <ItemInput name={'任务生成时间'} textType={"text"}  style={styles.item} textValue={this.state.checkDttm} 
                    arrowVisible={true} pressFunc={() => this.dateSelect(true,"checkDttm")} ></ItemInput> */}

                <ItemInput name={'任务截止时间'} textType={"text"}  style={[GlobalStyles.lineBottom,styles.item]}  textValue={this.state.taskPlanDt} 
                    arrowVisible={true} pressFunc={() => this.dateSelect(true,"taskPlanDt")} ></ItemInput>

                <CommonBtn text={'提交'} onPress={this.submit} 
                    style={[GlobalStyles.mt40,GlobalStyles.pdlr15]} 
                    containerStyle = {styles.submitBtn}></CommonBtn>       

                <DateTimePicker
                    isVisible={this.state.dateVisible}
                    onConfirm={this.confirmDate}
                    onCancel={() => this.dateSelect(false)}
                    cancelTextIOS={"取消"} confirmTextIOS={"确定"} 
                    titleIOS={"请选择日期"} 
                    datePickerModeAndroid={"spinner"}
                    minimumDate={new Date()}
                />

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.checkTypeVisible}
                    onRequestClose={ () => this.checkTypeSelect(false)}>
                    <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]}
                            onPress={() => this.checkTypeSelect(false)}>
                        <View style={[styles.modalStyle,GlobalStyles.containerBg]}>
                            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} 
                                onPress={() => this.checkTypeChange(1)}>
                                <Text style={[GlobalStyles.font15White]}>群租房核查</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} 
                                onPress={() => this.checkTypeChange(2)}>
                                <Text style={[GlobalStyles.font15White]}>重点人员房核查</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.peopleVisible}
                    onRequestClose={ () => this.peopleSelect(false)}>
                    <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]}
                         onPress={() => this.peopleSelect(false)}>
                        <View style={[styles.modalStyle,GlobalStyles.containerBg,{height: '50%'}]}>
                            <FlatList
                                keyExtractor={(item, index) => `people-${index}`}
                                data={this.state.peopleData}
                                renderItem={this._renderPeopleItem}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Toast ref="toast" position={"center"} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    item:{
        paddingLeft: 15,
        paddingRight: 15,
    },
    submitBtn:{
        borderRadius:8,
    },
    modalStyle:{
        width:'70%',
        borderRadius: 8,
    }
});