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

import {observer, inject} from 'mobx-react';
import CommonBtn from  '../../componets/CommonBtn';
import Color from "../../config/color";
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;


@inject('User')
@inject('DisputeData')
@observer
export default class DisputeTask extends Component {


    constructor(props) {
        super(props);
        this.props.DisputeData.clean();

        let taskInfo = new Object();
        taskInfo.taskId = this.props.navigation.getParam('taskId','');
        taskInfo.taskType = (taskInfo.taskId == null || taskInfo.taskId == '')?'append':'update';
        taskInfo.procId = this.props.navigation.getParam('procId','');
        taskInfo.taskDisputeId = this.props.navigation.getParam('taskDisputeId','');
        taskInfo.taskStatus = 3;


        let types = {
            nationList:[],
            sexType:[],
            causeType:[],
            countryType:[],
            idcardType:[],
        };

        //let taskId ='4eb00334029211e9b670000c292ebc57';
        this.state = {
            data: {},
            statusVisible: false,
            //添加人员时候的标记按钮
            ssryList: [],
            //taskId: taskId,
            index: 0,
            types:types,
            //涉事人员信息
            taskDisputePersInvoList : [],
            taskInfo:taskInfo
        }
        this.taskDisputeProc = {};
        this.taskDispute = {
            taskId : taskInfo.taskId,
        }
    }

