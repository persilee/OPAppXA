import React, { Component } from 'react';
import {
    StyleSheet,Modal,RefreshControl,AsyncStorage,
    ScrollView,Slider,
    Image,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Platform,
    BackHandler,
    StatusBar
} from 'react-native';

import {Dimensions} from 'react-native'
import {observer,inject} from 'mobx-react';
import User from '../../store/User';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Picker from 'react-native-picker';

import Toast, {DURATION} from 'react-native-easy-toast';

import API from "../../api/index";
import CommonFetch from "../../componets/CommonFetch";
var {height,width} =  Dimensions.get('window');
var boxW = width/3;

import ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


@inject('User')
@observer
export default class Face extends Component{
    constructor(props) {
        super(props);

    
        this.state = {
            faceToken:User.faceToken,
            endTime:this._getCurrentDate(),
            startTime:'2018-10-22',

            selectedFace:[], // 选中的人脸

            memeberList:[],
            faceListcurrentPage:1,
            faceListpageSize:15,
            isAllList:false,

            faceSimilarity:80, // 相似度阈值

            faceFeature:[],

            params: {
                Features: ['11','122'], //人脸特征码
                filter: 80, //相似度阈值
                begin: "", //开始时间
                end: "", //结束时间
                SearchType: "", //搜索类型
                remark: "", //搜索备注
                IsUnion: true,
                deviceID: '',
                gender: '',
                beginAge: '',
                endAge: ''
                }

        }
    }

    componentDidMount() {
        this._getFaceListNow();
        // this._searchForFace();
    }

