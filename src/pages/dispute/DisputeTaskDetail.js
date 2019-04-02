import React, {Component} from 'react';
import {
    StyleSheet, ScrollView, Modal,
    Text, TouchableOpacity, TextInput,
    View, PixelRatio, FlatList, Image, DeviceEventEmitter
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import SelectInput from  '../../componets/SelectInput';;
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Toast, {DURATION} from 'react-native-easy-toast';
import CommonFetch from "../../componets/CommonFetch";
import RoutApi from '../../api/index';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {formatDate} from '../../utils/Utils';
import Color from "../../config/color";
import {observer, inject} from 'mobx-react';
let _this = null

let chinaPersonInfoArr = [
    {
        title:"姓名",
        value:"roomUserName"
    },
    {
        title:"民族",
        value:"nation"
    },
    {
        title:"性别",
        value:"sex"
    },
    {
        title:"联系方式",
        value:"contTel"
    },
    {
        title:"身份证号码",
        value:"idcardNum"
    },
    {
        title:"居住地址",
        value:"liveAddr"
    },
    {
        title:"登记时间",
        value:"createDate"
    },
    {
        title:"户籍地址",
        value:"resiAddr"
    },
];

let foreignPersonInfoArr = [
    {
        title:"姓名",
        value:"roomUserName"
    },
    {
        title:"性别",
        value:"sex"
    },
    {
        title:"英文名",
        value:"firstName"
    },
    {
        title:"英文姓",
        value:"lastName"
    },
    {
        title:"国籍/地区",
        value:"nation"
    },
    {
        title:"证件种类",
        value:"credType"
    },
    {
        title:"证件号码",
        value:"idcardNum"
    },
    {
        title:"联系方式",
        value:"contTel"
    },
    {
        title:"居住地址",
        value:"liveAddr"
    }
];
@inject('User')
@inject('DisputeData')
@observer
export default class DisputeTaskDetail extends Component {


    constructor(props) {
        super(props);
        this.props.DisputeData.clean();
        let taskId = this.props.navigation.getParam('taskId','');
        console.log("taskId:"+taskId)
        let procId = this.props.navigation.getParam('procId','');
        //let taskId ='4eb00334029211e9b670000c292ebc57';
        let taskDisputeId = this.props.navigation.getParam('taskDisputeId','');
        console.log("taskDisputeId:"+taskDisputeId)
       // this.taskDisputeId = taskDisputeId;
        this.state = {
            data: {},
            //添加人员时候的标记按钮
            peopleData: [],
            index: 0,
            nationList:[],
            itemsVisible:[],
            procId: procId,
            taskId: taskId,
            taskDisputeId:taskDisputeId,
            types:{},
            showNation:[],
        }
        this.taskDisputePersInvoList = []
        this.taskDisputeProc = {};
        _this = this
    }

    static navigationOptions = {
        headerTitle: '纠纷',
        headerRight:(<View>
            <TouchableOpacity onPress={()=>{
                _this.props.navigation.navigate('DisputeTask',{
                    taskId: _this.props.navigation.getParam('taskId',''),
                    procId: _this.props.navigation.getParam('procId',''),
                    taskDisputeId:_this.props.navigation.getParam('taskDisputeId',''),
                });
            }}>
                <Text style={{marginRight:20,color:'#FFFFFF'}}>编辑</Text>
            </TouchableOpacity>

        </View>),
    }

    componentWillMount() {
        this.getTaskDetail();
        this.getDisputePeople();
        // this.getCountryType();
        // this.getNationList()
    }

    getCountryType =() =>{
        let params={init: 0,
            pageNum: 1,
            pageSize: 1000,
            queryPair: {
                type: 'COUNTRY_TYPE'
            }};

        CommonFetch.doFetch(
            RoutApi.getDictList,
            params,
            (responseData)=>{
                console.info("getCountryType",responseData);
                let types = this.state.types;
                types.countryType = responseData.data.list;
                this.setState({
                    types : types,
                })
            },
            this.refs.toast)
    }

    getNationList = () =>{
        let params={init: 0,
            pageNum: 1,
            pageSize: 1000,
            queryPair: {
                type: 'NATION_TYPE'
            }};

        CommonFetch.doFetch(
            RoutApi.getDictList,
            params,
            (responseData)=>{
                console.info("getNationList",responseData);
                let types = this.state.types;
                types.nationList = responseData.data.list;
                this.setState({
                    types : types,
                })
            },
            this.refs.toast)
    }

    findNameByCode(nationList, nation,index) {
        console.info("findNameByCode",nationList);
        if(nationList){
            nationList.map(obj => {
                if (obj.code == nation) {
                    console.log("开始设置:"+obj.name1)
                    let shows = this.state.showNation
                    shows[index] = obj.name1;

                    this.setState({
                        showNation: shows
                    })
                }
            })
        }

    }

    getDisputePeople() {
        let params = {
            init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                taskDisputeId: this.state.taskDisputeId,
            }
        };
        CommonFetch.doFetch(
            RoutApi.disputePeople,
            params,
            (responseData) => {
                console.log("涉事人:" + JSON.stringify(responseData))
                this.setState({
                    peopleData: responseData.data.list
                })
            },
            this.refs.toast)

    }


    getTaskDetail = () => {
        let params = {
            init: 0,
            pageNum: 1,
            pageSize: 1000,
            queryPair: {
                taskId: this.state.taskId,
                procId: this.state.procId
            }
        };
        CommonFetch.doFetch(
            RoutApi.disputeHistory,
            params,
            (responseData) => {
                let data = responseData.data.list[0];
                console.log("纠纷task:" + JSON.stringify(responseData))
                if(data!=null){
                    if(data.imgUrl1!=null && data.imgUrl1!=''){
                        this.props.DisputeData.updateDisputeImagesByKey("imgUrl1",data.imgUrl1)
                    }
                    if(data.imgUrl2!=null && data.imgUrl2!=''){
                        this.props.DisputeData.updateDisputeImagesByKey("imgUrl2",data.imgUrl2)
                    }
                    if(data.imgUrl3!=null && data.imgUrl3!=''){
                        this.props.DisputeData.updateDisputeImagesByKey("imgUrl3",data.imgUrl3)
                    }
                    if(data.imgUrl4!=null && data.imgUrl4!=''){
                        this.props.DisputeData.updateDisputeImagesByKey("imgUrl4",data.imgUrl4)
                    }
                }
                this.setState({
                    data: data
                })
            },
            this.refs.toast)
        //console.log(this.state.data)
    }

    //纠纷照片
    goDisputePhoto = () => {
        this.props.navigation.navigate('DisputeTaskPhoto', {
            type: 'dispute',
            taskId:this.state.taskId,
            viewType:'view',
        })
    }


    _renderPersonItem = (item,type = "china") =>{
        let arr = chinaPersonInfoArr;
        if(type == "foreign"){
            arr = foreignPersonInfoArr;
        }
        return (
            arr.map((obj,index) => {
                return (
                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.mt10]} key={index}>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr10]}>{obj.title}:</Text>
                        <Text style={[GlobalStyles.font14Gray]}>{item[obj.value]}</Text>
                    </View>
                );
            })
        );
    }

    _renderItem = ({item,index})=>{
        console.info("_renderItem",item);

        let lastStyle =  {marginBottom:20}

        if(this.state.itemsVisible[index] == null){
            this.state.itemsVisible[index] = false;
        }
        if(item.isFogn === '0'){
            this.findNameByCode(this.state.types.nationList,item.nation,index)
        }else{
            this.findNameByCode(this.state.types.countryType,item.nation,index)
        }

        return (
            <View>
                <TouchableOpacity onPress={()=>this._onPressItem(index)}>
                    <ItemInput
                        name={'涉事人员' + (index + 1)} textType={"text"}
                        style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                        textValue={item.roomUserName}
                        arrowVisible = {true}
                    />
                </TouchableOpacity>
                {
                    this.state.itemsVisible[index]&&item.isFogn === '0'?(
                        <View style={[styles.itemStyle,GlobalStyles.containerBg,{paddingBottom:10},lastStyle]}>
                            <View style={styles.imageView}>
                                {item.idcardUrl ? <Image source={{uri:item.idcardUrl,cache:true}} style={[styles.photo,{marginRight:40}]} />
                                : <Image source={require("../../../assets/images/idcard_default.png")} style={[styles.photo,{marginRight:40}]}/> }

                                {item.imgUrl ? <Image source={{uri:item.imgUrl,cache:true}} style={[styles.photo]}/>
                                : <Image source={require("../../../assets/images/image_default.png")} style={[styles.photo]}/> }

                            </View>
                            <View>
                                {this._renderPersonItem(item,"china")}
                            </View>
                        </View>
                    ):(<View/>)
                }

                {
                    this.state.itemsVisible[index]&&item.isFogn === '1'?(
                        <View style={[styles.itemStyle,GlobalStyles.containerBg,{paddingBottom:10},lastStyle]}>
                            <View style={styles.imageView}>
                                 {item.imgUrl ? <Image source={{uri:item.imgUrl,cache:true}} style={[styles.photo]}/>
                                    : <Image source={require("../../../assets/images/image_default.png")} style={[styles.photo]}/> }

                            </View>
                           <View>
                               {this._renderPersonItem(item,"foreign")}
                           </View>
                        </View>
                    ):(<View/>)
                }
            </View>
        )
    }

    _onPressItem(index) {
        let itemsVisible = this.state.itemsVisible;
        itemsVisible[index] = !itemsVisible[index];
        this.setState({
            itemsVisible:itemsVisible
        })
    }


    render() {
        return (
            <ScrollView style={GlobalStyles.pageBg}>
                <ItemInput name={'案由类型'} textType={"text"} style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           textValue={this.state.data.causeType}
                />
                <ItemInput
                    name={'处理结果'} textType={"text"}
                    style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                    textValue={this.state.data.result}
                />
                <ItemInput name={'发生时间'} textType={"text"} style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           textValue={this.state.data.createDate}
                />
                <ItemInput name={'处理人'} textType={"text"} style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           textValue={this.state.data.mediateUserName}
                />

                <ItemInput name={'处理时间'} textType={"text"} style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           textValue={this.state.data.mediateDate}
                />

                <ItemInput name={'案发地址'} textType={"text"} style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           textValue={this.state.data.caseAddr}
                />
                <ItemInput name={'照片采集'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom]}
                     textValue={'立即查看'}
                           arrowVisible={true} pressFunc={this.goDisputePhoto}
                />

                <TouchableOpacity style={[styles.title,GlobalStyles.pdlr15,GlobalStyles.containerBg]}>
                    <Text style={GlobalStyles.font12White}>涉事人员</Text>
                </TouchableOpacity>

                <FlatList
                    keyExtractor={(item, index) => index+''}
                    extraData={this.state}
                    data={this.state.peopleData}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.2}
                    //onEndReached={this.getWaitList}
                />

                <Toast ref="toast" style={{backgroundColor: '#EEE'}} textStyle={{color: '#333'}} position={"center"}
                       fadeOutDuration={1000} opacity={0.8}/>

            </ScrollView>
        );
    }



}

const styles = StyleSheet.create({
    modalStyle: {
        width: 280,
        borderRadius: 8,
    },
    title: {
        height: 38,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageView: {
        paddingTop: 10,
        flexDirection: "row",
    },
    photo:{
        width:106,
        height:123,
        borderRadius:4,
    },
    itemStyle: {
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:15,
        paddingBottom:20,
        elevation: 20,
        borderWidth: 1,
        borderColor: Color.blackAlpha50Color,
        borderRadius: 8,
    },
    pTextL:{
        marginLeft:20,
    },
    pTextR:{
        marginLeft:10
    }
});

