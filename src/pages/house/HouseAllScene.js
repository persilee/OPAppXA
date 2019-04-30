import React, { Component } from 'react';
import {
    StyleSheet,Modal,ScrollView,
    View,
    Text,
    TouchableOpacity,
    Platform,
    FlatList,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {width} from "../../utils/Common";
import API from "../../api/index";
import {groupBy} from "../../utils/Utils";
import {getUserId} from "../../utils/Common";
import Color from "../../config/color";
import {observer,inject} from 'mobx-react/native';


@inject('User')
@observer
export default class HouseAllScene extends Component{
    constructor(props) {
        super(props);
        /*  floorNum: "99F"
            houseInfo: "7443453_9999_0_空置||" 
        */
        this.state = {
            modalVisible:false,
            filterCheckedArr:[true,false,false,false,false,false],
            data:[],
            houseColor:[],
        }
    }

    componentDidMount(){
        console.info("getHouseUnitInfo","componentDidMount");
        getUserId().then(_userId => {
            this.userId = _userId;
            this.getHouseColor();
            let type = 0;
            if(this.props.type != "all"){
                type = "全部";
            }
            this.fetchData(type);
        });
    }

    componentWillUnmount(){
        this.setState({
            modalVisible:false,
        });
    }

    getHouseColor = () => {
        let url = API.getHouseColor;;
        fetch(url,{
               method: 'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'areaKey': this.props.User.areaKey
                   // 'Authorization': this.props.User.token
               },
               body:JSON.stringify({init: 0,
                   pageNum: 1,
                   pageSize: 10,
                   queryPair: {
                    //    userId: "001",
                         userId:this.userId,
                   }})
           })
           .then(response => response.json())
           .then(responseData => {
               console.info("getHouseColor",responseData);
               if (responseData.data  && responseData.data.list && responseData.data.list.length > 0) {
                   let arr = this.convertHouseColor(responseData.data.list);
                   this.setState({
                        houseColor: arr,
                   });
               }
           }).catch( err => {
               console.error(err);
           });
    }

    convertHouseColor = (list) =>{
        let sorted = groupBy(list, function (item) {
            return [item.type];
        });
        console.info("convertHouseColor",sorted);
        let houseFilterArray = [];
        if(sorted.length > 0 ){
            let index = sorted.findIndex(item => {
                if(item.length > 0){
                    return  item[0].type == this.props.colorType;
                }
            });
            houseFilterArray = index >= 0 ? sorted[index] : [];
        }
        return houseFilterArray;
    }

    fetchData = (type) => {
       let params = {
            init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                // userId: "001",
                userId:this.userId,
                unitId:this.props.unitId,
                // unitId:"467193"
            }
       } 
       if(this.props.type == "all"){
            if(type){
                 //1 空置 、2 出租房、3 业主自住、4 7人以上入住、5 重点关注房间
                params.queryPair.type = type;
            }
            console.info("getAllHouseData params ",params);
            this.getAllHouseData(params);
       }else{
            if(type != "全部"){
                params.queryPair.type = type;
            }
            console.info("getEmphasisData params ",params);
            this.getEmphasisData(params);
       }
    }

    getAllHouseData = (params) => {
        let url = API.getHouseUnitInfo;
        console.info("getAllHouseData",url,params);
        fetch(url,{
               method: 'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'areaKey': this.props.User.areaKey
                   // 'Authorization': this.props.User.token
               },
               body:JSON.stringify(params)
           })
           .then(response => response.json())
           .then(responseData => {
               console.info("getHouseUnitInfo",responseData);
               if (responseData.data  && responseData.data.list && responseData.data.list.length > 0) {
                   let arr = this.convertTreeData(responseData.data.list);
                   this.setState({
                       data: arr,
                   });
               }else{
                   this.setState({
                       data:[]
                   });
               }
           }).catch( err => {
               console.error(err);
           });
    }

    getEmphasisData = (params) => {
        let url = API.getHouseUnitEmphasisInfo;
        console.info("getAllHouseData",url,params);
        fetch(url,{
               method: 'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'areaKey': this.props.User.areaKey
                   // 'Authorization': this.props.User.token
               },
               body:JSON.stringify(params)
           })
           .then(response => response.json())
           .then(responseData => {
               console.info("getHouseUnitInfo",responseData);
               if (responseData.data  && responseData.data.list && responseData.data.list.length > 0) {
                   let arr = this.convertTreeData(responseData.data.list);
                   this.setState({
                       data: arr,
                   });
               }else{
                    this.setState({
                        data:[]
                    });
               }
           }).catch( err => {
               console.error(err);
           });
    }

    convertTreeData = (list) => {
        console.log(list);
        let arr = list.map((item,index) => {
            let roomData = item.houseInfo || '无数据';
            console.info("convertTreeData before ",index,roomData);
            let roomArr = roomData && roomData.split(",");
            roomArr = roomArr.map(data => { return data.split("_")});
            roomArr = roomArr.map(data => {
                if(data[3] && data[3].indexOf("|") > 0){
                    data[3]=  data[3].split("|").filter(type => type != "");
                }
                return data;
            });
            // console.info("convertTreeData after",index,roomArr);
            return {
                floorNum:item.floorNum,
                roomArr,
            }
        });
        // console.info("convertTreeData",arr);
        return arr;
    }

    openFilterModal = () =>{
        this.modalSelect(true);
    }

    modalSelect = (flag) => {
        this.setState({
            modalVisible:flag
        });
    }
    //选择modal中的选项，选择不同的筛选条件
    filterSelectMethod = (item,index) => {
        let arr = [...this.state.filterCheckedArr];
        let newArr = arr.map(item => false); 
        newArr[index] = true;
        this.setState({
            data:[],
            filterCheckedArr:newArr
        });

        if(this.props.type == "all"){
            this.fetchData(index);
        }else{
            this.fetchData(this.state.houseColor[index].name);
        }
        this.modalSelect(false);
    }

    pressRoom = (roomItem) => {
        console.info("pressRoom",roomItem);
        // if(roomItem.length == 4){
        //     let i = roomItem[3].findIndex(obj => {
        //         return obj == "空置";
        //     });
        //     if( i >= 0) return;
        // }

        this.props.navigation.navigate("HouseDetail",{
            houseId:roomItem[0],
            houseName:roomItem[1],
        });
    }

    findColor = (item) => {
        let color = "#F8BDB9";
        if(item.length == 4){
            let type = item[3];
            if(item[3] instanceof Array){
                type = item[3][item[3].length-1];
            }
            let i = this.state.houseColor.findIndex(obj => {
                return obj.name == type;
            });
            color = i>=0 ? this.state.houseColor[i].colour : "#F8BDB9";
        }
        return color;
    }

    _renderItem = ({item,index}) => {
        return (
            <View style={[GlobalStyles.flexDirectRow]}>
                <View style={[styles.floorStyle,GlobalStyles.lineBlackBottom,GlobalStyles.center,GlobalStyles.containerBg]}>
                    <Text style={GlobalStyles.font14Gray}>{item.floorNum}</Text>
                </View>
                <View style={styles.houseContainer}>
                    {
                        item.roomArr.map(roomItem => {
                            let color = this.findColor(roomItem);
                            return (
                                <TouchableOpacity style={[styles.houseItem,GlobalStyles.lineBlackBottom,GlobalStyles.lineBlackRight,GlobalStyles.center,{backgroundColor:color}]} 
                                    key={`room-${roomItem[0]}-${index}`}
                                    onPress={() => this.pressRoom(roomItem)}>
                                    <Text style={GlobalStyles.font14Black}>{roomItem[1]}</Text>
                                    <Text style={[styles.houseTips,GlobalStyles.font12White]}>{roomItem[2]}</Text>
                                </TouchableOpacity>);
                        })
                    }
           
                </View>
            </View> 
        );
    }

    _renderEmptyComponent = () => {
        return (
            <View style={[GlobalStyles.center,GlobalStyles.mt40]}>
                <Text style={[GlobalStyles.font14Gray]}>无数据</Text>
            </View>
        );
    }

    render(){
        return (
            <View style={GlobalStyles.pageBg}>
                <View style={[styles.filterStyle,GlobalStyles.containerBg,GlobalStyles.pdlr15,GlobalStyles.flexDirectRow,GlobalStyles.center]}>
                    <View style={GlobalStyles.flex} />
                    <TouchableOpacity style={[GlobalStyles.flexDirectRow]} onPress={this.openFilterModal} >
                        <Text style={GlobalStyles.font14White}>筛选</Text>
                        <FontAwesome name={"filter"} size={20} color={Color.whiteColor} style={GlobalStyles.ml5} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={GlobalStyles.pdlr15}>

                     <FlatList
                          style={{marginBottom:15}}
                          ListEmptyComponent = {this._renderEmptyComponent}
                          data={this.state.data}
                          extraData={this.state}
                          keyExtractor={(item,index) => `floor-${index}`}
                          renderItem={this._renderItem}
                     />

                </ScrollView>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={ () => this.modalSelect(false)}>
                    <View style={[GlobalStyles.flex,GlobalStyles.blackAlpha50,GlobalStyles.flexDirectRow,{justifyContent:"flex-end"}]}>
                        <View style={[styles.modalStyle,GlobalStyles.containerBg]}>
                            <View  style={{justifyContent:"flex-end",flexDirection:"row"}}>
                                <TouchableOpacity onPress={() => this.modalSelect(false)} >
                                    <FontAwesome name={"close"} size={15} color={Color.whiteColor} style={{padding:10}} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView>
                            {
                                this.state.houseColor.map((item,index) => {
                                    return (
                                        <TouchableOpacity key={index} style={[styles.modalItem,GlobalStyles.justifyCenter]}
                                              onPress={() => this.filterSelectMethod(item,index)}>
                                            <View style={[GlobalStyles.flexDirectRow,GlobalStyles.alignCenter]}>
                                                { 
                                                   this.state.filterCheckedArr[index] ? 
                                                    <FontAwesome name={"check"} size={13} color={Color.whiteColor} style={GlobalStyles.mr10} />
                                                    :<View style={{width:13,marginRight:10}}></View>
                                                }
                                                <View style={[styles.modalColorItem,{backgroundColor:item.colour}]}></View>
                                                <Text style={[GlobalStyles.font14Gray,GlobalStyles.ml5]}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                            </ScrollView>
                            <Text onPress={() => this.modalSelect(false)} style={[GlobalStyles.flex]}></Text> 
                        </View>
                    </View>
                </Modal>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    filterStyle: {
       height:40,
       marginBottom:15,
    },
    floorStyle:{
        width:50,
        minHeight:47,
    },
    houseContainer:{
        flexDirection:"row",
        alignItems:"center",
        flexWrap:"wrap",
    },
    houseItem:{
        height:47,
        width: (width-15*2-50)/4,
        position:"relative",
        backgroundColor:"#F8BDB9",
    },
    houseTips:{
        position:"absolute",
        right:5,
        top:5,
        width:18,
        height:18,
        lineHeight:18,
        borderRadius:9,
        // backgroundColor:Color.blackAlpha50Color,
        backgroundColor:"#ccc",
        textAlign:"center",
    },
    modalStyle:{
        width:215,
        marginTop:135,
    },
    modalItem:{
        height:50,
        marginLeft:15,
    },
    modalColorItem:{
        width:15,
        height:12,
    }
 
});