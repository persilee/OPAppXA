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
import LongInput from "../../componets/LongInput";
import {formatDate} from  '../../utils/Utils';
import Toast, {DURATION} from 'react-native-easy-toast';
import CommonFetch from "../../componets/CommonFetch";
import RoutApi from '../../api/index';
import Color from "../../config/color";
import {observer,inject} from 'mobx-react';
import CommonBtn from  '../../componets/CommonBtn';

var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;

@inject('CheckData')
@inject('User')
@observer
export default class  DealTask extends Component {


    constructor(props) {
        super(props);
        let taskId = this.props.navigation.getParam('taskId','')

        this.state = {
            
            expandHouseInfo:true,
            expandOwnerInfo:true,
            expandPersonInfo:true,

            longInputTitle:'',
            longInputShow:false,
            longInputValue:'',
            longInputKey:'',
            statusVisible:false,
            
            taskId:taskId,
        }
    }

    componentWillMount(){
        this.getTaskDetail();
        this.getNationList();
        this.getCountryList();
        this.getPeopleTypeList();
    }

    /**
    *获取房屋信息和业主信息
    */
    getTaskDetail = () => {
        let params={init: 0,
               pageNum: 1,
               pageSize: 10,
               queryPair: {
                   taskId: this.state.taskId
               }};

        CommonFetch.doFetch(
            RoutApi.getCheckTaskDetail,
            params,
            (responseData)=>{
                console.log('getTaskDetail',responseData);
                if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                    this.props.CheckData.updateData(responseData.data.list[0]);
                    this.getTaskPersonList()
                }
            },
            this.refs.toast)
    }

    /**
    *获取住户信息
    */
    getTaskPersonList = () => {
        let params={init: 0,
               pageNum: 1,
               pageSize: 10,
               queryPair: {
                   roomId: this.props.CheckData.data.roomId
               }};

        CommonFetch.doFetch(
            RoutApi.getCheckTaskPersonList,
            params,
            (responseData)=>{
                responseData.data.list.map((item,index)=>{
                    item.isDelete=false;
                })
                this.props.CheckData.setPerson(responseData.data.list);
            },
            this.refs.toast)
    }

    getNationList = () =>{
        let params={init: 0,
               pageNum: 1,
               pageSize: 1000,
               queryPair: {
                   type: 'NATION_TYPE'
               }};

        CommonFetch.doFetch(
            RoutApi.getDictList,
            params,
            (responseData)=>{
                console.log('getNationList',responseData);
                this.props.CheckData.setNationList(responseData.data.list);
            },
            this.refs.toast)
    }

    getCountryList = () =>{
        let params={init: 0,
               pageNum: 1,
               pageSize: 1000,
               queryPair: {
                   type: 'COUNTRY_TYPE'
               }};

        CommonFetch.doFetch(
            RoutApi.getDictList,
            params,
            (responseData)=>{
                console.log('getCountryList',responseData);
                this.props.CheckData.setCountryList(responseData.data.list);
            },
            this.refs.toast)
    }

    getPeopleTypeList = () =>{
        let params={init: 0,
               pageNum: 1,
               pageSize: 1000,
               queryPair: {
                   type: 'HOTTYPE'
               }};

        CommonFetch.doFetch(
            RoutApi.getDictList,
            params,
            (responseData)=>{
                console.log('getPeopleTypeList',responseData);
                this.props.CheckData.setPeopleTypeList(responseData.data.list);
            },
            this.refs.toast)
    }

    goHousePhoto=()=>{
        this.props.navigation.navigate('DealTaskPhoto',{type:'house'})
    }

    goHouseMasterPhoto=()=>{
        this.props.navigation.navigate('DealTaskPhoto',{type:'houseMaster'})
    }

    goHouseMasterCard=()=>{
        this.props.navigation.navigate('DealTaskCard',{type:'houseMaster'})
    }



    houseDetail=()=>{
        return(
            <View style={GlobalStyles.pageBg1}>
                <ItemInput name={'小区名称'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} 
                    textValue={this.props.CheckData.data.areaName} ></ItemInput>
                <ItemInput name={'楼宇单元'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} textValue={this.props.CheckData.data.buildingName} ></ItemInput>
                <ItemInput name={'照片采集'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} textValue={'采集'} arrowVisible={true} pressFunc={this.goHousePhoto}></ItemInput>
            </View>
        )
    }


    ownerDetail=()=>{
        return(
            <View style={GlobalStyles.pageBg1}>
                <ItemInput name={'姓名'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  rightStyle={{width:220,flexDirection: 'row',justifyContent: 'flex-end' }} textValue={this.props.CheckData.data.houseMater} 
                    onChangeText={(houseMater) => this.inputChange('houseMater',houseMater)}></ItemInput>
                <ItemInput name={'身份证号'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} rightStyle={{width:220,flexDirection: 'row',justifyContent: 'flex-end'}} textValue={this.props.CheckData.data.houseMasterId} 
                    onChangeText={(houseMasterId) => this.inputChange('houseMasterId',houseMasterId)}></ItemInput>
                <ItemInput name={'户籍地址'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} rightStyle={{width:220,flexDirection: 'row',justifyContent: 'flex-end'}} textValue={this.props.CheckData.data.housePlace}  
                    ellipsizeMode={'head'} numberOfLines={1} pressFunc={()=>this.openLongInput('户籍地址','housePlace')}></ItemInput>
                <ItemInput name={'联系电话'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} rightStyle={{width:220,flexDirection: 'row',justifyContent: 'flex-end'}} textValue={this.props.CheckData.data.houseMasterPhone} 
                    onChangeText={(houseMasterPhone) => this.inputChange('houseMasterPhone',houseMasterPhone)}></ItemInput>
                <ItemInput name={'身份证照片'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={'采集'} 
                    arrowVisible={true} pressFunc={this.goHouseMasterCard}></ItemInput>
                <ItemInput name={'采集照片'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={'采集'} 
                    arrowVisible={true} pressFunc={this.goHouseMasterPhoto}></ItemInput>
            </View>
        )
    }

    inputChange=(key,value)=>{
        this.props.CheckData.updateByKey(key,value);
    }

    openLongInput=(titel,key)=>{
        console.log('openLongInput');
        this.setState({
            longInputTitle:titel,
            longInputShow:true,
            longInputValue:this.props.CheckData.data[key],
            longInputKey:key,
        })
    }
    

    longInputChange=(data)=>{
        this.inputChange(this.state.longInputKey,data)
    }

    longInputClose=()=>{
        this.setState({
            longInputShow:false
        })
    }

    deletePerson=(index)=>{
        this.props.CheckData.removePerson(index)
    }


    personList=()=>{
        return(
            <View style={styles.personList}>
                {this.props.CheckData.personData.map((item,index)=>{
                    return item.isDelete?null:(
                        <TouchableOpacity key={index} style={[styles.personView,GlobalStyles.containerBg]} 
                                onPress={()=>this.goPerson(index)}>
                            {item.identyPhoto?(<Image source={{uri:item.identyPhoto}} style={styles.personCardImage} resizeMode={'stretch'}></Image>):
                            (<Image source={require("../../../assets/images/idcard_default.png")} style={styles.personCardImage}></Image>)}
                            
                            <View style={styles.personNameView}>
                                <View style={styles.personName}>
                                    <Text style={GlobalStyles.font12Gray}>{item.roomerName}</Text>
                                    {item.peopleType?((<Image style={{height:13,width:13,marginLeft: 4}} source={require("../../../assets/images/star.png")}></Image>)):null}
                                </View>
                                <TouchableOpacity style={styles.personDelIcon} onPress={()=>{this.deletePerson(index)}}>
                                     <FontAwesome name={'trash-o'} color={Color.whiteColor} size={14} />
                                </TouchableOpacity>
                            </View>

                        </TouchableOpacity>
                    )
                })}

                <TouchableOpacity style={[styles.addPersonView,GlobalStyles.containerBg]} onPress={()=>this.goPerson(-1)}>
                    <Text style={GlobalStyles.font50White}>+</Text>
                </TouchableOpacity>

            </View>


        )
    }

    goPerson=(index)=>{
        this.props.navigation.navigate('DealTaskPerson',{personIndex:index});
    }


    statusSelect=(flag)=>{
        this.setState({
            statusVisible:flag
        })
    }

    statusChange=(status)=>{
        this.setState({
            statusVisible:false,
        })
        this.props.CheckData.updateByKey('feedResult',status)
    }

    submit=()=>{
        let personList = [];
        this.props.CheckData.personData.map((item,index)=>{
            let roomuserType = '1';
            if(item.userType == '家人'){
                roomuserType = '2';
            }
            if(item.userType == '租客'){
                roomuserType = '3';
            }
            if(item.userType == '临时客人'){
                roomuserType = '4';
            }
            personList.push({
                roomuserName:item.roomerName,
                nation:item.nation,
                roomuserType:roomuserType,
                peopleType:item.peopleType,
                contTel:item.phone,
                idcardNum:item.cardNumber,
                resiAddr:item.housePlace,
                tenantStartDttm:item.startTime,
                tenantEndDttm:item.endTime,
                idcardUrl:item.identyPhoto,
                idcardFrontUrl:item.identyPhoto1,
                idcardBackUrl:item.identyPhoto2,
                imgUrl:item.imgUrl,
                isDelete:item.isDelete,
            })
        })

        // personList.push({
        //     roomuserName:this.props.CheckData.data.houseMater,
        //     nation:'',
        //     roomuserType:'0',
        //     userTel:this.props.CheckData.data.houseMasterPhone,
        //     idcardNum:this.props.CheckData.data.houseMasterId,
        //     resiAddr:this.props.CheckData.data.housePlace,
        //     idcardUrl:this.props.CheckData.data.identyPhoto,
        //     idcardUrl1:this.props.CheckData.data.identyPhoto1,
        //     idcardUrl2:this.props.CheckData.data.identyPhoto2,
        //     imgUrl:this.props.CheckData.data.imgUrl,
        // })

        let houseInfo = {
            checkUserId:'001',
            taskId:this.state.taskId,
            imgUrl1:this.props.CheckData.data.imgUrl1,
            imgUrl2:this.props.CheckData.data.imgUrl2,
            imgUrl3:this.props.CheckData.data.imgUrl3,
            imgUrl4:this.props.CheckData.data.imgUrl4,
            isNormal:this.props.CheckData.data.feedResult=='正常',
            feedInf:this.props.CheckData.data.feedInf,
        }


        let params={
            personList:personList,
            taskRoomcheck:houseInfo
        };

        console.log(JSON.stringify(params))

        CommonFetch.doPut(
            RoutApi.saveCheckTask,
            params,
            (responseData)=>{
                DeviceEventEmitter.emit('reloadCheckList',"登录成功");
                this.props.navigation.navigate('DealTaskResult',
                { 
                    unitName:this.props.CheckData.data.areaName+this.props.CheckData.data.buildingName,
                    type:"check"
                });
            },
            this.refs.toast,
            this.props.User.token)

        
    }





    render() {
        console.log('render',this.props.CheckData.personData);

        return (
            <ScrollView style={GlobalStyles.pageBg}>
                
                <ItemInput name={'任务类型'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} textValue={this.props.CheckData.data.roomCheckType} ></ItemInput>

                <TouchableOpacity style={[styles.title,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} 
                    onPress={()=>{this.setState({expandHouseInfo:!this.state.expandHouseInfo})}}>
                    <Text style={GlobalStyles.font12White}>房屋信息</Text>
                    <FontAwesome name={this.state.expandHouseInfo?"angle-down":"angle-right"} color={Color.whiteColor} size={14} />
                </TouchableOpacity>
                {this.state.expandHouseInfo?this.houseDetail():null}

                <TouchableOpacity style={[styles.title,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} onPress={()=>{this.setState({expandOwnerInfo:!this.state.expandOwnerInfo})}}>
                    <Text style={GlobalStyles.font12White}>业主信息</Text>
                    <FontAwesome name={this.state.expandOwnerInfo?"angle-down":"angle-right"} color={Color.whiteColor} size={14} />
                </TouchableOpacity>
                {this.state.expandOwnerInfo?this.ownerDetail():null}

                <TouchableOpacity style={[styles.title,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} onPress={()=>{this.setState({expandPersonInfo:!this.state.expandPersonInfo})}}>
                    <Text style={GlobalStyles.font12White}>住户信息</Text>
                    <FontAwesome name={this.state.expandPersonInfo?"angle-down":"angle-right"} color={Color.whiteColor} size={14} />
                </TouchableOpacity>
                {this.state.expandPersonInfo?this.personList():null}

                <View style={[styles.title,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom,GlobalStyles.mt15]}>
                    <Text style={GlobalStyles.font12White}>反馈信息</Text>
                    <View></View>
                </View>
                <ItemInput name={'反馈详情'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={this.props.CheckData.data.feedInf}  
                    ellipsizeMode={'head'} numberOfLines={1} pressFunc={()=>this.openLongInput('反馈详情','feedInf')}></ItemInput>
                <ItemInput name={'反馈结果'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={this.props.CheckData.data.feedResult} 
                    arrowVisible={true} pressFunc={()=>{this.statusSelect(true)}}></ItemInput>

                <CommonBtn text={'提交'} onPress={this.submit} style={[GlobalStyles.mt30,GlobalStyles.mb20,GlobalStyles.pdlr15]} 
                        containerStyle = {styles.submitBtn}></CommonBtn>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.statusVisible}
                    onRequestClose={ () => this.statusSelect(false)}>
                    <View style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]}>
                        <View style={[styles.modalStyle,GlobalStyles.containerBg]}>
                            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} onPress={() => this.statusChange('正常')}>
                                <Text style={[GlobalStyles.font15White]}>正常</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} onPress={() => this.statusChange('异常')}>
                                <Text style={[GlobalStyles.font15White]}>异常</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                <LongInput 
                    show={this.state.longInputShow} 
                    title={this.state.longInputTitle}
                    value={this.state.longInputValue}
                    onChangeText={this.longInputChange}
                    close={this.longInputClose}/>

                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>

            </ScrollView>
        );
    }

   
}

const  styles = StyleSheet.create({
    modalStyle:{
        width:280,
        borderRadius: 8,
    },
    personList:{
        flexDirection: 'row' ,
        flexWrap: 'wrap' ,
        alignItems:  'center',
        paddingLeft: 22,
    },
    personView:{
        height:(ScreenWidth-70)/3/106*143,
        width: (ScreenWidth-70)/3,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Color.blackAlpha50Color,
        marginRight: 15,
        marginTop: 20,
    },

    addPersonView:{
        height:(ScreenWidth-70)/3/106*143,
        width: (ScreenWidth-70)/3,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Color.blackAlpha50Color,
        marginRight: 22,
        marginTop: 20,
        flexDirection: 'row',
        alignItems:  'center',
        justifyContent:  'center',
    },
    personCardImage:{
        height:(ScreenWidth-70)/3/106*143-20,
        width: (ScreenWidth-70)/3,
    },

    personNameView:{
        height:20,
        flexDirection: 'row',
    },

    personName:{
        width:86,
        flexDirection: 'row',
        alignItems:  'center',
        justifyContent:  'center',
    },

    personDelIcon:{
        flexDirection: 'row',
        alignItems:  'center',
        justifyContent:  'center',
    },
    title:{
        height:38,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-between' ,
        alignItems: 'center',
    },
    submitBtn:{
        borderRadius:8,
    },
});