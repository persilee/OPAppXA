import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import CommonSearch from "../../componets/CommonSearch";
import CommonFetch from "../../componets/CommonFetch";
import RoutApi from '../../api/index';
import Toast, {DURATION} from 'react-native-easy-toast';

import {getUserId} from "../../utils/Common";
import Color from "../../config/color";
import Communications from 'react-native-communications';

export default class FloorSceneDetail extends Component {

    static navigationOptions = ({navigation,screenProps}) => ({
        headerTitle: (<Text style={[GlobalStyles.font20White,GlobalStyles.taCenter,GlobalStyles.flex]}>{navigation.getParam('name', '')}</Text>),
    });

    constructor(props) {
        super(props);

        let queryParam = this.props.navigation.getParam('queryParam', {});
        this.unitId = this.props.navigation.getParam('unitId', '');

        this.state = {
            data:[],
            areaName:queryParam.areaName!='全部'?queryParam.areaName:'',
            provinceId:queryParam.sfid!=0?queryParam.sfid:'',
            pageNo:1,
            pageSize:10,
            totalNum:-1,
            keyword:'',
            searchFlag:false,
            loading: true
        }
    }

    componentDidMount(){
        getUserId().then(_userId => {
            this.userId = _userId;
            this.getList();
        });
    }

    doSearch = ()=>{
        if(!this.state.searchFlag){
            this.state.searchFlag = true;
            this.setState({
                data:[],
                pageNo:1,
                pageSize:10,
                totalNum:-1,
            },this.getList)
        }
        
    }


    getList = () =>{
        if(this.state.totalNum == -1 || this.state.totalNum > (this.state.pageNo-1)*this.state.pageSize){
            this.doFetch();
            this.state.pageNo = this.state.pageNo+1;
        }
    }

    /**
    *查询数据
    */
    doFetch = () => {
        let params={
			init: 0,
			pageNum: this.state.pageNo,
            pageSize: this.state.pageSize,
			queryPair: {
                buidingID: this.unitId,
			}};
        console.log('params',params);
        CommonFetch.doFetch(RoutApi.getEntranceUnitList,params,this.dealResponseData,this.refs.toast)
    }

    dealResponseData=(responseData)=>{
        let data = this.state.data;
        if(responseData.data.list){
            data =  data.concat(responseData.data.list);
        }
        console.log('responseData',data);
        this.setState({
            data:data,
            totalNum:responseData.data.total,
            searchFlag:false,
            loading: false
        })
    }


    headerPress = (item) =>{
        console.log('provincePress',item)
        this.props.navigation.navigate('PopulaceDetail',{queryParam:item})
    }

    isUnlockUserType = (unlockUserType) => {
		console.log('unlockUserType',unlockUserType);
		switch (unlockUserType) {
			case '1':
				return '业主';
				break;
			case '2':
				return '家人';
				break;
			case '3':
				return '租户';
				break;
			case '4':
				return '业主代理人';
				break;
			default:
				return '其他';
				break;
		}
	}


    _renderItem = ({item,index}) =>{
        return (

                <View key={index} style={[styles.itemStyle,GlobalStyles.lineBottom]}>
                    {item.imgUrl2?
                        (<Image source={{uri:item.imgUrl2}} style={styles.image}></Image>):
                        (<Image source={require("../../../assets/images/idcard_default.png")} style={styles.image}></Image>)
                    }
                <View style={[styles.detailView]}>
                    <View style={[styles.detailTextView]}>
                            <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>姓名:</Text>
                            <Text numberOfLines={3} style={[GlobalStyles.font14Gray]} >{item.unlockUserName}</Text>
                    </View>
                    {this.detailText('楼宇名称',item.buidingName)}
                    {this.detailText('进出时间',item.entryTime)}
                    {this.detailText('进出方式',item.entryTime)}
                    {this.detailText('开锁方式',item.unlockType)}
                    {this.detailText('开锁住户类型', this.isUnlockUserType(item.unlockUserType))}
                </View>

                </View>
        )
    }


    detailText = (key,value)=>{
        return(
            <View style={styles.detailTextView}>
                <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>{key}:</Text>
                <Text numberOfLines={3} style={[GlobalStyles.font14Gray]}>{value}</Text>
            </View>
        )
    }

    _renderEmptyComponent = () => {
        if(!this.state.loading){
            return (
                <View style={[GlobalStyles.center,GlobalStyles.mt40]}>
                    <Text style={[GlobalStyles.font14Gray]}>无数据</Text>
                </View>
            );
        }else{
            return null;
        }
    }



    render() {

        return (
            <View style={[GlobalStyles.pageBg]}>

                <View style={[GlobalStyles.containerBg,styles.searchView]}>
                    <CommonSearch placeholder={'请输入姓名'} placeholderTextColor={Color.whiteColor} 
                                style={[GlobalStyles.pageBg,GlobalStyles.borderColor,{borderWidth:1}]}
                                onChangeText={(keyword) => this.setState({keyword:keyword})}
                                onSubmitEditing={this.doSearch}
                                autoFocus={false}></CommonSearch>
                    <TouchableOpacity style={styles.searchButton} onPress={this.doSearch}>
                        <Text style={[GlobalStyles.font14White]}>搜索</Text>
                    </TouchableOpacity>

                </View>

                <FlatList
                    ListEmptyComponent = {this._renderEmptyComponent}
                    keyExtractor={(item, index) => index+""}
                    data={this.state.data}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.getList}
                />

                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>

            </View>
        );
    }

   
}

const  styles = StyleSheet.create({
    itemStyle:{
        height:170,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        paddingLeft:30,
        paddingRight:30,
    },

    image:{
        width: 106,
        height:126,
        borderRadius: 4
    },

    detailView:{
        height:170,
        marginTop: 23,
        marginLeft: 10,
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"flex-start",
        color: '#333',
        fontSize: 14
    },

    detailTextView:{
        marginTop: 5,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"flex-start",
    },

    detailKey:{
        width:95
    },

    detailValue:{
        width:170
    },

    searchView:{
        height:48,
        paddingLeft: 20,
        paddingRight: 15,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },

    searchStyle:{
        flexGrow: 1,
        backgroundColor:"#FFF",
    },

    searchButton:{
        height: 30,
        width:43,
        marginLeft: 15,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    }


});