import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,
    View,Modal,FlatList,
    Text,ImageBackground,
    TouchableOpacity,TouchableWithoutFeedback,
} from 'react-native';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Toast, {DURATION} from 'react-native-easy-toast';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import API from "../../api/index";
import {groupBy} from "../../utils/Utils";
import {getUserId} from "../../utils/Common";
import Color from "../../config/color";
import { observer, inject } from 'mobx-react';
import Loading from '../../componets/Loading';
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;


@inject('User')
@observer
export default class HouseReal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            statusVisible: false,
            modalData:{},
            loading: true,
        };
    
    }
    
    componentDidMount(){
        Loading.showCustom();
        getUserId().then(_userId => {
            this.userId = _userId;
            this.fetchData();
        });
    }

    fetchData = () => {
        let url = API.getHouseList
        let params = {init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                // userId: "001",
                userId:this.userId,
        }};
        let requestParams = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'areaKey': this.props.User.areaKey
                },
                body:JSON.stringify(params)
            };
        console.info("getHouseList params:"+JSON.stringify(params));
         fetch(url,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'areaKey': this.props.User.areaKey
                },
                body:JSON.stringify(params)
            })
            .then(response => response.json())
            .then(responseData => {
                console.info("requestParams",requestParams);
                console.info("getHouseList",responseData);
                if (responseData.data && responseData.data.list) {
                    let data = this.convertTreeData(responseData.data.list);
                    this.setState({
                        data: data,
                        loading: false,
                    });
                }
                Loading.hideCustom();
            }).catch( err => {
                console.log(err);
            });      
    }
    /**
     * 数据转换成树结构
     * @param {*} list 
     */
    convertTreeData(list){
        /*数据格式
        [
            {areaId:"1",areaName:'红谷凯旋小区',expanded:false,data:[
                {buidingId:'1',buidingName:'01栋',expanded:false,data:[
                    {"areaId": "5206", "unitName": "02单元","areaName": "红谷凯旋小区", "buidingId": "1001",
                     "buidingName": "1栋", "unitId": "467194",checked:false},
                    {"areaId": "5206", "unitName": "02单元","areaName": "红谷凯旋小区", "buidingId": "1001",
                     "buidingName": "1栋", "unitId": "467194",checked:false},
                ]} ,
            ]
            },
        ];
        */
        let arr = [];
        if(list.length > 0){
            let sorted = groupBy(list, function (item) {
                return [item.areaId];
            });
            let newArr = sorted.map(buildList => {
                buildList.length > 0 && arr.push({
                    areaId:buildList[0].areaId,
                    areaName:buildList[0].areaName,
                    expanded:false,
                    data:[],
                });
                return groupBy(buildList, function (item) {
                    return [item.buidingId];
                });
            });
            newArr.forEach((buildList,index) => {
                buildList.forEach(unitList => {
                    let unitArr = unitList.map(item => {
                        return Object.assign({},item,{checked:false});
                    });
                    unitList.length > 0 && arr[index].data.push({
                        buidingId:unitList[0].buidingId,
                        buidingName:unitList[0].buidingName,
                        expanded:false,
                        data:unitArr,
                    });
                });
            });
        }
        console.info("convertTreeData arr ",arr);
        return arr;
    }

    handlerSectionHeader = (item,index) => {
        let list = [...this.state.data];
        //先判断section是第几个，然后再判断
        // let i = list.findIndex((sectionItem) => {
        //     return sectionItem.areaId  == info.areaId;
        // });
        list[index].expanded = !list[index].expanded;
        this.setState({
            data:list
        });
    };

    _renderSectionHeader = ({item,index}) => {
        return (
            <View key={item.areaId}>
                <TouchableOpacity style={[GlobalStyles.flexDirectRow,GlobalStyles.center,GlobalStyles.containerBg,
                    styles.firstItemStyle,GlobalStyles.lineBlackBottom,GlobalStyles.pdlr15]}
                    onPress={() => this.handlerSectionHeader(item,index)}>
                    <Text style={[GlobalStyles.flex,GlobalStyles.font14Gray]}>{item.areaName}</Text>
                    <FontAwesome name={item.expanded?"angle-down":"angle-right"} color={Color.whiteColor} size={24} />
                </TouchableOpacity>
                <View style={[GlobalStyles.flexDirectRow,{flex:12,flexWrap: 'wrap',paddingTop:10,paddingLeft:20}]}>
                    {
                        item.expanded ? item.data.map( (secondItem,secondIndex) => {
                            return this._renderSecondItem(secondItem,secondIndex,item,index);
                        }) : null
                    }
                </View>
            </View>
        );
    }

    _renderSecondItem = (secondItem,secondIndex,firstItem,firstIndex) =>{
       //如果buidingName为undefined （解决空数据section之间不显示问题）
        if (secondItem.buidingName == undefined){
            return(
                <View key={secondIndex}>
                </View>
            );

        }else {
            return (
                <View key={secondIndex} style={[{marginLeft:20,marginTop:20,},styles.houseIm]}>
                    <TouchableOpacity onPress={()=>this.showThirdItem(secondItem,secondIndex,firstItem,firstIndex)}>
                        <ImageBackground source={require("../../../assets/images/house_blue.png")} style={[{height:50,width:50},GlobalStyles.flexDirectColumn]} >
                            <View style={[{marginTop:20,marginLeft:15}]}>
                                <Text style={[GlobalStyles.font14Gray]}>{secondItem.buidingName}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    showThirdItem = (secondItem,secondIndex,firstItem,firstIndex)=> {
        let data = {
            secondItem:secondItem,
            secondIndex:secondIndex,
            firstItem:firstItem,
            firstIndex:firstIndex
        };

        this.setState({
            modalData:data
        });
        this.statusSelect(true);
    }

    // renderThirdItem = (thirdItem,thirdIndex,secondItem,secondIndex,firstItem,firstIndex) => {
    //     return (
    //         <TouchableOpacity key={thirdIndex} style={[GlobalStyles.flexDirectRow,GlobalStyles.alignCenter,
    //              GlobalStyles.pageBg1, GlobalStyles.lineBottom,
    //             styles.subItemStyle,GlobalStyles.pdlr15]}
    //             onPress={() => this.itemPress(thirdItem,thirdIndex,secondItem,secondIndex,firstItem,firstIndex)}>
    //             <View style={[GlobalStyles.flexDirectRow,GlobalStyles.center]}>
    //                 <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{thirdItem.unitName}</Text>
    //                 {thirdItem.checked ?
    //                     <FontAwesome name={"check"} size={16} color={Color.whiteColor} style={{marginLeft:15}} />
    //                     : null }
    //             </View>
    //         </TouchableOpacity>
    //     );
    // }
    //
    // secondHeaderPress = (secondItem,secondIndex,firstItem,firstIndex) =>{
    //     //ListView有点特殊，必须修改datasource才会更新
    //     let list = [...this.state.data];
    //
    //     list[firstIndex].data.forEach((item,ind)=>{
    //         if(ind == secondIndex){
    //             item.expanded = !item.expanded;
    //         }else{
    //             item.expanded = false;
    //         }
    //     });
    //
    //     this.setState({
    //         data:list
    //     });
    // }


    itemPress = (thirdItem,thirdIndex,secondItem,secondIndex,firstItem,firstIndex) => {
        //ListView有点特殊，必须修改datasource才会更新
        let list = [...this.state.data];

        list[firstIndex].data[secondIndex].data.map((subItem,ind)=>{
            if(ind == thirdIndex){
                subItem.checked = !subItem.checked;
            }else{
                subItem.checked = false;
            }
        });
        this.setState({
            data:list
        });
        let selectedItem = list[firstIndex].data[secondIndex].data[thirdIndex];
        const { navigate } = this.props.navigation;
        navigate('HouseEmphasis',{
            unitId:selectedItem.unitId,
            name:`${selectedItem.buidingName}${selectedItem.unitName}`,
        });
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

    statusSelect=(flag)=>{
        this.setState({
            statusVisible:flag
        })
    }


    render(){
        return (
            <ScrollView style={GlobalStyles.pageBg}>
                <FlatList
                    renderItem={this._renderSectionHeader}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={(item,index) => `area-${index}`}
                    ListEmptyComponent = { this._renderEmptyComponent }
                />


                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.statusVisible}
                    onRequestClose={() => this.statusSelect(false)}>
                    <TouchableWithoutFeedback onPress={() => this.statusSelect(false)}>
                        <View style={[GlobalStyles.flex, GlobalStyles.center, GlobalStyles.blackAlpha50]}>
                            <View style={[styles.modalStyle, GlobalStyles.containerBg]}>
                                {
                                    this.state.modalData.secondItem!=null?(this.state.modalData.secondItem.data).map((thirdItem,thirdIndex) => {
                                        return   <TouchableOpacity style={[GlobalStyles.center, GlobalStyles.h50, GlobalStyles.lineBlackBottom]} key={thirdIndex}
                                                                 onPress={() => {
                                                                     this.itemPress(thirdItem,thirdIndex,this.state.modalData.secondItem,this.state.modalData.secondIndex,this.state.modalData.firstItem,this.state.modalData.firstIndex)
                                                                     this.statusSelect(false)
                                                                 }}>
                                            <Text style={[GlobalStyles.font15Gray]}>{thirdItem.unitName}</Text>
                                        </TouchableOpacity>
                                    }):<View>无数据</View>
                                }
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Toast ref="toast" position={"center"}  fadeInDuration={1000} />

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    firstItemStyle:{
        height:48,
    },
    subItemStyle:{
        height:40,
    },
    modalStyle:{
        width:280,
        borderRadius: 8,
    },
    houseIm:{
        width: (ScreenWidth-170)/5,
    }
});