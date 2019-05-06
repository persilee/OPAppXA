import React, { Component } from 'react';
import {
    StyleSheet,FlatList,
    Button,
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Platform,
    BackHandler,
} from 'react-native';

import GlobalStyles from "../../../assets/styles/GlobalStyles";
import API from "../../api/index";
import {Echarts, echarts} from 'react-native-secharts';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonFetch from "../../componets/CommonFetch";
import {groupBy} from "../../utils/Utils";
import {width,getUserId} from "../../utils/Common";
import Color from "../../config/color";
export default class History extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            loading:true,
            total:0,
        }
    }

    componentDidMount(){
        getUserId().then(_userId => {
            this.userId = _userId;
            this.fetchData();
        });
    }
    
    fetchData = () =>{
        let url = API.getHistoryList;
        let params =  {init: 0,
            pageNum: 1,
            pageSize: 20,
            queryPair: {
                // userId: "001",
                userId:this.userId,
        }};
        console.info("getHistoryList params",params);
        CommonFetch.doFetch(url,params,(responseData)=>{
            console.info("getHistoryList",responseData);
            if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                let data = responseData.data.list;
                let convertArr = this.convertData(data);
                this.setState({
                    data:this.state.data.concat(convertArr),
                    loading: false,
                });
            }
        });
    }

    convertData = (data) => {
        let  arr =  data.map(item => {
            let year =  item.taskMonth.slice(0,4);
            let month =  item.taskMonth.slice(4);
            let childObj = this.convertChildData(item.childData);
            let obj = Object.assign({},{
                year:parseInt(year),
                month:parseInt(month),
                expanded:false,
                },
                childObj);
            return obj;
      });
      console.info("history convertData",arr);
      let sorted = groupBy(arr, function (item) {
        return [item.year];
      });
      sorted.forEach(item => {
        item.sort((item1,item2) => { //按照月份排序
            return item2.month - item1.month;
        });
      });
        //按照年份排序
     sorted.sort((item1,item2) => {
        return item2[0].year - item1[0].year; 
      });
      let convertArr = [];
      sorted.forEach(item => {
        convertArr = convertArr.concat(item);
      });
      console.info(convertArr);
      return convertArr;
    }

    convertChildData = (data) =>{
        let sorted = groupBy(data, function (item) {
            return [item.taskStatus];
        });
        let completeData = [],uncompleteData = [],completeTotal=0,uncompleteTotal=0;
        sorted.forEach(item => {
            if(item.length > 0){
                if(item[0].taskStatus == "未完成"){
                    uncompleteTotal = item[0].allTaskNum;
                    uncompleteData = item.map(it => {
                        return {
                            name:it.taskType,
                            value:it.taskNum,
                        }
                    });
                }else if(item[0].taskStatus == "已完成"){
                    completeTotal = item[0].allTaskNum;
                    completeData = item.map(it => {
                        return {
                            name:it.taskType,
                            value:it.taskNum,
                        }
                    });
                }
            }
        });
        return {
            completeData,
            uncompleteData,
            completeTotal,
            uncompleteTotal,
        }
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

    renderItem = ({item,index}) => {
        return (
            <View style={[GlobalStyles.lineBlackBottom]}>
                <TouchableOpacity style={[GlobalStyles.flexDirectRow,GlobalStyles.center,GlobalStyles.containerBg,
                    styles.firstItemStyle,GlobalStyles.pdlr15]}
                    onPress={() => this.itemExpand(item,index)}>
                    <Text style={[GlobalStyles.flex,GlobalStyles.font14Gray]}>{item.year}年{item.month}月份任务清单</Text>
                    <FontAwesome name={item.expanded?"angle-down":"angle-right"} color={Color.whiteColor} size={24} />
                </TouchableOpacity>
                <View style={[GlobalStyles.flexDirectColumn]}>
                    {
                        item.expanded ? this._renderSecondItem(item,index) : null
                    }
                </View>
            </View>
        );
    }

    itemExpand = (item,index) => {
        let list = [...this.state.data];

        list.forEach((it,ind)=>{
            if(ind == index){
                it.expanded = !it.expanded;
            }else{
                it.expanded = false;
            }
        });
        this.setState({
            data:list
        });
    }

    _renderSecondItem = (item,index) => {
        return (
            <View style={[GlobalStyles.p15]}>
                <View style={[styles.container,GlobalStyles.containerBg]}>
                    <View style={[styles.titleSection,GlobalStyles.flexDirectRow,GlobalStyles.borderColor]}>
                        <Text style={[GlobalStyles.font14Gray,styles.title]}>已完成任务数</Text>
                        <Text style={[styles.taskNum,GlobalStyles.font18Gray]}>{item.completeTotal}</Text>
                    </View>
                    <Echarts option={this.getChartOption(item.completeData)} height={200} />
                </View>
                <View style={[styles.container,GlobalStyles.containerBg]}>
                    <View style={[styles.titleSection,GlobalStyles.flexDirectRow,GlobalStyles.borderColor]}>
                        <Text style={[GlobalStyles.font14Gray,styles.title]}>未完成任务数</Text>
                        <Text style={[styles.taskNum,GlobalStyles.font18Gray]}>{item.uncompleteTotal}</Text>
                    </View>
                    <Echarts option={this.getChartOption(item.uncompleteData)} height={200} width={width-60}/>
                </View>
            </View>
        );
    }

    getChartOption = (data) => {
        const option = {
            tooltip: {
                show:false,
            },
            color:["#4a65a7","#bac4e8","#879ddc","#5a7ed4","#2F449F"],
            series: [{
                type: 'pie',
                radius : '35%',
                center: ['50%', '50%'],
                animation:false,
                data:data,
                label:{
                    // formatter:'{style|{b}}\n{style|({c}}{style|项)}',
                    formatter:['{style|{b}}','{style|({c}}{style|项)}'].join('\n'),
                    rich:{
                        style:{
                            color:Color.fontColor,
                            fontSize:12,
                            align: 'center',
                        },
                    }
                }
            }]
        };
        return option;
    }

    render() {
        return (
            <FlatList
                style={GlobalStyles.pageBg1}
                ListEmptyComponent = {this._renderEmptyComponent}
                renderItem={this.renderItem}
                data={this.state.data}
                extraData={this.state}
                keyExtractor={(item,index) => `history-${index}`}
            />
        );
    }
}

const styles = StyleSheet.create({
    firstItemStyle:{
        height:48,
    },
    container:{
        marginBottom:20,
        padding:15,
        borderRadius:8,
        elevation:2,
    },
    titleSection:{
        justifyContent:"space-between",
        paddingBottom:8,
        borderBottomWidth:1,
        borderColor:Color.borderColor,
    },
    taskNum:{
        fontWeight:"bold",
    },
});