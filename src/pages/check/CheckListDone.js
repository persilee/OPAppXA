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
import CheckListWait from './CheckListWait';
import {observer,inject} from 'mobx-react';
import Color from "../../config/color";
@inject('User')
@observer
export default class  CheckList extends Component {


    constructor(props) {
        super(props);

        this.state = {
            doneData:[],

            areaList:[],
            buildList:[],
            unitList:[],
            roomList:[],
            selectAreaId:'',
            selectBuildId:'',
            selectUnitId:'',
            selectRoomId:'',
            selectFilterType:'',
            selectCondType:'',

           
            condVisible:false,

            areaListPageNo:1,
            areaListTotal:-1,
            buildListPageNo:1,
            buildListTotal:-1,
            unitListPageNo:1,
            unitListTotal:-1,
            roomListPageNo:1,
            roomListTotal:-1,

            doneListPageNo:1,
            doneListTotal:-1,

        }
    }

    componentDidMount(){
        this.getAreaList();
        this.getDoneList();
        this.getFilterType()
        this.reload = DeviceEventEmitter.addListener('reloadCheckList',(msg) => {
            this.setState({
                doneData:[],

                areaList:[],
                buildList:[],
                unitList:[],
                roomList:[],
                selectAreaId:'',
                selectBuildId:'',
                selectUnitId:'',
                selectRoomId:'',

                selectCondType:'',

               
                condVisible:false,

                areaListPageNo:1,
                areaListTotal:-1,
                buildListPageNo:1,
                buildListTotal:-1,
                unitListPageNo:1,
                unitListTotal:-1,
                roomListPageNo:1,
                roomListTotal:-1,

                doneListPageNo:1,
                doneListTotal:-1
            },()=>{
                this.getAreaList();
                this.getDoneList();
            })
        });
    }


    getDoneList = () => {

        if(this.state.doneListTotal == -1 || this.state.doneListTotal > (this.state.doneListPageNo-1)*10){
            
            this.state.doneListPageNo = this.state.doneListPageNo+1;

            let params={init: 0,
                   pageNum: this.state.doneListPageNo-1,
                   pageSize: 10,
                   queryPair: {
                       userId: this.props.User.userInfo.userId,
                       roomId:this.state.selectRoomId,
                       areaId:this.state.selectAreaId,
                       buidingId:this.state.selectBuildId,
                       unitId:this.state.selectUnitId,
                       roomCheckTypeId:this.state.selectFilterType
                   }};


            CommonFetch.doFetch(
                RoutApi.getDoneCheckList,
                params,
                (responseData)=>{
                    let data =  this.state.doneData.concat(responseData.data.list?responseData.data.list:[]);
                    
                    this.setState({
                        doneData:data,
                        doneListTotal:responseData.data.total,
                        searchFlag:false
                    })
                },
                this.refs.toast)

            
        }
    }

    

    getAreaList = () => {
        if(this.state.areaListTotal == -1 || this.state.areaListTotal > (this.state.areaListPageNo-1)*10){
            
            let params={init: 0,
                   pageNum: this.state.areaListPageNo,
                   pageSize: 100,
                   queryPair: {
                       userId: this.props.User.userInfo.userId
                   }};

            CommonFetch.doFetch(
                RoutApi.getCheckTaskAreaList,
                params,
                (responseData)=>{
                    let data = responseData.data.list?responseData.data.list:[];
                    this.setState({
                        areaList:data,
                        areaListTotal:responseData.data.total
                    })
                },
                this.refs.toast)

            this.state.areaListPageNo = this.state.areaListPageNo+1;
        }
    }


    getBuildList = () => {
        if(this.state.buildListTotal == -1 || this.state.buildListTotal > (this.state.buildListPageNo-1)*10){
            
            let params={init: 0,
                   pageNum: this.state.buildListPageNo,
                   pageSize: 100,
                   queryPair: {
                       userId: this.props.User.userInfo.userId,
                       areaId:this.state.selectAreaId,
                   }};

            CommonFetch.doFetch(
                RoutApi.getCheckTaskBuildList,
                params,
                (responseData)=>{
                    let data = this.state.buildList.concat(responseData.data.list?responseData.data.list:[]);
                    this.setState({
                        buildList:data,
                        buildListTotal:responseData.data.total
                    })
                },
                this.refs.toast)

            this.state.buildListPageNo = this.state.buildListPageNo+1;
        }
    }

