import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import CommonSearch from "../../componets/CommonSearch";
import CommonFetch from "../../componets/CommonFetch";
import RoutApi from '../../api/index';
import Toast, {DURATION} from 'react-native-easy-toast';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getUserId} from "../../utils/Common";
import Color from "../../config/color";
import CommonBtn from '../../componets/CommonBtn';
import { RadioButton } from 'react-native-paper';
import { Toast as TeasetToast } from 'teaset';
export default class  CheckList extends Component {

    static navigationOptions = ({navigation,screenProps}) => ({
        headerTitle: (<Text style={[GlobalStyles.font20White,GlobalStyles.taCenter,GlobalStyles.flex]}>{navigation.getParam('name', '')}</Text>),
    });

    constructor(props) {
        super(props);

        let queryParam = this.props.navigation.getParam('queryParam', {});
        this.state = {
            type: this.props.navigation.getParam('type', {}),
            data:[],
            areaName:queryParam.areaName!='全部'?queryParam.areaName:'',
            provinceId:queryParam.sfid!=0?queryParam.sfid:'',
            pageNo:1,
            pageSize:10,
            totalNum:-1,
            keyword:'',
            searchFlag:false,
            loading: true,
            modalVisible: false,
            text: '',
            checked: 'normal',
            CheckReason: '',
            checkType: 0,
            checkResult: 0,
        }
    }

    componentDidMount(){
        getUserId().then(_userId => {
            this.userId = _userId;
            this.getList();
        });
    }

    onCheck = (value) => {
        if(value == 'normal' ){
            this.setState({
                checkResult: 0
            })
        }else if(value == 'abnormal'){
             this.setState({
                checkResult: 1
            })
        }

    }

    openFilterModal = (item) => {
        this.setState({
            CheckReason: item.BuildingName + item.RoomName + ': ' + this.props.navigation.getParam('name', {})
		});
		this.modalSelect(true);
    }
    
    modalSelect = (flag) => {
        console.log(flag);
		this.setState({
            modalVisible: flag
		});
    };
    
    cancelTasks = () => {
		this.setState({
			text: ''
		});
		this.modalSelect(false);
	}

    doSearch = ()=>{
        if(!this.state.searchFlag){
            this.state.searchFlag = true;
            this.setState({
                data:[],
                pageNo:1,
                pageSize:10,
                totalNum:-1,
            },this.getList)
        }
        
    }


    getList = () =>{
        if(this.state.totalNum == -1 || this.state.totalNum > (this.state.pageNo-1)*this.state.pageSize){
            this.doFetch();
            this.state.pageNo = this.state.pageNo+1;
        }
    }

    /**
    *查询数据
    */
    doFetch = () => {
        let params={
            init: 0,
            pageNum: this.state.pageNo,
            pageSize: this.state.pageSize,
            queryPair: {

            }};
        let url = '';

        if(this.state.type == 'Emphasis') {
            url = RoutApi.getEmphasisList;
            this.setState({
                checkType: 0
            })
        }else if(this.state.type == 'Vacancy') {
            url = RoutApi.getVacancyList;
            this.setState({
                checkType: 1
            })
        }else if(this.state.type == 'MultiUser') {
            url = RoutApi.getMultiUserList;
            this.setState({
                checkType: 2
            })
        }

        CommonFetch.doFetch(url,params,this.dealResponseData,this.refs.toast)
    }

    dealResponseData=(responseData)=>{

        let data = this.state.data;
        if(responseData.data.list){
            data =  data.concat(responseData.data.list);
        }
        console.log('responseData',data);
        this.setState({
            data:data,
            totalNum:responseData.data.total,
            searchFlag:false,
            loading: false
        })
    }


    doCheck = () => {
		let params = {
			feedRemark: this.state.text,
			checkType: this.state.checkType,
            isNormal: this.state.checkResult
		};
		console.log('params', params);
		CommonFetch.doFetch(RoutApi.addCheckResult, params, (responseData) => {
            console.log('responseData',responseData);
			if (responseData.msg == 'success') {
				this.modalSelect(false);
				this.setState({
					text: '',
					data:[]
				},this.getList);
                
                TeasetToast.smile('反馈成功');
			}
		});
	};


    headerPress = (item) =>{
        console.log('provincePress',item)
        this.props.navigation.navigate('PopulaceDetail',{queryParam:item})
    }




    _renderItem = ({item,index}) =>{
        return (
            <View key={index} style={[styles.itemStyle, GlobalStyles.lineBottom]}>
                <View style={[styles.detailView]}>
                    {this.detailText('房屋',item.BuildingName + item.RoomName)}
                    {this.detailText('业主信息',item.HouseMaster + item.HouseMasterPhone)}
                    {this.detailText('社区名称',item.AreaName)}
                    {this.detailText('房屋类型',item.RoomType)}
                    {this.detailText('房房屋入住人数',item.LivePersonNum)}
                    <CommonBtn text={'反馈'} onPress={() => this.openFilterModal(item)} style={{ marginTop: 10, width: 86, alignSelf: 'flex-start'}} ></CommonBtn>
                </View>
            </View>
        )
    }


