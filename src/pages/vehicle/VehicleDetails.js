import React from 'react';
import {
    StyleSheet, Image,
    Text, TouchableOpacity,
    View, FlatList, Modal
} from 'react-native';

import {createAppContainer} from 'react-navigation';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonSearch from "../../componets/CommonSearch";
import Toast from 'react-native-easy-toast';
import CommonFetch from "../../componets/CommonFetch";
import RoutApi from '../../api/index';
import {observer,inject} from 'mobx-react';
import Color from "../../config/color";
@inject('User')
@observer
export default class VehicleDetails extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            selectViewShow: false,
            statusVisible: false,
            data: [],
            modalImgUrl:null,
            queryType: [
                {key: "vehicleOwner", val: "车主姓名"},
                {key: "callPhone", val: "车主电话"},
                {key: "vehicleNo", val: "车牌号码"},
                // {key: "areaName", val: "小区名称"}
            ],
            pageNum: 1,
            pageSize: 10,
            totalNum: -1,
            loading: true,
        }
    }

    componentWillMount() {
        this.state.currentQueryType = this.state.queryType[0];
        console.log("初始化设置查询类型")
    }

    componentDidMount() {
        this.doFetch();
        console.log("初始化查询数据")
    }


    _onPressButtonSearch = () => {
        console.log("点击开始查询");
        this.state.queryText=this.state.text;
        this.state.data=[];
        this.state.pageNum = 1;
        this.state.pageSize = 10;
        this.state.totalNum = -1;
        this.doFetch();
    };

    _onPressQueryType = (item, index) => {
        this.state.currentQueryType = item;
        this.state.text = "";
        this.state.data= [];
        this.setState({
            text:"",
        });
        this._onPressButtonSearch()
        this._onPressShowQueryType();
    }

    _onPressShowQueryType = () => {
        this.setState({
            selectViewShow: !this.state.selectViewShow,
        });

    };

    getList = () => {
        if (this.state.totalNum == -1 || this.state.totalNum > this.state.pageNum * this.state.pageSize) {
            this.state.pageNum = this.state.pageNum + 1;
            this.doFetch();
        }
    }


    doFetch = () => {
        let queryParam = this.props.navigation.getParam('queryParam', {});
        let params = {
            init: 0,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            queryPair: {
                userId: this.props.User.userInfo.userId,
                sname: queryParam.name2,
                areaName: queryParam.areaName,
            },
            loading: false
        };
        if (this.state.queryText != null) {
            params.queryPair[this.state.currentQueryType.key] = this.state.queryText;
        }
        console.log("查询参数:" + JSON.stringify(params))
        CommonFetch.doFetch(RoutApi.getVehicleDetails, params, this.dealResponseData, this.refs.toast)
    }

    dealResponseData = (responseData) => {
        let resData = [];
        if (undefined != responseData.data.list) {
            resData = responseData.data.list;
        }

        let data = this.state.data.concat(resData);
        console.log(JSON.stringify(data))
        this.setState({
            data: data,
            totalNum: responseData.data.total
        })
        console.log("返回总数:" + responseData.data.total)
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


    _renderQueryItem = ({item, index}) => {
        return (
            <TouchableOpacity
                style={[GlobalStyles.flexDirectRow,GlobalStyles.center,GlobalStyles.pageBg1,
                    styles.firstItemStyle,GlobalStyles.pdlr15,GlobalStyles.lineBottom]}
                onPress={() => {
                this._onPressQueryType(item, index)
            }}>
                <Text style={[GlobalStyles.flex,GlobalStyles.font14Gray]}>{item.val}</Text>
            </TouchableOpacity>
        )
    }

    statusSelect=(flag)=>{

        this.setState({
            statusVisible:flag
        })
    }

    showImageModal = (url) =>{
        console.log("showImageModal")
        this.setState({
            modalImgUrl:url,
        });
        this.statusSelect(true)
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={[GlobalStyles.containerBg,styles.itemStyle,GlobalStyles.flexDirectRow, {alignItems:"center"}]}>
                <TouchableOpacity onPress={()=>this.showImageModal(item.vehicleImgUrl)}>
                    <Image
                        style={{width: 120, height: 120, marginLeft: 20}}
                        resizeMode={'cover'}
                        source={item.vehicleImgUrl?{uri: item.vehicleImgUrl}:require("../../../assets/images/vehicle_blue.png")}
                    />
                </TouchableOpacity>
                <View>
                    <View style={[styles.itemRowStyle,{marginTop:15}]}>
                        <Text style={[GlobalStyles.font14Gray]}>车主姓名：</Text>
                        <Text style={[GlobalStyles.font14Gray]}>{item.vehicleOwner}</Text>
                    </View>
                    <View style={styles.itemRowStyle}>
                        <Text style={[GlobalStyles.font14Gray]}>车主电话：</Text>
                        <Text style={[GlobalStyles.font14Gray]}>{item.callPhone}</Text>
                    </View>
                    <View style={styles.itemRowStyle}>
                        <Text style={[GlobalStyles.font14Gray]}>车牌号码：</Text>
                        <Text style={[GlobalStyles.font14Gray]}>{item.vehicleNo}</Text>
                    </View>
                    <View style={styles.itemRowStyle}>
                        <Text style={[GlobalStyles.font14Gray]}>登记时间：</Text>
                        <Text style={[GlobalStyles.font14Gray]}>{item.createTime}</Text>
                    </View>
                    {
                        !this.props.navigation.getParam('queryParam', {}).areaName?(
                            <View style={[styles.itemRowStyle,{marginBottom:15}]}>
                                <Text style={[GlobalStyles.font14Gray]}>小区名称：</Text>
                                <Text style={[GlobalStyles.font14Gray]}>{item.areaName}</Text>
                            </View>):null
                    }
                </View>


            </View>

        )
    }


    render() {
        return (<View style={GlobalStyles.pageBg}>
            <View style={[styles.searchView,GlobalStyles.containerBg]}>
                <TouchableOpacity onPress={this._onPressShowQueryType}>
                    <View style={styles.headerS1}>
                        <Text style={[GlobalStyles.font14White]}>{this.state.currentQueryType.val}</Text>
                        <FontAwesome name={"angle-down"} color={Color.whiteColor} size={14}
                                     style={{marginTop: 3, marginLeft: 4}}/>
                    </View>
                </TouchableOpacity>

                <CommonSearch placeholder={'请输入关键字'} placeholderTextColor={Color.whiteColor}
                              style={[GlobalStyles.pageBg,GlobalStyles.borderColor,{borderWidth:1}]}
                              value={this.state.text}
                              onChangeText={(text) => this.setState({text})}
                              onSubmitEditing={this._onPressButtonSearch}
                              autoFocus={false}
                ></CommonSearch>

                <TouchableOpacity style={styles.searchButton} onPress={(item) => this._onPressButtonSearch()}>
                    <Text style={[GlobalStyles.font14White]}>搜索</Text>
                </TouchableOpacity>

            </View>
            {
                this.state.selectViewShow == false ? (
                    <FlatList
                        ListEmptyComponent = {this._renderEmptyComponent}
                        data={this.state.data}
                        keyExtractor={(item, index) => index + ""}
                        renderItem={this._renderItem}
                        onEndReached={this.getList}
                    />

                ) : (
                    <FlatList
                        // initialNumToRender={10}
                        data={this.state.queryType}
                        keyExtractor={(item, index) => item.vehicleNo + "" + index}
                        renderItem={this._renderQueryItem}
                    />

                )

            }
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.statusVisible}
                onRequestClose={() => this.statusSelect(false)}>
                <View style={[GlobalStyles.flex, GlobalStyles.center,styles.modalStyle]}>
                    <TouchableOpacity
                        onPress={()=>this.statusSelect(false)}
                    >
                        <Image
                            style={{width: 400, height: 500, marginLeft: 20}}
                            resizeMode={'contain'}
                            source={this.state.modalImgUrl?{uri: this.state.modalImgUrl}:require("../../../assets/images/vehicle_blue.png")}
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
            <Toast ref="toast" style={{backgroundColor: '#EEE'}} textStyle={{color: '#333'}} position={"center"}
                   fadeOutDuration={1000} opacity={0.8}/>
        </View>)
    }

}


