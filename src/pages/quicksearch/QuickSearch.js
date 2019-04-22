import React, { Component } from 'react';
import {
    StyleSheet,
    View,Image,FlatList,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    Platform,
    ActivityIndicator,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import QuickSearchHeader from "./QuickSearchHeader";
import {width} from "../../utils/Common";
import API from "../../api/index";
import CommonFetch from "../../componets/CommonFetch";
import {getUserId} from "../../utils/Common";
import Color from "../../config/color";
import { Toast, Theme } from 'teaset';
export default class QuickSearch extends Component{

    static navigationOptions = ({navigation,screenProps}) => ({
        headerTitle: <QuickSearchHeader onSearch={navigation.getParam('searchMethod')}   />,
        headerStyle:{
            paddingTop:Platform.OS === "ios" ? 20 : 0,
            backgroundColor: Color.tabAndOtherBgColor,
            height:44,
            borderWidth:0,
        },
        headerTintColor: Color.fontColor,
    });
    
    constructor(props) {
        super(props);
        this.pageSize = 1;
        this.pageNum = 1;
        this.keyword = "";
        this.specialType = "";
        this.isSpecialType = false;
        this.state = {
            searchVisible:true,    
            data:[],
            total:0,
            loading:false,
        }
        getUserId().then(_userId => {
            this.userId = _userId;
        });
    }

    componentDidMount(){
        this.props.navigation.setParams({ searchMethod: this.searchMethod });
    }

    static customKey = null;

    showCustom() {
        if (QuickSearch.customKey) return;
        QuickSearch.customKey = Toast.show({
            text: '数据加载中...',
            icon: <ActivityIndicator size='large' color={Theme.toastIconTintColor} />,
            position: 'center',
            duration: 10000,
        });
    }

    hideCustom() {
        if (!QuickSearch.customKey) return;
        Toast.hide(QuickSearch.customKey);
        QuickSearch.customKey = null;
    }

    searchMethod = (keyword,isSpecialType,specialType) =>{

        this.keyword = keyword;
        this.pageSize = 20;
        this.pageNum = 1;
        
        this.isSpecialType  = isSpecialType;

        if(isSpecialType){ //特殊搜索
            this.specialType = specialType;
            this.setState({
                total:0,
                data:[],
            },() => {
                this.showCustom();
                this.fetchSpecialList("search");
            });
        }else{
            if(this.state.loading)return;
            
            this.setState({
                total:0,
                data:[],
                searchVisible:false,
            },() => {
                this.showCustom();
                this.fetchData("search");
            });
           
        }
        
    }

    fetchData = (type) => {
        if(this.state.loading)return;
        if( type != "search" && (this.pageSize * (this.pageNum-1) ) > this.state.total) return;  //最后一页
        this.setState({
            loading:true,
        });
        //分割 关键字
        let queryPair = {};
        if(this.keyword.indexOf(" ") > -1 ){
            let arr = this.keyword.split(" ");
            let query1 = arr[0],query2 = arr[1];
            if(arr.length > 2){
                query2 = arr.slice(1).join("");
            }
            queryPair = {
                userId:this.userId,
                query1,
                query2,
            }
        }else{
            queryPair = {
                userId:this.userId,
                query:this.keyword,
            }
        }
        let url = API.getQuickSearchList;
        let params = {init: 0,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            queryPair: queryPair,
        };
        console.info("getQuickSearchList params",params);
        CommonFetch.doFetch(url,params,(responseData) => {
            console.info("getQuickSearchList",responseData);
            if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                this.hideCustom();
                this.setState({
                    data:this.state.data.concat(responseData.data.list),
                    total:responseData.data.total,
                    loading:false,
                });
                this.pageNum++;
            }else{
                this.setLoading(false);
            }
        },null,() => {
            this.setLoading(false);
        },() => {
            this.setLoading(false);
        });
    }

    fetchSpecialList = (type) => {
        if(this.state.loading)return;
        if( type != "search" && (this.pageSize * (this.pageNum-1) ) > this.state.total) return;  //最后一页
        this.setState({
            loading:true,
        });
        let url = API.getQuickSearchSpecialList;
        let params = {init: 0,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            queryPair: {
                // userId:"001",
                userId:this.userId,
                type:this.specialType,
        }};
        console.info("getQuickSearchSpecialList params",params);
        CommonFetch.doFetch(url,params,(responseData) => {
            console.info("getQuickSearchSpecialList",responseData);
            if(responseData.data && responseData.data.list && responseData.data.list.length > 0){
                this.hideCustom();
                this.setState({
                    data:this.state.data.concat(responseData.data.list),
                    total:responseData.data.total,
                    loading:false,
                });
                this.pageNum++;
                
            }else{
                this.setLoading(false);
            }
        },null,() => {
            this.setLoading(false);
        },() => {
            this.setLoading(false);
        });
    }

    setLoading = (flag) =>{
        this.setState({
            loading:flag
        });
    }

    clickSearch = (type) => {
        let str = "";
        if(type == "1"){
            str = "70岁以上";
        }else if(type == "2"){
            str = "重点人员";
        }else if(type == "3"){
            str = "女性";
        }else if(type == "4"){
            str = "外国籍";
        }
        this.setState({
            searchVisible:false,
        });

        DeviceEventEmitter.emit('QuickSearch',str,type);
    }

    onEndReached = () => {
        if(this.isSpecialType){
            this.fetchSpecialList("onEndReached");
        }else{
            this.fetchData('onEndReached')
        }
    }
    _renderItem = ({item,index}) => {
        let startImg = null ;
        if(item.peopleType){
            startImg = (<Image source={require("../../../assets/images/five_star.png")} style={styles.fiveStartStyle} />)
        }
        return (
            <TouchableOpacity style={[GlobalStyles.flexDirectRow,styles.itemContainer,GlobalStyles.lineBottom]} 
                    onPress={() => this.props.navigation.navigate("QuickSearchDetail",{"params":item})}>
                    {
                        item.identyPhoto ? <Image source={{uri:item.identyPhoto}} style={styles.imgStyle}/>
                        :<Image source={require("../../../assets/images/idcard_default.png")} style={styles.imgStyle}/>
                    }
                    
                    <View style={styles.itemRightContainer}>
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10]}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>姓名：</Text>
                            <Text style={[GlobalStyles.flex,GlobalStyles.justifyCenter,GlobalStyles.font14Gray]}>{item.roomerName} {startImg}</Text>
                        </View>
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10]}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>联系方式：</Text>
                            <Text style={[GlobalStyles.flex,GlobalStyles.justifyCenter,GlobalStyles.font14Gray]}>
                            {item.callPhone}</Text>
                        </View>
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10]}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>联系地址：</Text>
                            <Text style={[GlobalStyles.flex,GlobalStyles.justifyCenter,GlobalStyles.font14Gray]}>
                            {item.roomAddress}</Text>
                        </View>

                    </View>
            </TouchableOpacity>
        );
    }


    render(){
        return (
            <View style={[GlobalStyles.pageBg,{paddingBottom:15,}]}>
                
                { !this.state.searchVisible ? 
                    <View>
                        <View style={[GlobalStyles.containerBg,styles.countContainer,GlobalStyles.pdlr15]}>
                            <Text style={GlobalStyles.font12White}>共计{this.state.total}条记录</Text>
                        </View>
                        <FlatList
                            style={{marginBottom:15,}}
                            renderItem={this._renderItem}
                            data={this.state.data}
                            extraData={this.state}
                            keyExtractor={(item,index) => `serach-${index}`}
                            onEndReachedThreshold={0.2}
                            onEndReached={  this.onEndReached }
                        />
                    </View>
                    :null
                }

                {this.state.searchVisible ? (<View style={[GlobalStyles.alignCenter,{marginTop:60}]}>
                        <Text style={[GlobalStyles.font12White,{marginBottom:20}]}>搜索指定内容</Text>
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.center]}>
                            <TouchableOpacity onPress={() => this.clickSearch("1")}>
                                <Text style={[GlobalStyles.font14White,styles.specialStyle]}>70岁以上</Text>
                            </TouchableOpacity>
                            <View style={styles.lineStyle}></View>
                            <TouchableOpacity onPress={() => this.clickSearch("2")}>
                                <Text style={[GlobalStyles.font14White,styles.specialStyle]}>重点人员</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.center,GlobalStyles.mt10]}>
                            <TouchableOpacity onPress={() => this.clickSearch("3")}>
                                <Text style={[GlobalStyles.font14White,styles.specialStyle]}>女性</Text>
                            </TouchableOpacity>
                            <View style={styles.lineStyle}></View>
                            <TouchableOpacity onPress={() => this.clickSearch("4")}>
                                <Text style={[GlobalStyles.font14White,styles.specialStyle]}>外国籍</Text>
                            </TouchableOpacity>
                        </View> 
                    </View> ) :null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    specialStyle:{
        width:60,
    },
    lineStyle:{
        width:1,
        height:10,
        backgroundColor:"#eee",
        marginLeft:15,
        marginRight:15,
    },
    countContainer:{
        height:37,
        justifyContent:"center",
        alignItems:"flex-start",
        paddingRight:15,
    },
    itemContainer:{
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:30,
        paddingRight:30,
    },
    imgStyle:{
        width:90,
        height:100,
        borderRadius:4,
        marginRight:15,
    },
    itemRightContainer:{
        flexBasis:(width - 30 - 30 - 90 - 15),
    },
    fiveStartStyle:{
        width:15,
        height:15,
        marginLeft:5,
    }
});