    getUnitList = () => {
        if(this.state.unitListTotal == -1 || this.state.unitListTotal > (this.state.unitListPageNo-1)*10){
            
            let params={init: 0,
                   pageNum: this.state.unitListPageNo,
                   pageSize: 100,
                   queryPair: {
                       userId: this.props.User.userInfo.userId,
                       buidingId:this.state.selectBuildId,
                   }};

            CommonFetch.doFetch(
                RoutApi.getCheckTaskUnitList,
                params,
                (responseData)=>{
                    let data = this.state.unitList.concat(responseData.data.list?responseData.data.list:[]);
                    this.setState({
                        unitList:data,
                        unitListTotal:responseData.data.total
                    })
                },
                this.refs.toast)

            this.state.unitListPageNo = this.state.unitListPageNo+1;
        }
    }


    getRoomList = () => {
        if(this.state.roomListTotal == -1 || this.state.roomListTotal > (this.state.roomListPageNo-1)*10){
            
            let params={init: 0,
                   pageNum: this.state.roomListPageNo,
                   pageSize: 100,
                   queryPair: {
                       userId: this.props.User.userInfo.userId,
                       unitId:this.state.selectUnitId,
                   }};

            CommonFetch.doFetch(
                RoutApi.getCheckTaskRoomList,
                params,
                (responseData)=>{
                    let data = this.state.roomList.concat(responseData.data.list?responseData.data.list:[]);
                    this.setState({
                        roomList:data,
                        roomListTotal:responseData.data.total
                    })
                },
                this.refs.toast)

            this.state.roomListPageNo = this.state.roomListPageNo+1;
        }
    }

    getFilterType =() => {

        let params={init: 0,
            pageNum: 1,
            pageSize: 100,
            queryPair: {
                userId: this.props.User.userInfo.userId,
            }};

        CommonFetch.doFetch(
            RoutApi.getCheckTaskFilterType,
            params,
            (responseData)=>{
                console.log(JSON.stringify(responseData))
                this.setState({
                    filterType: responseData.data.list,
                })
            },
            this.refs.toast)
    }

    selectCond=(type)=>{

        this.state.selectCondType = type;

        this.setState({
                condVisible:true,
            })

        switch(type){
            case('build'):
                this.getBuildList();
                break;
            case('unit'):
                this.getUnitList();
                break;
            case('room'):
                this.getRoomList();
                break;
                
        }        
    }

    closeCondModal=()=>{
        this.setState({
            condVisible:false
        })
    }

