import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Shadow from "../../componets/Shadow";
import CommonFetch from "../../componets/CommonFetch";
import RoutApi from '../../api/index';
import Color from "../../config/color";

export default class  CheckList extends Component {


    constructor(props) {
        super(props);

        let taskId = this.props.navigation.getParam('taskId','')
        let roomCheckId = this.props.navigation.getParam('roomCheckId','')
        this.state = {
            data:{},
            personData:[],
            expandHouseInfo:true,
            expandOwnerInfo:true,
            expandPersonInfo:true,
            taskId:taskId,
            roomCheckId:roomCheckId,
        }
    }


    componentWillMount(){
        this.getTaskDetail();
        this.getTaskPersonList();
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
                console.log('responseData',responseData)
                this.setState({
                    data:responseData.data.list[0]
                })
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
                   roomCheckId: this.state.roomCheckId
               }};

        CommonFetch.doFetch(
            RoutApi.getCheckTaskResultPersonList,
            params,
            (responseData)=>{
                this.setState({
                    personData:responseData.data.list
                })
            },
            this.refs.toast)
    }

    goPhoto=()=>{
        let photoList=[];
        if(this.state.data.imgUrl1){
            photoList.push(this.state.data.imgUrl1)
        }
        if(this.state.data.imgUrl2){
            photoList.push(this.state.data.imgUrl2)
        }
        if(this.state.data.imgUrl3){
            photoList.push(this.state.data.imgUrl3)
        }
        if(this.state.data.imgUrl4){
            photoList.push(this.state.data.imgUrl4)
        }

        this.props.navigation.navigate('CheckResultPhoto',{photoList:photoList})
    }


    houseDetail=()=>{
        return(
            <View>
                <ItemInput name={'小区名称'} textType={"text"}  style={[styles.item,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={this.state.data.areaName} ></ItemInput>
                <ItemInput name={'楼宇单元'} textType={"text"}  style={[styles.item,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={this.state.data.buildingName} ></ItemInput>
                <ItemInput name={'采集照片'} textType={"text"}  style={[styles.item,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={'点击查看'} arrowVisible={true} 
                    pressFunc={this.goPhoto}></ItemInput>
            </View>
        )
    }


    ownerDetail=()=>{
        return(
            <View style={styles.ownerView}>
                <View style={[styles.shadow,GlobalStyles.containerBg]}>

                    <View style={styles.imageView}>
                        {this.state.data.identyPhoto?
                            (<Image source={{uri:this.state.data.identyPhoto}} style={[styles.image,{marginRight: 30}]}></Image>):
                            (<Image source={require("../../../assets/images/idcard_default.png")} style={[styles.image,{marginRight: 30}]}></Image>)
                        }
                        {this.state.data.imgUrl?
                            (<Image source={{uri:this.state.data.imgUrl}} style={styles.image}></Image>):
                            (<Image source={require("../../../assets/images/image_default.png")} style={[styles.image]}></Image>)
                        }
                    </View>

                    <View style={styles.detailView}>
                       {this.detailText('姓名',this.state.data.houseMater)}
                       {this.detailText('联系电话',this.state.data.houseMasterPhone)}
                       {this.detailText('身份证号',this.state.data.houseMasterId)}
                       {this.detailText('户籍地址',this.state.data.housePlace)}
                    </View>
                </View>
            </View>
        )
    }

    detailText = (key,value)=>{
        return(
            <View style={styles.detailTextView}>
                <Text style={[styles.detailKey,GlobalStyles.font13Gray]}>{key}:</Text>
                <Text numberOfLines={3} style={[styles.detailValue,GlobalStyles.font13Gray]}>{value}</Text>
            </View>
        )
    }


    personList=()=>{
        return(
            this.state.personData.map((item,index)=>{
                let userType = '';
                switch(item.userType){
                    case('0'):
                        userType='业主';
                        break;
                    case('1'):
                        userType='业主';
                        break;
                    case('2'):
                        userType='家人';
                        break;
                    case('3'):
                        userType='租客';
                        break;
                    case('4'):
                        userType='临时客人';
                        break;
                }
                return (
                    <View key={index}>
                        <TouchableOpacity style={[styles.personList,GlobalStyles.lineBottom]} onPress={()=>{this.pressPerson(index)}}>
                            <Text style={[styles.personInfo,GlobalStyles.font14Gray]}>{userType}</Text>
                            <View style={styles.personRightView}>
                                
                                <Text style={[styles.personInfo,GlobalStyles.font14Gray]}>{item.roomerName}</Text>
                                {item.peopleType&&(<Image style={{height:13,width:13,marginLeft: 2,marginRight:3}} source={require("../../../assets/images/star.png")}></Image>)}
                                <FontAwesome name={item.expand?"angle-down":"angle-right"} color={Color.whiteColor} size={14} />
                            </View>
                        </TouchableOpacity>

                        {item.expand?this.personDetail(item):null}
                    </View>
                )
            })
        )
    }

    pressPerson=(index)=>{
        let personData = this.state.personData;
        personData[index].expand = !personData[index].expand;
        this.setState({
            personData:personData
        })
    }


    personDetail=(detail)=>{
        let userType = '';
        switch(detail.userType){
            case('0'):
                userType='业主';
                break;
            case('1'):
                userType='业主';
                break;
            case('2'):
                userType='家人';
                break;
            case('3'):
                userType='租客';
                break;
            case('4'):
                userType='临时客人';
                break;
        }
        return (
            <View style={styles.ownerView}>
                <View style={[styles.shadow,GlobalStyles.containerBg]}>

                    <View style={styles.imageView}>
                        {detail.identyPhoto?
                            (<Image source={{uri:detail.identyPhoto}} style={[styles.image,{marginRight: 30}]}></Image>):
                            (<Image source={require("../../../assets/images/idcard_default.png")} style={[styles.image,{marginRight: 30}]}></Image>)
                        }
                        {detail.imgUrl?
                            (<Image source={{uri:detail.imgUrl}} style={styles.image}></Image>):
                            (<Image source={require("../../../assets/images/image_default.png")} style={[styles.image]}></Image>)
                        }
                    </View>

                    <View style={styles.detailView}>
                        <View style={styles.detailTextView}>
                           
                            <Text style={[styles.detailKey,GlobalStyles.font13Gray]}>姓名:</Text>
                            <Text style={GlobalStyles.font13Gray}>{detail.roomerName}</Text>
                            {detail.peopleType&&(<Image style={{height:13,width:13,marginLeft: 4,marginTop: 2}} source={require("../../../assets/images/star.png")}></Image>)}
                        </View>
                       {this.detailText('民族',detail.nation)}
                       {this.detailText('住户类型',userType)}
                       {detail.peopleType&&(
                            <View style={styles.detailTextView}>
                                <Text style={[styles.detailKey,GlobalStyles.font13Gray]}>重点类型:</Text>
                                <Text numberOfLines={3} style={[styles.detailValue,GlobalStyles.font14Red]}>{detail.peopleType}</Text>
                            </View>
                        )}
                       {this.detailText('联系电话',detail.phone)}
                       {this.detailText('身份证号',detail.cardNumber)}
                       {this.detailText('户籍地址',detail.housePlace)}
                       {detail.userType=='3'&&this.detailText('租住时间',(detail.startTime?detail.startTime:'----------')+"至"+(detail.endTime?detail.endTime:'----------'))}

                    </View>
                </View>
            </View>
        )
    }




    render() {

        return (
            <ScrollView style={GlobalStyles.pageBg}>
                {this.state.data.taskStatus != 1 ? (<ItemInput name={'处理人'} textType={"text"}  style={[styles.item,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={this.state.data.checker} ></ItemInput>):null}
                <ItemInput name={'任务类型'} textType={"text"}  style={[styles.item,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={this.state.data.roomCheckType} ></ItemInput>
                <TouchableOpacity style={[styles.title,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} onPress={()=>{this.setState({expandHouseInfo:!this.state.expandHouseInfo})}}>
                    <Text style={[GlobalStyles.font12White]}>房屋信息</Text>
                    <FontAwesome name={this.state.expandHouseInfo?"angle-down":"angle-right"} color={Color.whiteColor}
                         size={14} />
                </TouchableOpacity>
                {this.state.expandHouseInfo?this.houseDetail():null}

                <TouchableOpacity style={[styles.title,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} onPress={()=>{this.setState({expandOwnerInfo:!this.state.expandOwnerInfo})}}>
                    <Text style={[GlobalStyles.font12White]}>业主信息</Text>
                    <FontAwesome name={this.state.expandOwnerInfo?"angle-down":"angle-right"} color={Color.whiteColor} size={14} />
                </TouchableOpacity>
                {this.state.expandOwnerInfo?this.ownerDetail():null}

                <TouchableOpacity style={[styles.title,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} onPress={()=>{this.setState({expandPersonInfo:!this.state.expandPersonInfo})}}>
                    <Text style={[GlobalStyles.font12White]}>住户信息</Text>
                    <FontAwesome name={this.state.expandPersonInfo?"angle-down":"angle-right"} color={Color.whiteColor} size={14} />
                </TouchableOpacity>
                {this.state.expandPersonInfo?this.personList():null}


            </ScrollView>
        );
    }

   
}

const  styles = StyleSheet.create({
    title:{
        height:38,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-between' ,
        alignItems: 'center',
    },

    item:{
        paddingLeft: 15,
        paddingRight: 15,
    },

    ownerView:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center' ,
        marginTop: 10,
        marginBottom: 10
    },

    shadow:{
        borderRadius: 8,
        borderWidth: 1,
        elevation: 4,
        borderColor: Color.blackAlpha50Color,
        flexDirection:  'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    imageView:{
        flex:1,
        paddingTop: 10,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:  'center',
    },

    detailView:{
        marginTop: 5,
        padding:10,
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"flex-start",
    },

    detailTextView:{
        marginTop: 8,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"flex-start",
    },

    image:{
        width: 130,
        height:160,
        borderRadius: 4
    },

    detailKey:{
        width:65
    },

    detailValue:{
        width:220
    },

    personList:{
        height: 50,
        paddingLeft: 18,
        paddingRight: 13,
        flexDirection: 'row',
        justifyContent:  'space-between',
        alignItems:  'center' 
    },

    personInfo:{
        marginRight: 5
    },

    personRightView:{
        flexDirection: 'row' ,
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});