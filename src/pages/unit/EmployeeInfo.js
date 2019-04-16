import React, { Component } from 'react';
import {
    StyleSheet,FlatList,
    View,
    Text,
    Image,
    TouchableOpacity,Alert,
    Platform,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import API from "../../api/index";
import {groupBy} from "../../utils/Utils";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {observer,inject} from 'mobx-react/native'
import RoutApi from '../../api/index';
import CommonFetch from "../../componets/CommonFetch";
import Toast, {DURATION} from 'react-native-easy-toast';
import CommonSearch from "../../componets/CommonSearch";
import Color from "../../config/color";
@inject('User')
@observer
export default class RealUnit extends Component{

    static navigationOptions = ({navigation,screenProps}) => ({
        headerTitle: (<Text style={[GlobalStyles.font20White,GlobalStyles.taCenter]}>{navigation.getParam('houseName', '')}详情</Text>),
    });

    constructor(props) {
        super(props);
        this.state = {
            unitId: this.props.navigation.getParam('unitId', ''),//企业ID
            keyword: "",
            data: [],
        }
    }

    componentWillMount() {
        this.queryData();
    }

    queryData = () => {
        let params={
           queryPair: {
               unitId:this.state.unitId,
               query: this.state.keyword,
        }};
        CommonFetch.doFetch(RoutApi.getEmployeeByUnitId,params,this.dealResponseData,this.refs.toast);
    }

    dealResponseData=(responseData)=>{
        console.log('responseData', responseData);
        this.setState({
            data:responseData.data.list
        })
        console.log(this.state.data);
    }
    
    doSearch = ()=>{
        this.setState({
            data:[],
        },this.getList)
    }

    getList = () =>{
        this.queryData();
    }
    _renderSectionHeader = ({item,index}) => {
        
        let idCardImgPath = item.identyPhoto?null: "../../../assets/images/police_badge.png";

        return (
                <View style={[GlobalStyles.containerBg,styles.itemContainer]}>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10]}>
                        <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb10]}>
                        {item.identyPhoto ? <Image source={{uri:item.identyPhoto,cache:true}} style={styles.imgStyle}/>
                        : <Image source={require("../../../assets/images/idcard_default.png")} style={styles.imgStyle}/> }
                        {item.imgUrl ? <Image source={{uri:item.imgUrl,cache:true}} style={[styles.imgStyle,{marginLeft:40}]}/>
                        : <Image source={require("../../../assets/images/image_default.png")} style={[styles.imgStyle,{marginLeft:40}]}/> }
                    </View>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                                <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>姓名：</Text>
                                <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.name == null ? '' : item.name.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>名族：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.nation == null ? '' : item.nation.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>联系电话：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.phone == null ? '' : item.phone.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>身份证号码：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.cardNumber == null ? '' : item.cardNumber.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>暂住地址：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.livePlace == null ? '' : item.livePlace.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>户籍地址：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.housePlace == null ? '' : item.housePlace.replace('\n', '')}</Text>
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

    _keyExtractor = (item, index) => index.toString();

    render(){
        return (
            <View style={GlobalStyles.pageBg}>
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
                    keyExtractor={(item, index) => `unit-${index}`}
                    ListEmptyComponent = {this._renderEmptyComponent}
                    renderItem={this._renderSectionHeader}
                    data={this.state.data}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    itemContainer:{
        borderRadius:8,
        elevation:2,
        margin:15,
        marginBottom:24,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:15,
        paddingBottom:15,
    },
    searchView:{
        height:48,
        paddingLeft: 20,
        paddingRight: 15,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    searchButton:{
        marginLeft: 5,
        height: 30,
        width:43,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },
    headerS1: {
        marginTop: 15,
        marginRight: 10,
        flexDirection: "row",
        flex: 1.5,
        justifyContent: "center",
        marginLeft: 5
    },
    imgStyle:{
        width:106,
        height:123,
    }
});