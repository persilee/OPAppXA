import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,DeviceEventEmitter,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast, {DURATION} from 'react-native-easy-toast';
import CommonFetch from "../../componets/CommonFetch";
import API from '../../api/index';
import {getUserId} from "../../utils/Common";
import Color from "../../config/color";
export default class  ControlScene extends Component {

    constructor(props) {
        super(props);
        this.pageNum = 1;
        this.pageSize = 10;
        this.state = {
            data:[],
            total:0,
            loading:false,
        }
    }

    componentDidMount(){
        getUserId().then(_userId => {
            this.userId = _userId;
            this.fetchData("search");
        });

        this.reload = DeviceEventEmitter.addListener('reloadControllList',(msg) => {
            this.changeTabFetchData();
        });

    }

    componentWillUnmount(){
        this.reload && this.reload.remove();
    }

    changeTabFetchData = () => {
        if(!this.userId || this.state.loading)return;
        this.pageNum = 1;
        this.setState({
            data:[],
            total:0,
        },()=>{
            this.fetchData("search");
        });
    }

    fetchData = (type) => {
        if( type != "search" && (this.pageSize * (this.pageNum-1) ) > this.state.total) return;
        //onEndReached 第一次页面加载时频繁调用
        if(type == "onEndReached" && this.pageNum == 1) return;
        this.setState({
            loading:true
        });
        let params={init: 0,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                queryPair: {
                    // userId: "001",
                    userId:this.userId,
                    taskType:'2',
                    readStatus:this.props.readStatus,
        }};
        console.info("ControlScene params",params);
        CommonFetch.doFetch(
            API.getWaitCheckList,
            params,
            (responseData)=>{
                console.info("ControlScene",responseData);
                if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                    let data = responseData.data.list;
                    this.setState({
                        data:this.state.data.concat(data),
                        total:responseData.data.total,
                        loading:false,
                    });
                    this.pageNum++;
                }
            },
            this.refs.toast);
    }

    itemPress = (index,item) =>{
        this.props.navigation.navigate("ControlDetail",{
            params:item,
            readStatus:this.props.readStatus,
        });
    }

    _renderItem = ({item,index})=>{
        let rightStyle =  {
            backgroundColor: '#FF4618',
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
                rightFont.color= Color.fontColor;
                rightFont.fontSize=13;
        }
        return (
            <View>
                {
                    this.props.readStatus == "0" ? <ItemInput  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}
                    name={item.taskName} textType={"text"}  
                    pressFunc = { () => this.itemPress(index,item)}
                    textValue={item.taskStatus} 
                    rightStyle={rightStyle}
                    rightFontStyle={rightFont}
                    arrowVisible={true}></ItemInput> 
                    : 
                    <ItemInput  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}
                        name={item.taskName} textType={"text"}  
                        pressFunc = { () => this.itemPress(index,item)}
                        arrowVisible={true}></ItemInput>
                }
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
            <View style={GlobalStyles.pageBg}>
                <FlatList
                    ListEmptyComponent = {this._renderEmptyComponent}
                    keyExtractor={(item, index) => `control-${index}`}
                    data={this.state.data}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.2}
                    onEndReached={() => this.fetchData("onEndReached")}>
                </FlatList>
                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>
            </View>
        );
    }
}

const  styles = StyleSheet.create({



});