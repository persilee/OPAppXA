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
import ItemInput from '../../componets/ItemInput';
import Color from "../../config/color";
import Communications from 'react-native-communications';

@inject('User')
@observer
export default class RealUnit extends Component{

    static navigationOptions = ({navigation,screenProps}) => ({
        headerTitle: (<Text style={{fontSize:20,color:"#fff",flex: 1, textAlign: 'center'}}>{navigation.getParam('houseName', '')}详情</Text>),
    });

    constructor(props) {
        super(props);
     //   this.houseId = this.props.navigation.getParam('houseId', '');
        this.state = {
            userId: this.props.User.userId,
            selectTree: false,
            type: '',
            keyword: '',
            disType: '全部',
            queryKey: '',
            typeData: [],
            data: [],
            itemIndex: 0,
        }
    }

    componentDidMount() {
        this.initTypeData();
        this.queryData();
    }

    initTypeData = () => {
        
        let params={
               queryPair: {
                    }
                };
        CommonFetch.doFetch(RoutApi.getRealUnitTypeData,params,this.dealResponseTypeData,this.refs.toast);

    }

    dealResponseTypeData=(responseData)=>{
        console.log('responseData',responseData);
        this.setState({
            typeData:responseData.data.list
        })
        console.log(this.state.typeData);
        this.state.typeData.unshift({
            bd: '',
            btype: '全部',
            sfid: "0",
            childData: []
        })
        console.log(this.state.typeData);
    }

    queryData = () => {
        let params={
           queryPair: {
                query: this.state.keyword,
                // userId:'001',
                userId:this.props.User.userId,
                type:this.state.queryKey,
        }};
        CommonFetch.doFetch(RoutApi.getRealUnitList,params,this.dealResponseData,this.refs.toast);

    }

    dealResponseData=(responseData)=>{
        console.log('responseData',responseData);
        this.setState({
            data:responseData.data.list
        })
        console.log(this.state.data);
    }
    _onPressShowQueryType = () => {
        this.setState({
            selectTree: !this.state.selectTree,
        })
    };

    headerPress1 = (unitId) => {
        let nParam = {
            unitId: unitId
        }
        this.props.navigation.navigate('EmployeeInfo',nParam);
    }
    doSearch = ()=>{
        this.setState({
            selectTree: false,
            data:[],
        },this.getList)
    }

    getList = () =>{
        this.queryData();
    }
    