const styles = StyleSheet.create({
    searchView:{
        height:48,
        paddingLeft: 20,
        paddingRight: 15,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    searchButton:{
        height: 30,
        width:43,
        marginLeft: 15,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },
    queryTypeStyle: {
        marginLeft: 50,
        marginTop: 15,
        marginBottom: 20,
        fontSize: 20,
    },
    headerS1: {
        marginTop: 15,
        marginRight: 10,
        flexDirection: "row",
        flex: 1.5,
        justifyContent: "center",
        marginLeft: 5
    },
    itemRowStyle: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 5,
        marginLeft: 30,
    },
    // page: {
    //     height: "100%",
    //     backgroundColor: '#FFF',
    //     flexDirection: "column",
    //     justifyContent: "flex-start",
    //     alignItems: "center",
    //     paddingLeft: 20,
    //     paddingRight: 20
    // },
    searchViewStyle: {
        marginTop: -6,
        marginBottom: 20,
        marginLeft: 5,
        marginRight: 15,
        flex: 7,
        // justifyContent: "center",
    },
    itemStyle: {
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
        elevation: 20,
        borderWidth: 1,
        borderColor:Color.blackAlpha50Color,
        borderRadius: 8,
    },
    firstItemStyle:{
        height:48,
    },
    modalStyle:{
        marginLeft:200,
        marginRight:200,
        borderRadius: 8,
    },
});