    render(){
        return (
            <ScrollView style={[{backgroundColor:'#070B4B'}]} contentContainerStyle={[GlobalStyles.alignCenter]}
                onScrollEndDrag={this._handleScrollEnd}>
                {/* 选择人脸部分 */}
                <View style={[styles._photoListView,GlobalStyles.mt30,]}>
                    {
                        this.state.selectedFace.map((item,index) => {
                            return (
                                <View style={[styles._selectFaceItemContent]}> 
                                    <Image source={{uri:item.uri}} style={styles._selectFaceItemImage}></Image>
                                    <TouchableOpacity>
                                        <Image source={require("../../../assets/images/closed_button.png")} 
                                            style={[styles._deleteFaceImage,{position:"relative", top:-110, left:50}]}></Image>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }

                    {               
                        this.state.selectedFace.length == 0?(
                            <TouchableOpacity onPress={this._addSlectFace} style={{width:'100%', height:boxW}}>
                                <View style={[{width:'100%', height:boxW},GlobalStyles.alignCenter]}>
                                    <Image source={require('../../../assets/images/add.png')} style={styles.image}></Image>
                                    <Text style={[styles._text_upload]}>上传人脸</Text>
                                </View>
                            </TouchableOpacity>
                        ):(
                            <TouchableOpacity onPress={this._addSlectFace}>
                                <View style={[styles.imageContent]}>
                                    <Image source={require('../../../assets/images/add2.png')} style={styles.image}></Image>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>

                <View style={[styles._faceContent]}> 
                    <View style={[styles._faceParamsContent,{position:"relative", top:-12}]}>
                        <TouchableOpacity onPress={() => {this._showDatePicker(1)}}>
                            <View style={[styles._timeSelectContent,GlobalStyles.flexDirectRow,GlobalStyles.alignCenter,{marginTop:22}]}>
                                <FontAwesome name={"angle-right"} color={"#D8D8D8"} size={22} style={[GlobalStyles.ml5,{position:"relative",left:270}]} />
                                <Text style={[styles._timeTestStyle,{marginLeft:10}]}>开始时间:</Text>
                                <Text style={[styles._timeTestStyle,{marginLeft:4}]}>{this.state.startTime}</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={()=>{this._showDatePicker(0)}}>
                            <View style={[styles._timeSelectContent,GlobalStyles.flexDirectRow,GlobalStyles.alignCenter,{marginTop:10}]}>
                                <FontAwesome name={"angle-right"} color={"#D8D8D8"} size={22} style={[GlobalStyles.ml5,{position:"relative",left:270}]} />
                                <Text style={[styles._timeTestStyle,{marginLeft:10}]}>结束时间:</Text>
                                <Text style={[styles._timeTestStyle,{marginLeft:4}]}>{this.state.endTime}</Text>
                            </View>
                        </TouchableOpacity>
                    
                        <View style={[{width:300, marginTop:18,justifyContent:'space-between'},GlobalStyles.flexDirectRow]}>
                            <Text style={[styles._timeTestStyle]}>相似度设置:</Text>
                            <Text style={[styles._timeTestStyle]}>{this.state.faceSimilarity}%</Text>
                        </View>
                
                        <Slider style={{width:330, marginTop:14}}
                            thumbTintColor={'#2663ff'}
                            minimumTrackTintColor={'#2663ff'}
                            onValueChange={this._changeSimilarity}
                            maximumValue={100}
                            minimumValue={70}
                            step={1}
                            value={this.state.faceSimilarity}/>


                        <TouchableOpacity onPress={() => null}>
                            <View style={[styles._seachOk]}>
                                <Text style={[styles._seachOkText]}>开始查询</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                
                    <FlatList
                        keyExtractor={(item, index) => index+""}
                        style={[styles._faceList]}
                        data={this.state.memeberList}
                        renderItem={this._renderItem}
                        numColumns={3}/>        
                </View>
                

                <Toast ref="toast" position={"center"}  fadeInDuration={500} />     
            </ScrollView>
        );
    }

    //获取当前日期  格式如 2018-12-15
    _getCurrentDate(){
        var currDate = new Date()
        var year = currDate.getFullYear()
        var month = (currDate.getMonth()+1).toString()
        month = month.padStart(2,'0')
        var dateDay = currDate.getDate().toString()
        dateDay = dateDay.padStart(2,'0')
        let time = year+'-'+month+'-'+dateDay
        return time;
    }

    //组装日期数据
    _createDateData(){
        let date = [];
        var currDate = new Date()
        var year = currDate.getFullYear()
        var month = currDate.getMonth()+1
        for(let i=1970;i<=year;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k+'日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
    }

    //打开日期选择 视图
    _showDatePicker(e) {

        console.log(e);

        var year = ''
        var month = ''
        var day = ''
        var dateStr;
        if(e === 1) {
            dateStr = this.state.startTime
        } else {
            dateStr = this.state.endTime
        }

        //console.log('dateStr',dateStr)
        year = dateStr.substring(0,4)
        month = parseInt(dateStr.substring(5,7))
        day = parseInt(dateStr.substring(8,10))

        var i = e;

        Picker.init({
        pickerTitleText:'时间选择',
        pickerCancelBtnText:'取消',
        pickerConfirmBtnText:'确定',
        selectedValue:[year+'年',month+'月',day+'日'],
        pickerBg:[255,255,255,1],
        pickerData: this._createDateData(),
        pickerFontColor: [33, 33 ,33, 1],
        onPickerConfirm: (pickedValue, pickedIndex) => {
            var year = pickedValue[0].substring(0,pickedValue[0].length-1)
            var month = pickedValue[1].substring(0,pickedValue[1].length-1)
            month = month.padStart(2,'0')
            var day = pickedValue[2].substring(0,pickedValue[2].length-1)
            day = day.padStart(2,'0')
            let str = year+'-'+month+'-'+day

            if(i === 1) {
                this.setState({
                    startTime:str,
                })
            } else {
                this.setState({
                    endTime:str,
                })
            }
            
        },
        onPickerCancel: (pickedValue, pickedIndex) => {
            console.log('date', pickedValue, pickedIndex);
        },
        onPickerSelect: (pickedValue, pickedIndex) => {
            console.log('date', pickedValue, pickedIndex);
        }
        });
        Picker.show();
    }

    // 显示查询该face的原因弹框
    _showSelectFace(face) {
        // console.log(face);
        // alert(face);
        // this._getFaceImage_url(face.imgUrl);

        

    }

    // 根据图片url地址获取图片特征码
    _getFaceImage_url(face) {
        let url = API.getFaceImage_url;
        let params = `url=${face}`;
        CommonFetch.doFetch2(url,params,(responseData) =>{
            console.log('responseData', responseData);
            if(responseData.code == 200) {
                var faceFeatureData = this.state.faceFeature;
                faceFeatureData.push(responseData.data[0].feature);
                // console.log('responseData',responseData);

                var data = this.state.selectedFace;
                data.push(file);
                this.setState({
                    selectedFace:data,
                    faceFeature:faceFeatureData
                });
                // console.log("selectedFace", this.state.selectedFace);
            }

        },this.refs.toast, (faile) =>{
            console.log(faile);
        }, (err) => {
            console.log(err);
        }, this.state.faceToken);
    }

    // 上传图片获取图片特征码
    _getFaceImage_file(file) {
        // console.log('file ', file);
        let url = API.getFaceImage_file;
        let formData = new FormData();
        let ImgFile = {uri: file.uri, type: 'image/jpeg', name:"ImgFile", filename:file.fileName};
        formData.append('ImgFile',ImgFile);
        // formData.append('ImgFile',file.data);
        let newToken = "Bearer " + this.state.faceToken;
        fetch(url,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'multipart/form-data;charset=utf-8',
                'Authorization': newToken
            },
            body:formData,
        }).then((response) => {
            // console.log("response", response);
            return response.json(); 
        }).then((responseData) => {
            console.log('responseData', responseData);
            if(responseData.code == 200) {
                var faceFeatureData = this.state.faceFeature;
                // var data = this.stringToUtf8ByteArray(responseData.data[0].feature)
                // faceFeatureData.push(data);
                faceFeatureData.push(responseData.data[0].feature);
                // console.log('responseData',responseData);

                var data = this.state.selectedFace;
                data.push(file);
                this.setState({
                    selectedFace:data,
                    faceFeature:faceFeatureData
                });
                // console.log("selectedFace", this.state.selectedFace);
            }
        }).catch((err) => {
            console.log('error',err)
        })
    }

    // 获取最近人脸信息
    _getFaceListNow() {
        CommonFetch.doPost(API.getFaceListNow,`currentPage=${this.state.faceListcurrentPage}&pageSize=${this.state.faceListpageSize}`, (responseData) => {
            console.log(responseData);
            this._setFaceList(responseData);
        },null,null,null,this.props.User.faceToken);
    }

    // 加载更多的人脸数据
    _setFaceList(responseData) {
        let data = this.state.memeberList;
        if(responseData.data.items) {
            if(responseData.data.items.length < this.state.faceListpageSize) {
                this._setFaceLoadFinsh();
            }
            data = data.concat(responseData.data.items);
        } else {
            this._setFaceLoadFinsh();
        }
        this.setState({
            memeberList:data,
            faceListcurrentPage:responseData.data.currentPage,
            faceListpageSize:responseData.data.pageSize
        });
    }

    // 设置人脸数据获取了所有的
    _setFaceLoadFinsh() {
        this.setState({
            isAllList:true
        });
    }

    // 开启相册/相机
    _startCamera(index){
        // 弹出框配置
        let options = {
            title:"请选择",
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            quality:0.75,
            allowsEditing:true,
            noData:false,
            maxWidth:1000,
            maxHeight:750,
            storageOptions: {
                skipBackup: true,
                path:'images'
            }
        };
        if(!this.props.albumHidden){
            options = Object.assign({},options,{
                chooseFromLibraryButtonTitle:'选择相册',
            })
        }else{
            options = Object.assign({},options,{
                chooseFromLibraryButtonTitle:'',
            })
        }

        ImagePicker.showImagePicker(options,(res) => {

            if (res.didCancel) {  // 返回
                console.log('User cancelled image picker');
            } else {
                // console.log('res',res);
                this._getFaceImage_file(res);
                // this._getFaceImage_url(this.state.memeberList[0].imgUrl);


            }
        })
    }

    // 将字符串转换成byte数组
    stringToUtf8ByteArray(str){
        var out = [], p =0;
        for (var i =0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c <128) {
                out[p++] = c;
            }else if (c <2048) {
                out[p++] = (c >>6) |192;
                out[p++] = (c &63) |128;
            }else if (((c &0xFC00) ==0xD800) && (i +1) < str.length &&
                    ((str.charCodeAt(i +1) &0xFC00) ==0xDC00)) {
                c =0x10000 + ((c &0x03FF) <<10) + (str.charCodeAt(++i) &0x03FF);
                out[p++] = (c >>18) |240;
                out[p++] = ((c >>12) &63) |128;
                out[p++] = ((c >>6) &63) |128;
                out[p++] = (c &63) |128;
            }else {
                out[p++] = (c >>12) |224;
                out[p++] = ((c >>6) &63) |128;
                out[p++] = (c &63) |128;
            }
        }
        return out;
    }



    // 获取人脸信息列表item
    _renderItem = ({item,index}) =>{
        return(
        <View style={[GlobalStyles.center, styles.imageContent]}>
            <TouchableOpacity onPress = {() => this._showSelectFace(item)}>
                {item.imgUrl?
                    (<Image source={{uri:item.imgUrl}} style={styles.image}></Image>):
                    (<Image source={require("../../../assets/images/idcard_default.png")} style={styles.image}></Image>)}
            </TouchableOpacity>
        </View>)
    }

    // 加载更多的数据
    _getMoreFaceList= () =>{
        let i = this.state;
        console.log("isAllList", i);

        if(!this.state.isAllList) {
            this.state.faceListcurrentPage = this.state.faceListcurrentPage + 1;
            this._getFaceListNow();
        }
    }

    // ScrollView滑动到底部
    _handleScrollEnd = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollOffset = event.nativeEvent.contentOffset.y;
    
        const isEndReached = scrollOffset + scrollViewHeight  + 0.01>= contentHeight; // 是否滑动到底部
        const isContentFillPage = contentHeight >= scrollViewHeight; // 内容高度是否大于列表高度

        console.log('contentHeight',contentHeight);
        console.log('scrollViewHeight',scrollViewHeight);
        console.log('scrollOffset',scrollOffset);
        
        console.log('isEndReached', isEndReached);
        console.log('isContentFillPage',isContentFillPage);

    
        if (isContentFillPage && isEndReached) {
          this._getMoreFaceList();
        }
    };

    // 修改相似度
    _changeSimilarity = (e) =>{
        console.log(e);
        this.setState({
            faceSimilarity:e
        });
    }

    // 新增选中的人脸
    _addSlectFace = () =>{
        this._startCamera();
    }

    // 按条件搜素人脸
    _searchForFace =() =>{
        let url = API.getFaceForFaceImage;
        // var params = this.state.params;
        // var params = `filter=${this.state.faceSimilarity}&begin=${this.state.startTime}&end=${this.state.endTime}&IsUnion=true&Features=${this.state.faceFeature[0]}`;
        var params = `?IsUnion=true&Features=${this.state.faceFeature[0]}`;
        console.log('params',params);

        CommonFetch.doFetch3(url,params,(responseData)=>{
            console.log('responseData',responseData);
        },this.refs.toast,(faile)=>{

        },(err)=>{

        },this.state.faceToken);

    }

    

}

const styles = StyleSheet.create({
    _photoListView:{
        width:345,
        flexDirection: 'row' ,
        flexWrap: 'wrap' ,
        backgroundColor:'#051A78',
        borderColor:'#266ED9',
        borderRadius:4,
        padding:15,
        borderWidth:1
    },
    _selectFaceItemContent:{
        alignItems:'center',   //交叉轴的对齐方式    
        width:105,       
        height:105,  
        marginLeft:5,
        marginRight:5,
        marginTop:5,
        marginBottom:5  
    },

    _selectFaceItemImage:{
        width: 105,
        height:105,
        borderRadius: 4,
    },
    
    _deleteFaceImage:{
        width:20,
        height:20,
    },
    _text_upload:{
        marginTop:9,
        fontSize:14,
        color:"#D8D8D8"
    },

    _timeSelectContent:{
        width:300,
        height:50,
        backgroundColor:'#051A78',
        borderRadius:4
    },

    _timeTestStyle:{
        color:'#D8D8D8',
        fontSize:14,
    },

    _faceParamsContent:{
        width:335,
        backgroundColor:"#051A78",
        alignItems:"center",
        borderRadius:4,
        borderColor:'#266ED9',
        borderWidth:1
        
    },

    _faceContent:{
        width:'100%',
        backgroundColor:"#051A78",
        marginTop:27,
        alignItems:"center",
        borderColor:'#266ED9',
        borderWidth:1
    },
    _seachOk:{
        width:300,
        height:48,
        backgroundColor:'#2663ff',
        marginTop:30,
        borderRadius:4,
        alignItems:"center",
        justifyContent:"center",
        marginBottom:30,
    },
    _seachOkText:{
        color:'#D8D8D8',
        fontSize:15,
    },

    _faceList:{
        width:339,
    },

    imageContent:{   
        alignItems:'center',   //交叉轴的对齐方式    
        width:109,       
        height:109,  
        marginLeft:2,
        marginRight:2,
        marginTop:2,
        marginBottom:2     
        
    },
    image:{
        width: 109,
        height:109,
        borderRadius: 4,
    },
});