    submit=()=>{
        console.log("提交数据")
        console.log(this.props.DisputeData.disputeImages)
        let postParams = {
            taskDispute:this.taskDispute,
            taskDisputeProcList : [],
            taskDisputePersInvoList : [],
            taskStatus:this.state.taskInfo.taskStatus,
            taskPersonList:[{
                userId:this.props.User.userInfo.userId,
                userType:1,
                readStatus:1,
            }]
        };

       //处理涉事人
        postParams.taskDisputePersInvoList = [];
        let index = 0;
        this.state.taskDisputePersInvoList.forEach(obj=>{
            if(obj!=null){
                if(this.props.DisputeData.dPeopleImgList[index]!=null){
                    obj.idcardFrontUrl = this.props.DisputeData.dPeopleImgList[index].idcardFrontUrl;
                    obj.idcardBackUrl = this.props.DisputeData.dPeopleImgList[index].idcardBackUrl;
                    obj.idcardUrl = this.props.DisputeData.dPeopleImgList[index].idcardFaceUrl;
                }
                if(this.props.DisputeData.dPeopleImgList[index]!=null){
                    obj.imgUrl = this.props.DisputeData.dPeopleImgList[index].imgUrl;
                }
                postParams.taskDisputePersInvoList.push(obj)
            }
            index += 1;
        })
        //处理记录
        this.taskDisputeProc.mediateUserId = this.props.User.userInfo.userId;
        this.taskDisputeProc.imgUrl1 = this.props.DisputeData.disputeImages.imgUrl1;
        this.taskDisputeProc.imgUrl2 = this.props.DisputeData.disputeImages.imgUrl2;
        this.taskDisputeProc.imgUrl3 = this.props.DisputeData.disputeImages.imgUrl3;
        this.taskDisputeProc.imgUrl4 = this.props.DisputeData.disputeImages.imgUrl4;
        this.taskDisputeProc.mediateDttm = this.state.createDate;
        postParams.taskDisputeProcList.push(this.taskDisputeProc);



        let url = '';
        if(this.state.taskInfo.taskType === 'update'){
            url = RoutApi.disputeUpdate;
            console.log("postParams:" + JSON.stringify(postParams))
            CommonFetch.doPut(
                url,
                postParams,
                (responseData)=>{
                    console.log(responseData);
                    DeviceEventEmitter.emit('reloadDisputeList',"登记成功");
                    this.props.navigation.navigate('DealTaskResult',{
                        unitName:this.state.data.caseAddr+this.state.data.causeType,
                        type:"dispute",
                    });
                },
                this.refs.toast,
                this.props.User.token)
        }else if(this.state.taskInfo.taskType === 'append'){
            postParams.task = {};
            postParams.task.taskName = this.taskDispute.caseAddr + this.taskDispute.causeTypeName;
            postParams.task.taskRealDt = this.state.createDate;
            postParams.task.createDttm = formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
            console.log("postParams:" + JSON.stringify(postParams))
            url = RoutApi.disputeAdd;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': this.props.User.token
                },
                body: JSON.stringify(postParams),
            })
                .then((response) =>  {return response.json()})
                .then((responseData) => {
                        if(responseData.code == '0'){
                            console.log(responseData);
                            DeviceEventEmitter.emit('reloadDisputeList', "登记成功");
                            this.props.navigation.navigate('DealTaskResult', {
                                unitName: postParams.task.taskName,
                                type:"dispute"
                            });
                        }else{
                            console.log(responseData);
                            this.refs.toast.show(responseData.msg);
                        }

                    }
                )
                .catch((error) => {
                    console.log('error', error);
                    this.refs.toast.show(error.msg);
                 });
        }







    }

    componentWillMount() {

        this.getNationList();
        this.getCauseType();
        //证件类型
        this.geIdcardType();
        //国家
        this.getCountryType();
        //性别
        this.geSexType();

        if(this.state.taskInfo.taskType == 'update'){
            this.getTaskDetail();
            if(this.state.taskInfo.procId!=null && this.state.taskInfo.procId!=''){
                this.getDisputePeople();
            }
        }
    }

    getDisputePeople() {
        let params = {
            init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                taskDisputeId:this.state.taskInfo.taskDisputeId
            }
        };
        CommonFetch.doFetch(
            RoutApi.disputePeople,
            params,
            (responseData) => {
                let i = 0;
                responseData.data.list.map(item=>{
                    console.log(JSON.stringify(item))
                    //设置图片
                    if(item.front != null){
                        this.props.DisputeData.updateDisputePeopleImagesByKey(i,"idcardFrontUrl",item.front)
                    }
                    if(item.back != null){
                        this.props.DisputeData.updateDisputePeopleImagesByKey(i,"idcardBackUrl",item.back)
                    }
                    //生活照
                    if(item.imgUrl != null){
                        this.props.DisputeData.updateDisputePeopleImagesByKey(i,'imgUrl' , item.imgUrl)
                    }
                    //脸
                    if(item.idcardUrl != null){
                        this.props.DisputeData.updateDisputePeopleImagesByKey(i,'idcardFaceUrl' , item.idcardUrl)
                    }
                    //获取涉事人的时候,将涉事人的信息填充
                    let taskDisputePersInvoList = this.state.taskDisputePersInvoList;
                    taskDisputePersInvoList.push({})
                    taskDisputePersInvoList[i] = item;
                    taskDisputePersInvoList[i].isFogn = item.isFogn == '0'?false:true;
                    taskDisputePersInvoList[i].sex = this.findTypeCodeByName(this.state.types.sexType,item.sex);

                    if(item.isFogn == '0'){
                        this.statusChange(true,item)
                        taskDisputePersInvoList[i].nation = item.nation;
                    }else{
                        this.statusChange(false,item)
                        taskDisputePersInvoList[i].nation = item.nation;
                        taskDisputePersInvoList[i].credType = this.findTypeCodeByName(this.state.types.idcardType,item.credType);
                    }

                    this.setState({
                        taskDisputePersInvoList :taskDisputePersInvoList
                    })

                    i +=1;
                });
            },
            this.refs.toast)

    }

    getTaskDetail = () => {
        let url = '';
        let params = {
            init: 0,
            pageNum: 1,
            pageSize: 10,
            queryPair: {
                taskId: this.state.taskInfo.taskId,
                procId: this.state.taskInfo.procId
            }
        };
        //如果procId存在,则认为是编辑
        if(this.state.taskInfo.procId!=null && this.state.taskInfo.procId!=''){
            url =   RoutApi.disputeHistory;
        }else{
            url = RoutApi.getWaitDispute;
        }
        CommonFetch.doFetch(
            url,
            params,
            (responseData) => {
                let data = responseData.data.list[0]
                console.log("纠纷task:" + JSON.stringify(responseData))
                this.setState({
                    data: data
                })
                if(data!=null && url == RoutApi.disputeHistory){
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
                let types = this.state.types;
                types.nationList = responseData.data.list;
                this.setState({
                    types : types,
                })
            },
            this.refs.toast)
    }

    getCauseType = () =>{
        let params={init: 0,
            pageNum: 1,
            pageSize: 1000,
            queryPair: {
                type: 'CAUSETYPE'
            }};

        CommonFetch.doFetch(
            RoutApi.getDictList,
            params,
            (responseData)=>{
                let types = this.state.types;
                types.causeType = responseData.data.list;
                this.setState({
                    types : types,
                })
            },
            this.refs.toast)
    }

    geIdcardType = () =>{
        let params={init: 0,
            pageNum: 1,
            pageSize: 1000,
            queryPair: {
                type: 'IDCARD_TYPE'
            }};

        CommonFetch.doFetch(
            RoutApi.getDictList,
            params,
            (responseData)=>{
                let types = this.state.types;
                types.idcardType = responseData.data.list;
                this.setState({
                    types : types,
                })
            },
            this.refs.toast)
    }

    geSexType = () =>{
        let params={init: 0,
            pageNum: 1,
            pageSize: 1000,
            queryPair: {
                type: 'SEXTYPE'
            }};

        CommonFetch.doFetch(
            RoutApi.getDictList,
            params,
            (responseData)=>{
                let types = this.state.types;
                types.sexType = responseData.data.list;
                this.setState({
                    types : types,
                })
            },
            this.refs.toast)
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
                let types = this.state.types;
                types.countryType = responseData.data.list;
                this.setState({
                    types : types,
                })
            },
            this.refs.toast)
    }

    findTypeCodeByName = (type, name) => {
        let code = 0;
            type.map(obj=>{
                if(obj.name1==name){
                    code = obj.code;
                }
            })
        return code;
    }

    
    //纠纷照片
    goDisputePhoto = () => {
        this.props.navigation.navigate('DisputeTaskPhoto', {type: 'dispute',taskId:this.state.taskInfo.taskId})
    }

    //涉事人员照片
    goPeopleDisputePhoto = (index) => {
        this.props.navigation.navigate('DisputeTaskPhoto', {
            type: 'people',
            taskId:this.state.taskInfo.taskId,
            peopleIndex:index,
        })
    }
    //涉事人员身份证
    goPeopleCardPhoto = (index) => {
        this.props.navigation.navigate('DealTaskCard', {
            type: 'disputePeople',
            taskId:this.state.taskInfo.taskId,
            peopleIndex:index,
        })
    }


    //时间控件相关
    dateSelect = (flag) => {
        this.setState({
            dateVisible: flag
        });
    }

    confirmDate = (date) => {
        let dateStr = formatDate(new Date(date), "yyyy-MM-dd hh:mm:ss");
        console.log("dateStr:" + dateStr)
        this.setState({
            createDate: dateStr
        });
        this.dateSelect(false);
    }

    //移除涉事人员
    removeSsryList(item,index) {
        //删除页面
        let ssryList = this.state.ssryList;
        ssryList.splice(item,1);
        //删除数据
        delete this.state.taskDisputePersInvoList[index]

        this.setState({
            ssryList:ssryList,
        })

    }

    inputChange=(obj,key,value)=>{
        obj[key] = value;
    }

    peopleInputChange=(index,key,value)=>{
        let list = this.state.taskDisputePersInvoList;
        list[index][key] = value;
        this.setState({
            taskDisputePersInvoList:list
        })
    }


    //点击添加涉事人员
    statusChange = (status,item) => {

        let setIndex = this.state.index;
        //this.props.CheckData.updateByKey('feedResult',status)
        let ssryList = this.state.ssryList

        console.log("setIndex:"+setIndex)
        // let pushItem = item;
        // pushItem.isFogn = !status;
        // pushItem.credType = 1;
        //this.state.taskDisputePersInvoList.push(pushItem);

        this.state.ssryList.push(<View key = {setIndex}>
            {
                <View style={[styles.title,GlobalStyles.containerBg]}>

                    <Text style={GlobalStyles.font12White}>涉事人员</Text>
                        <TouchableOpacity style={{marginRight:30}} onPress={() => {
                            this.removeSsryList(this,setIndex)
                        }}>
                            <FontAwesome name="minus" color={Color.whiteColor} size={14}/>
                        </TouchableOpacity>
                </View>
            }
            {
                status?(<View>
                        <ItemInput name={'姓名'} textType={"input"}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   defaultValue={item.roomUserName}
                                   onChangeText={(text) =>
                                       this.peopleInputChange(setIndex,'roomUserName',text)
                                   }
                        />
                        <SelectInput
                            title='民族'
                            data={this.state.types.nationList}
                            defaultName={item.nation?item.nation:null}
                            callbackParent={(item) =>this.peopleInputChange(setIndex,'nation',item.name1)}
                            style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                        />
                        <SelectInput
                            title='性别'
                            data={this.state.types.sexType}
                            defaultName={item.sex?item.sex:null}
                            callbackParent={(item) =>this.peopleInputChange(setIndex,'sex',item.code)}
                            style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                        />
                        <ItemInput name={'联系方式'} textType={"input"}
                                   defaultValue={item.contTel}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'contTel',text)}
                        />
                        <ItemInput name={'证件号码'} textType={"input"}
                                   defaultValue={item.idcardNum}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'idcardNum',text)}
                        />
                        <ItemInput name={'居住地址'} textType={"input"}
                                   defaultValue={item.liveAddr}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'liveAddr',text)}
                        />
                        <ItemInput name={'户籍地址'} textType={"input"}
                                   defaultValue={item.resiAddr}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'resiAddr',text)}
                        />
                        <ItemInput name={'身份证照片'} textType={"text"} 
                                style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={'采集'}
                                   arrowVisible={true} pressFunc={()=>this.goPeopleCardPhoto(setIndex)}
                        />
                        <ItemInput name={'采集照片'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={'采集'}
                                   arrowVisible={true} pressFunc={()=>this.goPeopleDisputePhoto(setIndex)}
                        />
                    </View>
                ):(
                    <View>
                        <ItemInput name={'姓名'} textType={"input"}
                                   defaultValue={item.roomUserName}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'roomUserName',text)}
                        />
                        <SelectInput
                            title='性别'
                            data={this.state.types.sexType}
                            defaultName={item.sex?item.sex:null}
                            callbackParent={(item) =>this.peopleInputChange(setIndex,'sex',item.code)}
                            style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                        />

                        <ItemInput name={'英文名'} textType={"input"}
                                   defaultValue={item.firstName}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'firstName',text)}
                        />
                        <ItemInput name={'英文姓'} textType={"input"}
                                   defaultValue={item.lastName}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'lastName',text)}
                        />
                        <SelectInput
                            title='国籍/地区'
                            data={this.state.types.countryType}
                            defaultName={item.nation?item.nation:null}
                            callbackParent={(item) =>this.peopleInputChange(setIndex,'nation',item.name1)}
                            style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                        />
                        <SelectInput
                            title='证件种类'
                            data={this.state.types.idcardType}
                            defaultName={item.credType?item.credType:null}
                            callbackParent={(item) =>this.peopleInputChange(setIndex,'credType',item.code)}
                            style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                        />
                        <ItemInput name={'证件号码'} textType={"input"}
                                   defaultValue={item.idcardNum}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'idcardNum',text)}
                        />
                        <ItemInput name={'联系方式'} textType={"input"}
                                   defaultValue={item.contTel}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'contTel',text)}
                        />
                        <ItemInput name={'居住地址'} textType={"input"}
                                   defaultValue={item.liveAddr}
                                   style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   onChangeText={(text) => this.peopleInputChange(setIndex,'liveAddr',text)}
                        />
                        <ItemInput name={'采集照片'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={'采集'}
                                   arrowVisible={true} pressFunc={()=>this.goPeopleDisputePhoto(setIndex)}
                        />
                    </View>
                )
            }
            </View>
        )

        this.setState({
            statusVisible: false,
            ssryList:ssryList,
            index:setIndex + 1
        })

    }

    render() {
        return (
            <ScrollView style={GlobalStyles.pageBg}>
                {
                    this.state.taskInfo.taskType == 'update'?(
                        <ItemInput name={'案由类型'} textType={"text"} style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   textValue={this.state.data.causeType}
                        />
                    ):(
                        <SelectInput
                            title='案由类型'
                            data={this.state.types.causeType}
                            callbackParent={(item) =>{
                                this.inputChange(this.taskDispute,'causeTypeName',item.name1)
                                this.inputChange(this.taskDispute,'causeType',item.code)
                            }}
                            style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                        />
                    )
                }

                <ItemInput name={'案由描述'} textType={this.state.taskInfo.taskType == 'update'?'text':'input'}
                           onChangeText={(text) => this.inputChange(this.taskDispute,'causeDesc',text)}
                           style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom, GlobalStyles.lineBottom]}
                           textValue={this.state.data.causeDesc}
                />

                {
                    this.state.taskInfo.taskType == 'update'?(
                        <ItemInput name={'发生时间'} textType={"text"} style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                   textValue={this.state.data.createDate}
                        />
                    ):(
                            <ItemInput name={'发生时间'} textType={"text"}
                                       style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                                       textValue={this.state.createDate}
                                       pressFunc={() => this.dateSelect(true)}
                                       arrowVisible={true}
                                       //onChangeText={(text) => this.inputChange(this.taskDispute,'taskRealDt',text)}
                            />
                    )

                }
                <DateTimePicker
                    date={new Date()}
                    isVisible={this.state.dateVisible}
                    onConfirm={this.confirmDate}
                    onCancel={() => this.dateSelect(false)}
                    datePickerModeAndroid={"spinner"}
                    mode="datetime"
                    maximumDate={new Date()}
                />


                <ItemInput name={'涉事人姓名'} textType={this.state.taskInfo.taskType == 'update'?'text':'input'}
                           style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           onChangeText={(text) => this.inputChange(this.taskDispute,'persInvoName',text)}
                           defaultValue={this.state.data.persInvoName}
                           textValue={this.state.data.persInvoName}
                />
                <ItemInput name={'涉事人电话'} textType={this.state.taskInfo.taskType == 'update'?'text':'input'}
                           style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           onChangeText={(text) => this.inputChange(this.taskDispute,'persInvoTel',text)}
                           defaultValue={this.state.data.persInvoTel}
                           textValue={this.state.data.persInvoTel}
                />


                <ItemInput name={'登记人'} textType={"text"}
                           style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           textValue={this.state.taskInfo.taskType == 'update'?this.state.data.userName:this.props.User.userInfo.userNameChn}
                />
                <ItemInput name={'案发地址'} textType={this.state.taskInfo.taskType == 'update'?'text':'input'}
                           style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           onChangeText={(text) => this.inputChange(this.taskDispute,'caseAddr',text)}
                           defaultValue={this.state.data.caseAddr}
                           textValue={this.state.data.caseAddr}
                />
                <ItemInput name={'照片采集'} textType={"text"} style={[GlobalStyles.pdlr15,GlobalStyles.lineBottom,GlobalStyles.pageBg1]} textValue={'立即查看'}
                           arrowVisible={true} pressFunc={this.goDisputePhoto}
                />


                <TouchableOpacity style={[styles.title,GlobalStyles.containerBg,GlobalStyles.lineBlackBottom]} onPress={() => {
                    this.setState({
                        statusVisible: !this.state.statusVisible,
                    })
                }}>
                    <Text style={GlobalStyles.font12White}>添加涉事人员</Text>
                    <FontAwesome name="plus" color={Color.whiteColor} size={14}/>
                </TouchableOpacity>
                {
                    this.state.ssryList.map((v)=>{return v})
                }

                <View style={[styles.title,GlobalStyles.containerBg]}>
                    <Text style={GlobalStyles.font12White}>处理信息</Text>
                </View>

                <ItemInput name={'处理人'} textType={"text"} style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                           textValue={this.props.User.userInfo.userNameChn}
                />

                <ItemInput
                    name={'处理结果'} textType={"input"}
                    style={[GlobalStyles.pdlr15, GlobalStyles.lineBottom]}
                    onChangeText={(text)=>{
                        this.taskDisputeProc.result = text
                    }}
                />

                <CommonBtn text={'提交'} onPress={this.submit} 
                     style={[GlobalStyles.mt30,GlobalStyles.pdlr15,GlobalStyles.mb20]} 
                     containerStyle = {styles.submitBtn}>
                </CommonBtn>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.statusVisible}
                    onRequestClose={() => this.statusSelect(false)}>
                    <View style={[GlobalStyles.flex, GlobalStyles.center, GlobalStyles.blackAlpha50]}>
                        <View style={[styles.modalStyle, GlobalStyles.containerBg]}>
                            <TouchableOpacity style={[GlobalStyles.center, GlobalStyles.h50, GlobalStyles.lineBlackBottom]}
                                              onPress={() => {
                                                  this.state.taskDisputePersInvoList.push({isFogn:false});
                                                  this.statusChange(true,{})
                                              }}>
                                <Text style={[GlobalStyles.font15Gray]}>中国籍</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[GlobalStyles.center, GlobalStyles.h50, GlobalStyles.lineBlackBottom]}
                                              onPress={() => {
                                                  this.state.taskDisputePersInvoList.push({isFogn:true});
                                                  this.statusChange(false,{})
                                              }}>
                                <Text style={[GlobalStyles.font15Gray]}>外国籍</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

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
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    submitBtn:{
        borderRadius:8
    }
   
});