    renderCondList=({item,index})=>{

        let name = '';
        let id = '';
        let isSelect = false;
        switch(this.state.selectCondType){
            case('area'):
                name= item.areaName;
                id = item.areaId;
                isSelect = item.areaId==this.state.selectAreaId;
                break;
            case('build'):
                name = item.buidingName;
                id = item.buidingID;
                isSelect = item.buidingID==this.state.selectBuildId;
                break;
            case('unit'):
                name = item.unitName;
                id = item.unitID;
                isSelect = item.unitID==this.state.selectUnitId;
                break;
            case('room'):
                name = item.RoomName;
                id = item.RoomID;
                isSelect = item.RoomID==this.state.selectRoomId;
                break;
            case('filter'):
                name = item.roomCheckType;
                id = item.roomCheckTypeId;
                isSelect = item.roomCheckTypeId == this.state.selectFilterType;
                break;
        }

        console.log('renderCondList',item,index,this.state.selectCondType);
        return (
            <TouchableOpacity style={[styles.condListView,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} 
                onPress={()=>{this.selectCondPress(this.state.selectCondType,id)}}>
                <Text style={isSelect?GlobalStyles.font14White:GlobalStyles.font14Gray}>{name}</Text>
                {isSelect?(
                    <FontAwesome name={"check"} color={Color.whiteColor} size={13} />
                ):null}
            </TouchableOpacity>
        )
    }

    renderCondListFull=()=>{
        let isSelect = false;
        let data = [];
        switch(this.state.selectCondType){
            case('area'):
                isSelect = ''==this.state.selectAreaId;
                data = this.state.areaList;
                break;
            case('build'):
                isSelect = ''==this.state.selectBuildId;
                data = this.state.buildList;
                break;
            case('unit'):
                isSelect = ''==this.state.selectUnitId;
                data = this.state.unitList;
                break;
            case('room'):
                isSelect = ''==this.state.selectRoomId;
                data = this.state.roomList;
                break;
            case('filter'):
                isSelect = ''==this.state.selectFilterType;
                data = this.state.filterType;
                break;
        }
        return (
            <TouchableOpacity style={[GlobalStyles.blackAlpha50,styles.condPageModal]} onPress={this.closeCondModal}>
                <View>
                    <TouchableOpacity style={[styles.condListView,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} 
                        onPress={()=>{this.selectCondPress(this.state.selectCondType,'')}}>
                        <Text style={isSelect?GlobalStyles.font14White:GlobalStyles.font14Gray}>全部</Text>
                        {isSelect?(
                                <FontAwesome name={"check"} color={Color.whiteColor} size={13} />
                            ):null}
                    </TouchableOpacity>
                    <FlatList
                        keyExtractor={(item, index) => index+''}
                        data={data}
                        renderItem={this.renderCondList}>

                    </FlatList>
                    
                </View>
            </TouchableOpacity>
        )
    }

    selectCondPress=(type,id)=>{

        switch(type){
            case('area'):
                if(this.state.selectAreaId != id){
                    this.setState({
                        selectAreaId:id,
                        selectBuildId:'',
                        selectUnitId:'',
                        selectRoomId:'',
                        buildListPageNo:1,
                        buildListTotal:-1,
                        unitListPageNo:1,
                        unitListTotal:-1,
                        roomListPageNo:1,
                        roomListTotal:-1,
                        buildList:[],
                        unitList:[],
                        roomList:[],
                        doneListPageNo:1,
                        doneListTotal:-1,
                        doneData:[],
                        condVisible:false,
                    },this.getDoneList)
                }else{
                    this.setState({
                        condVisible:false,
                    })
                }
                break;
            case('build'):
                if(this.state.selectBuildId != id){
                    this.setState({
                        selectBuildId:id,
                        selectUnitId:'',
                        selectRoomId:'',
                        unitListPageNo:1,
                        unitListTotal:-1,
                        roomListPageNo:1,
                        roomListTotal:-1,
                        unitList:[],
                        roomList:[],
                        doneListPageNo:1,
                        doneListTotal:-1,
                        doneData:[],
                        condVisible:false,
                    },this.getDoneList)
                }else{
                    this.setState({
                        condVisible:false,
                    })
                }
                break;
            case('unit'):
                if(this.state.selectUnitId != id){
                    this.setState({
                        selectUnitId:id,
                        selectRoomId:'',
                        roomListPageNo:1,
                        roomListTotal:-1,
                        roomList:[],
                        doneListPageNo:1,
                        doneListTotal:-1,
                        doneData:[],
                        condVisible:false,
                    },this.getDoneList)
                }else{
                    this.setState({
                        condVisible:false,
                    })
                }
                break;
            case('room'):
                if(this.state.selectRoomId != id){
                    this.setState({
                        selectRoomId:id,
                        doneListPageNo:1,
                        doneListTotal:-1,
                        doneData:[],
                        condVisible:false,
                    },this.getDoneList)
                }else{
                    this.setState({
                        condVisible:false,
                    })
                }
                break;
            case('filter'):
                if(this.state.selectFilterType != id){
                    this.setState({
                        selectFilterType:id,
                        doneListPageNo:1,
                        doneListTotal:-1,
                        doneData:[],
                        condVisible:false,
                    },this.getDoneList)
                }else{
                    this.setState({
                        condVisible:false,
                    })
                }
                break;
        }
    }

    _renderItem = ({item,index})=>{

        return (
            <TouchableOpacity key={index} style={[styles.item,GlobalStyles.lineBottom]} onPress={()=>{this.taskPress(item)}}>
                 <ItemInput name={item.taskName} textType={"text"}  textValue={item.checkTime} 
                 leftStyle={[styles.leftStyle,GlobalStyles.font14Gray]}
                 rightFontStyle={GlobalStyles.font14White}
                 arrowVisible={true}></ItemInput>
            </TouchableOpacity>
        )
    }


    taskPress = (item)=>{
        this.props.navigation.navigate('CheckResult',{taskId:item.taskId,roomCheckId:item.roomCheckId})
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

            <View style={GlobalStyles.pageBg} tabLabel='已核查任务'>
                <View style={GlobalStyles.flexDirectColumn}>
                    <View style={[styles.condView,GlobalStyles.lineBottom]}>
                        <TouchableOpacity style={styles.cond} onPress={()=>this.selectCond('area')}>
                            <Text style={this.state.selectAreaId?[styles.condNameSelected,GlobalStyles.font14White]
                                :[styles.condName,GlobalStyles.font14Gray]}>小区</Text>
                            <FontAwesome name={"angle-down"} color={this.state.selectAreaId?Color.whiteColor:Color.whiteAlpha50Color} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cond} onPress={()=>this.selectCond('build')}>
                            <Text style={this.state.selectBuildId?[styles.condNameSelected,GlobalStyles.font14White]
                            :[styles.condName,GlobalStyles.font14Gray]}>楼栋</Text>
                            <FontAwesome name={"angle-down"} color={this.state.selectBuildId?Color.whiteColor:Color.whiteAlpha50Color} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cond} onPress={()=>this.selectCond('unit')}>
                            <Text style={this.state.selectUnitId?[styles.condNameSelected,GlobalStyles.font14White]
                            :[styles.condName,GlobalStyles.font14Gray]}>单元</Text>
                            <FontAwesome name={"angle-down"} color={this.state.selectUnitId?Color.whiteColor:Color.whiteAlpha50Color} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cond} onPress={()=>this.selectCond('room')}>
                            <Text style={this.state.selectRoomId?[styles.condNameSelected,GlobalStyles.font14White]
                            :[styles.condName,GlobalStyles.font14Gray]}>房间</Text>
                            <FontAwesome name={"angle-down"} color={this.state.selectRoomId?Color.whiteColor:Color.whiteAlpha50Color} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cond} onPress={()=>this.selectCond('filter')}>
                            <Text style={this.state.selectFilterType?[styles.condNameSelected,GlobalStyles.font14White]
                                :[styles.condName,GlobalStyles.font14Gray]}>筛选</Text>
                            <FontAwesome name={"angle-down"} color={this.state.selectRoomId?Color.whiteColor:Color.whiteAlpha50Color} size={20} />
                        </TouchableOpacity>
                    </View>

                    {this.state.condVisible&&this.renderCondListFull()}
                </View>
                <FlatList
                    ListEmptyComponent = {this._renderEmptyComponent}
                    keyExtractor={(item, index) => index+''}
                    data={this.state.doneData}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.getDoneList}>

                </FlatList>

                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>
            </View>

        );
    }

   
}

const  styles = StyleSheet.create({


    condListView:{
        flexDirection: 'row' ,
        justifyContent:  'space-between' ,
        alignItems:  'center',
        paddingRight: 18,
        paddingLeft: 18,
        height: 50,
    },

    condPageModal:{
        position: 'relative',
        width:'100%',
        height:'100%',
    },

    condView:{
        flexDirection: 'row',
        height:50,
    },

    cond:{
        flex:1,
        flexDirection: 'row',
        justifyContent:  'center',
        alignItems:  'center',
    },

    condName:{
        marginRight: 5,
    },

    condNameSelected:{
        marginRight: 5,
    },

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


});