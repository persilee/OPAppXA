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
export default class  PopulaceList extends Component {


    constructor(props) {
        super(props);

        let queryParam = this.props.navigation.getParam('queryParam', {});

        this.state = {
            data:[],
            areaName:queryParam.areaName!='全部'?queryParam.areaName:'',
            provinceId:queryParam.sfid!=0?queryParam.sfid:'',
            pageNo:1,
            pageSize:10,
            totalNum:-1,
            keyword:'',
            searchFlag:false,
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
        let params={init: 0,
                   pageNum: this.state.pageNo,
                   pageSize: this.state.pageSize,
                   queryPair: {
                    //    userId: "001",
                        userId:this.userId,
                       areaName:this.state.areaName,
                       id:this.state.provinceId,
                       roomerName:this.state.keyword
                   }};

        CommonFetch.doFetch(RoutApi.getPopulaceList,params,this.dealResponseData,this.refs.toast)
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
            searchFlag:false
        })
    }


    headerPress = (item) =>{
        console.log('provincePress',item)
        this.props.navigation.navigate('PopulaceDetail',{queryParam:item})
    }




    _renderItem = ({item,index}) =>{
        return (

                <TouchableOpacity key={index} style={[styles.itemStyle,GlobalStyles.lineBottom]}
                    onPress={() => this.headerPress(item)}>
                    {item.identyPhoto?
                        (<Image source={{uri:item.identyPhoto}} style={styles.image}></Image>):
                        (<Image source={require("../../../assets/images/idcard_default.png")} style={styles.image}></Image>)
                    }
                    <View style={styles.detailView}>
                        <View style={styles.detailTextView}>
                            <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>姓名:</Text>
                            <Text numberOfLines={3} style={[GlobalStyles.font14Gray]} >{item.roomerName}</Text>
                            {item.peopleType=='1'?(<Image style={{height:15,width:15,marginLeft:10,marginTop:2}} source={require("../../../assets/images/star.png")}></Image>):null}
                        </View>
                        {this.detailText('联系方式',item.callPhone)}
                        {this.detailText('联系地址',item.address)}
                    </View>

                </TouchableOpacity>
        )
    }


    detailText = (key,value)=>{
        return(
            <View style={styles.detailTextView}>
                <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>{key}:</Text>
                <Text numberOfLines={3} style={[GlobalStyles.font14Gray,styles.detailValue]}>{value}</Text>
            </View>
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
            <View style={[GlobalStyles.pageBg]}>

                <View style={[GlobalStyles.containerBg,styles.searchView]}>
                    <CommonSearch placeholder={'请输入关键字'} placeholderTextColor={Color.whiteColor} 
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
        height:130,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        paddingLeft:30,
        paddingRight:30,
    },

    image:{
        width: 78,
        height:96,
        borderRadius: 4
    },

    detailView:{
        height:130,
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
        width:65
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