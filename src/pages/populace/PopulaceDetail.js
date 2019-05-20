import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,Alert,FlatList,Image
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import CommonSearch from "../../componets/CommonSearch";
import CommonFetch from "../../componets/CommonFetch";
import Shadow from "../../componets/Shadow";
import RoutApi from '../../api/index';
import Toast, {DURATION} from 'react-native-easy-toast';
import CommonBtn from '../../componets/CommonBtn';
import {getUserId} from "../../utils/Common";
import { Toast as TeasetToast } from 'teaset';


export default class  PopulaceDetail extends Component {


    constructor(props) {
        super(props);

        let queryParam = this.props.navigation.getParam('queryParam', {});

        console.log('queryParam', queryParam);

        this.state = {
            data:{
                imgUrl: "",
                address: "",
                nation: "",
                createTime: "",
                isForeign: "",
                roomUserType: "",
                peopleType: null,
                roomerName: "",
                housePlace: "",
                identyPhoto: "",
                callPhone: "",
                cardNumber: ""
            },
            roomId:queryParam.roomId,
            cardNumber:queryParam.cardNumber
        }
    }


    componentWillMount(){

        getUserId().then(_userId => {
            this.userId = _userId;
            this.getList();
        });
        
    }

    getList = () => {
        let params={init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                // userId:'001',
                userId:this.userId,
                roomId:this.state.roomId,
                cardNumber:this.state.cardNumber
            }};

            CommonFetch.doFetch(RoutApi.getPopulaceDetail,params,this.dealResponseData,this.refs.toast)
    }

    dealResponseData=(responseData)=>{
        this.setState({
            data:responseData.data.list[0]
        })
    }




    detailText = (key,value)=>{
        return(
            <View style={styles.detailTextView} key={key}>
                <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>{key}:</Text>
                <Text numberOfLines={3} style={[GlobalStyles.font14Gray,styles.detailValue]}>{value}</Text>
            </View>
        )
    }

    updateRoomUser = (roomUserId) => {
        console.log('roomUserId',roomUserId);
        let params={
            // id: roomUserId
          };

        CommonFetch.doFetchExtends({api: `${RoutApi.updateRoomUser}?id=${roomUserId}`, params, callback: (responseData) => {
            console.log('updateRoomUser', responseData);
            Alert.alert('提示', '是否标记为已离开', [
				{ text: '否'},
				{ text: '是', onPress: () => { 
                    if(responseData.data == 0){
                        TeasetToast.smile('标记成功');
                    }else{
                        TeasetToast.fail('标记失败');
                    }
                 } },
			]);
        }, loading: false});
    }

    render() {
        return (
            <View style={[GlobalStyles.pageBg,styles.page]}>
                


                <View style={[GlobalStyles.containerBg,GlobalStyles.containerBorder,styles.detailView]}>
                    <View style={styles.imageView}>
                        {this.state.data.identyPhoto?
                            (<Image source={{uri:this.state.data.identyPhoto}} style={[styles.image,{marginRight: 30}]}></Image>):
                            (<Image source={require("../../../assets/images/idcard_default.png")} style={[styles.image,{marginRight: 30}]}></Image>)
                        }
                        {this.state.data.imgUrl?
                            (<Image source={{uri:this.state.data.imgUrl}} style={[styles.image]}></Image>):
                            (<Image source={require("../../../assets/images/image_default.png")} style={[styles.image]}></Image>)
                        }
                    </View>

                    <View style={styles.detailTextView}>
                        <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>姓名:</Text>
                        <Text numberOfLines={3} style={[GlobalStyles.font14Gray]} >{this.state.data.roomerName}</Text>
                        {this.state.data.peopleType?(<Image style={{height:15,width:15,marginLeft:10,marginTop:2}} source={require("../../../assets/images/star.png")}></Image>):null}
                    </View>
                    {this.state.data.peopleType&&(
                        <View style={styles.detailTextView}>
                            <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>重点类型:</Text>
                            <Text style={[GlobalStyles.font14Red]} numberOfLines={3} >{this.state.data.peopleType}</Text>
                        </View>
                    )}
                    {this.detailText('民族',this.state.data.nation)}
                    {this.detailText('住户类型',this.state.data.roomUserType)}
                    {this.detailText('是否外籍',this.state.data.isForeign)}
                    {this.detailText('身份证号',this.state.data.cardNumber)}
                    {this.detailText('联系电话',this.state.data.callPhone)}
                    {this.detailText('小区名称',this.state.data.areaName)}
                    {this.detailText('楼宇单元',this.state.data.buildingName)}
                    {this.detailText('登记时间',this.state.data.createTime)}
                    {this.detailText('户籍地址',this.state.data.housePlace)}
                    {this.state.data.roomUserType=='租客'&&this.detailText('租住时间',this.state.data.tenantTime)}
                    <CommonBtn text={'标记为已离开'} onPress={() => this.updateRoomUser(this.state.roomId)} style={{ marginTop: 10, width: 126, alignSelf: 'flex-end' }} ></CommonBtn>
                </View>
            </View>
        );
    }

   
}

const  styles = StyleSheet.create({
    
    page:{
        height:"100%",
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"center",
        paddingLeft:20,
        paddingRight: 20
    },

    imageView:{
        flexDirection:"row",
        justifyContent:"center"
    },

    image:{
        width: 130,
        height:160,
        borderRadius: 4
    },

    detailView:{
        marginTop: 20,
        elevation:2,
        padding:30,
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"flex-start",
        borderRadius: 8,
    },

    detailTextView:{
        marginTop: 8,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"flex-start",
    },

    detailKey:{
        width:65
    },

    detailValue:{
        width:220
    },

   

});