    detailText = (key,value)=>{
        return(
            <View style={styles.detailTextView}>
                <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>{key}:</Text>
                <Text numberOfLines={3} style={[GlobalStyles.font14Gray]}>{value}</Text>
            </View>
        )
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



    render() {

        return (
            <View style={[GlobalStyles.pageBg]}>

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
                    ListEmptyComponent = {this._renderEmptyComponent}
                    keyExtractor={(item, index) => index+""}
                    data={this.state.data}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.getList}
                />

                <Modal
					animationType={'fade'}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => this.modalSelect(false)}
				>
					<View
						style={[
							GlobalStyles.flex,
							GlobalStyles.blackAlpha50,
							GlobalStyles.flexDirectRow,
							{ justifyContent: 'center' }
						]}
					>
						<View style={[styles.modalStyle, GlobalStyles.containerBg]}>
							<View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
								<TouchableOpacity onPress={() => this.cancelTasks()}>
									<FontAwesome
										name={'close'}
										size={15}
										color={Color.whiteColor}
										style={{ padding: 10 }}
									/>
								</TouchableOpacity>
							</View>

							<View style={[GlobalStyles.p25]}>
								<Text style={[GlobalStyles.font14Gray, GlobalStyles.mr5]}>核查原因：</Text>
								<TextInput
									editable={false}
									style={[GlobalStyles.borderColor, GlobalStyles.font14White, GlobalStyles.pdlr5, GlobalStyles.mr5, GlobalStyles.mt10, { height: 40, borderWidth: 1, borderRadius: 4 }]}
									value={this.state.CheckReason}
								/>
								<Text style={[GlobalStyles.font14Gray, GlobalStyles.mt10]}>反馈详情：</Text>
								<TextInput
									multiline={true}
									numberOfLines={4}
									maxLength={40}
									style={[GlobalStyles.pdlr5, GlobalStyles.borderColor, GlobalStyles.font14White, GlobalStyles.mt10, { height: 80, borderWidth: 1, borderRadius: 4 }]}
									onChangeText={(text) => this.setState({ text })}
									value={this.state.text}
								/>
                                <View style={[GlobalStyles.flexDirectRow]}>
                                <Text style={[GlobalStyles.font14Gray, GlobalStyles.mt10]}>反馈结果：</Text>
                                <RadioButton
                                    color={Color.borderColor}
                                    uncheckedColor={Color.whiteAlpha50Color}
                                    value={() => this.onCheck('normal')}
                                    status={this.state.checked === 'normal' ? 'checked' : 'unchecked'}
                                    onPress={() => { this.setState({ checked: 'normal' }); }}
                                />
                                <Text style={[GlobalStyles.font14Gray, GlobalStyles.mt10]}>正常</Text>
                                <RadioButton
                                    color={Color.borderColor}
                                    uncheckedColor={Color.whiteAlpha50Color}
                                    value={() => this.onCheck('abnormal')}
                                    status={this.state.checked === 'abnormal' ? 'checked' : 'unchecked'}
                                    onPress={() => { this.setState({ checked: 'abnormal' }); }}
                                />
                                <Text style={[GlobalStyles.font14Gray, GlobalStyles.mt10]}>异常</Text>
                                </View>
                                
								<View style={[GlobalStyles.flexDirectRow, GlobalStyles.justifyAround]}>
									<CommonBtn text={'取 消'} onPress={() => this.cancelTasks()} style={{ marginTop: 20, width: 86, alignSelf: 'flex-end' }} />
									<CommonBtn text={'确 定'} onPress={() => this.doCheck()} style={{ marginTop: 20, width: 86, alignSelf: 'flex-end' }} />
								</View>
							</View>
						</View>
					</View>
				</Modal>


                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>

            </View>
        );
    }

   
}

const  styles = StyleSheet.create({
    itemStyle:{
        height:200,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center",
        paddingLeft:30,
        paddingRight:30,
    },

    image:{
        width: 78,
        height:96,
        borderRadius: 4
    },

    detailView:{
        height:200,
        marginTop: 23,
        marginLeft: 10,
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"flex-start",
        color: '#333',
        fontSize: 14
    },

    detailTextView:{
        marginTop: 5,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"flex-start",
    },

    detailKey:{
        width:106,
        marginRight: 6
    },

    detailValue:{
        width:170
    },

    searchView:{
        height:48,
        paddingLeft: 20,
        paddingRight: 15,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },

    searchStyle:{
        flexGrow: 1,
        backgroundColor:"#FFF",
    },

    searchButton:{
        height: 30,
        width:43,
        marginLeft: 15,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    },

    modalStyle: {
		width: 360,
		height: 380,
		marginTop: 126,
	},


});