import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    BackHandler,DeviceEventEmitter,
} from 'react-native';
import SpacingView from "../../componets/SpacingView";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import {observer,inject} from 'mobx-react';
import API from "../../api/index";
import {Echarts, echarts} from 'react-native-secharts';
import CommonFetch from "../../componets/CommonFetch";
import {groupBy} from "../../utils/Utils";
import Color from "../../config/color";
@inject('User')
@observer
export default class Mine extends Component{
    constructor(props) {
        super(props);
        this.state ={
            completeData:[],
            completeTotal:0,
            uncompleteData:[],
            uncompleteTotal:0,
            uncompleteVisible:false,
        }
    }

    componentDidMount(){
        this.reload = DeviceEventEmitter.addListener('reloadMyStatistics',(msg) => {
            console.info("reloadMyStatistics",msg);
            this.fetchData();
        });
        this.fetchData();
    }

    componentWillUnmount(){
        this.reload && this.reload.remove();
    }

    getMonth = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        month =  month >=10 ? month : `0${month}`;
        return `${year}${month}`;
    }

    fetchData = () =>{
        let url = API.getHistoryList;
        let params =  {init: 0,
            pageNum: 1,
            pageSize: 1,
            queryPair: {
                // userId: "001",
                taskMonth:this.getMonth(),
                userId:this.props.User.userId,
        }};
        console.info("getHistoryList params",params);
        CommonFetch.doFetch(url,params,(responseData)=>{
            console.info("getHistoryList",responseData);
            if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                let data = responseData.data.list[0].childData;
                this.convertData(data);
            }
        });
    }

    convertData = (data) =>{
        console.info("getHistoryList",data);
        let sorted = groupBy(data, function (item) {
            return [item.taskStatus];
        });
        console.info("sorted",sorted);
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
        this.setState({
            completeData,
            uncompleteData,
            completeTotal,
            uncompleteTotal,
        });
    }

    setVisible = (flag) =>{
        this.setState({
            uncompleteVisible:flag,
        });
    }

    render(){
        const {navigate} = this.props.navigation;

        const completOption = {
            tooltip: {
                show:false,
            },
            // color:['#01a2ea', '#8ac99c','#23ac38','#b4d467'],
            color:["#4a65a7","#bac4e8","#879ddc","#5a7ed4","#2F449F"],
            series: [{
                type: 'pie',
                radius : '35%',
                center: ['50%', '50%'],
                animation:false,
                // data:[
                //     {value:5, name:'居民核查类'},
                //     {value:10, name:'群租房核查'},
                //     {value:4, name:'舆情处理类'},
                //     {value:5, name:'布控类'},
                // ],
                data:this.state.completeData,
                label:{
                    normal:{
                        formatter:'{style|{b}}\n{style|({c}}{style|项)}',
                        rich:{
                            style:{
                                color:Color.fontColor,
                                fontSize:12,
                                align:'center',
                            },
                        }
                    }
                }
            }]
          };

        const uncompletOption = {
            tooltip: {
                show:false,
            },
            // color:['#01a2ea', '#8ac99c','#23ac38','#b4d467'],
            color:["#4a65a7","#bac4e8","#879ddc","#5a7ed4","#2F449F"],
            series: [{
                type: 'pie',
                radius : '35%',
                center: ['50%', '50%'],
                animation:false,
                data:this.state.uncompleteData,
                label:{
                    normal:{
                        formatter:'{style|{b}}\n{style|({c}}{style|项)}',
                        rich:{
                            style:{
                                color:Color.fontColor,
                                fontSize:12,
                                align: 'center',
                            },
                        }
                    }
                }
            }]
          };

        return (
            <ScrollView style={GlobalStyles.pageBg}>
                <TouchableOpacity onPress = {() => navigate("Setting")}
                    style={[styles.userContainer, GlobalStyles.flexDirectRow, GlobalStyles.center, GlobalStyles.pdlr15]}>
                    <Image source={require('../../../assets/images/person_portait.png')} style={styles.userImg} />
                    <View style={[GlobalStyles.flex]}>
                        <Text style={[GlobalStyles.font18White,GlobalStyles.mb5]}>{this.props.User.userNameChn}</Text>
                        <Text style={GlobalStyles.font14White}>警员ID：{this.props.User.idcardNum}</Text>
                    </View>
                    <FontAwesome size={22} name={"angle-right"} color={Color.whiteColor}/>
                </TouchableOpacity>
                
                <SpacingView />

                <View style={[GlobalStyles.pdlr15]}>
                    <View style={[styles.container,GlobalStyles.containerBg]}>
                        <Text style={[GlobalStyles.font15Gray,GlobalStyles.borderColor,styles.title]}>本月任务清单</Text>
                        <View style={[GlobalStyles.flexDirectRow,styles.taskContainer,GlobalStyles.alignCenter]}>
                            <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center]} onPress={() => 
                                this.setVisible(false)}>
                                <Text style={[GlobalStyles.font12White,GlobalStyles.mb5]}>已完成任务数</Text>
                                <Text style={[GlobalStyles.font18Gray,styles.taskNum]}>{this.state.completeTotal}</Text>
                            </TouchableOpacity>
                            <View style={styles.line}></View>
                            <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center]}
                                onPress={() => this.setVisible(true)}>
                                <Text style={[GlobalStyles.font12White,GlobalStyles.mb5]}>未完成任务数</Text>
                                <Text style={[GlobalStyles.font18Gray,styles.taskNum]}>{this.state.uncompleteTotal}</Text>
                            </TouchableOpacity>
                        </View>

                        { !this.state.uncompleteVisible ? 
                             <Echarts option={completOption} height={200} /> 
                             :<Echarts option={uncompletOption} height={200} /> }

                        <TouchableOpacity style={{flexDirection:"row",justifyContent:"flex-end"}}
                              onPress={() => navigate("History")}>
                            <Text style={[GlobalStyles.font14White,styles.btn]}>查看历史记录>></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    userContainer:{
        height:104,
    },
    userImg:{
        width:56,
        height:56,
        borderRadius:28,
        marginRight:10,
    },
    container:{
        marginTop:25,
        marginBottom:25,
        padding:15,
        borderRadius:8,
        elevation:2,
    },
    title:{
        fontWeight:"bold",
        borderBottomWidth:1,
        paddingBottom:8,
    },
    taskContainer:{
        marginTop:15,
        marginBottom:15,
    },
    taskNum:{
        fontWeight:"bold",
    },
    line:{
        width:1,
        height:25,
        backgroundColor:Color.fontColor,
    },
    btn:{
        marginTop:15,
    }

});