    _renderSectionHeader = ({item,index}) => {

        return (

            <TouchableOpacity onPress={() => this.headerPress1(item.id)}>
                <View style={[GlobalStyles.containerBg,styles.itemContainer]}>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                                <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>单位名称：</Text>
                                <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.unitName == null ? '' : item.unitName.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>经营范围：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.type == null ? '' : item.type.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>从业人数：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.personNum}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>法人姓名：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.legalName == null ? '' : item.legalName.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>法人手机号：</Text>                     
                        {item.legalPhone == '' ? (
                            <Text></Text>
                        ) : (
                                <TouchableOpacity onPress={() => Communications.phonecall(item.legalPhone, true)}>
                                    <Text style={[GlobalStyles.font14Blue]}>{item.legalPhone} &nbsp;<FontAwesome name="phone" color={Color.btnColor} size={14} /></Text>
                                </TouchableOpacity>
                        )}
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>法人身份号：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.legalCardId == null ? '' : item.legalCardId.replace('\n', '')}</Text>
                    </View>
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mb5]}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr5]}>单位地址：</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{item.unitAddress == null ? '' : item.unitAddress.replace('\n', '')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    headerPress = (item,index) =>{

        let list = [...this.state.typeData];
        list.map((item,ind)=>{
            if(ind == index){
                item.expanded = !item.expanded;
            }else{
                item.expanded = false;
            }
        })
        this.setState({
            typeData:list,
            disType: item.btype,
            queryKey: item.bd,
        });
        if(item.bd == ''){
            this.setState({
                selectTree: false,
            });
        }
        this.uncheckedAll();
    }

    uncheckedAll = () =>{
        let list = [...this.state.typeData];
        list[this.state.itemIndex].childData.map((subItem,ind)=>{        
                subItem.checked = false;
        });
    }

    _renderItem = ({item,index}) =>{
        return (

             <View>
                <TouchableOpacity key={index} style={[GlobalStyles.flexDirectRow,GlobalStyles.center,
                    GlobalStyles.pageBg1,styles.firstItemStyle,GlobalStyles.lineBottom,GlobalStyles.pdlr15]}
                     onPress={() => this.headerPress(item,index)}>
                    <Text style={[GlobalStyles.flex,GlobalStyles.font14Gray]}>{item.btype}</Text>
                    <FontAwesome name={item.expanded?"angle-down":"angle-right"} color={Color.whiteColor} size={24} />
                </TouchableOpacity>
                <View style={[GlobalStyles.flexDirectColumn]}>
                    {
                        item.expanded ? item.childData.map( (subItem,sIndex) => {
                            return this._subRenderItem(subItem,sIndex, item, index);
                        }) : null
                    }
                </View>
            </View>
        )
    }
    _subRenderItem = (subItem,sIndex,firstItem,firstIndex) => {
        return (
            <TouchableOpacity key={sIndex} style={[GlobalStyles.flexDirectRow,GlobalStyles.alignCenter,
                styles.subItemStyle,GlobalStyles.pageBg1,GlobalStyles.lineBottom,GlobalStyles.pdlr15]}
                onPress={() => this.itemPress(subItem,sIndex,firstItem,firstIndex)}>
                <View style={[GlobalStyles.flexDirectRow,GlobalStyles.center]}>
                    <Text style={[GlobalStyles.font14Gray,GlobalStyles.flex]}>{subItem.stype}</Text>
                    {subItem.checked ? 
                        <FontAwesome name={"check"} size={16} color={Color.whiteColor} style={{marginLeft:15}} /> 
                        : null }
                </View>
            </TouchableOpacity>
        );
    }

    itemPress = (sItem,sIndex,firstItem,firstIndex) => {
      
        let list = [...this.state.typeData];

        list[firstIndex].childData.map((subItem,ind)=>{
            if(ind == sIndex){
                subItem.checked = !subItem.checked;
            }else{
                subItem.checked = false;
            }
        });
        this.setState({
            disType: sItem.stype,
            queryKey: sItem.ds,
            selectTree: false,
            itemIndex: firstIndex,
        });
        this.doSearch();
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
                    <TouchableOpacity onPress={this._onPressShowQueryType}>
                        <View style={styles.headerS1}>
                            <Text style={[GlobalStyles.font14White]}>{this.state.disType}</Text>
                            <FontAwesome name={"angle-down"} color={Color.whiteColor} size={14}
                                         style={{marginTop: 3, marginLeft: 4}}/>
                        </View>
                    </TouchableOpacity>

                     <CommonSearch placeholder={'请输入关键字'} placeholderTextColor={Color.whiteColor} 
                                style={[GlobalStyles.pageBg,GlobalStyles.borderColor,{borderWidth:1}]}
                                onChangeText={(keyword) => this.setState({keyword:keyword})}
                                onSubmitEditing={this.doSearch}
                                autoFocus={false}></CommonSearch>
                    <TouchableOpacity style={styles.searchButton} onPress={this.doSearch}>
                        <Text style={[GlobalStyles.font14White]}>搜索</Text>
                    </TouchableOpacity>
             
                </View>
                {
                    this.state.selectTree == false?(<FlatList
                        ListEmptyComponent = {this._renderEmptyComponent}
                    keyExtractor={(item, index) => `unit-${index}`}
                    renderItem={this._renderSectionHeader}
                    data={this.state.data}
                />):(
                        <FlatList
                            keyExtractor={(item, index) => index+''}
                            data={this.state.typeData}
                            renderItem={this._renderItem}
                        />

                    )

                }
               
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
    firstItemStyle:{
        height:48,
    },
    subItemStyle:{
        height:40,
    },

});