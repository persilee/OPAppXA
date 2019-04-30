import React, { Component } from 'react';
import {
    StyleSheet,
    Text,TouchableOpacity,TouchableWithoutFeedback,
    View,PixelRatio,Modal,Image,Platform,
} from 'react-native';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonIdCardUpload from '../../componets/CommonIdCardUpload';
import {observer,inject} from 'mobx-react/native'
import Toast, {DURATION} from 'react-native-easy-toast';
import RoutApi from '../../api/index';
import {imageBaseUrl} from '../../config/index';
import CommonBtn from  '../../componets/CommonBtn';
import Color from "../../config/color";

@inject('CheckData')
@inject('DisputeData')
@inject('User')
@observer
export default class DealTaskCard extends Component {


    constructor(props) {
        super(props);

        let type = this.props.navigation.getParam('type','');
        let peopleIndex = this.props.navigation.getParam('peopleIndex','');
        let personIndex = 0;
        let idcardFrontUrl = '';
        let idcardBackUrl = '';
        if(type=='roomer'){
            personIndex = this.props.navigation.getParam('roomerIndex',0);
            idcardFrontUrl = this.props.CheckData.personData[personIndex].identyPhoto1;
            idcardBackUrl = this.props.CheckData.personData[personIndex].identyPhoto2;
        }
        if(type == 'houseMaster'){
            idcardFrontUrl = this.props.CheckData.data.identyPhoto1;
            idcardBackUrl = this.props.CheckData.data.identyPhoto2;
        }
        if(type == 'disputePeople'){
            debugger
            if(this.props.DisputeData.dPeopleImgList[peopleIndex] != null){
                idcardFrontUrl = this.props.DisputeData.dPeopleImgList[peopleIndex].idcardFrontUrl
                idcardBackUrl = this.props.DisputeData.dPeopleImgList[peopleIndex].idcardBackUrl
            }
        }

        this.state = {
            modalVisible:false,
            msgVisible:false,
            personIndex:personIndex,
            type:type,
            idcardFrontUrl:idcardFrontUrl,
            idcardBackUrl:idcardBackUrl,
            ocrFlag:true,
            //涉事人员坐标
            peopleIndex:peopleIndex,
        };

    }

    setModal = (flag)=>{
        this.setState({
            modalVisible:flag,
        });
    }

    setMsgModal = (flag)=>{
        this.setState({
            msgVisible:flag,
        });
    }

    valid = () => {

        if (!this.state.ocrFlag) {
            this.refs.toast.show('身份证人像照片OCR识别失败，请重新上传图片');
            return false;
        }


        return true;
    }



    uploadFunc = (msg) =>{
        this.refs.toast.show(msg);
    }

    idCardCallBack = (type,value) => {

        if(type == 'identyPhoto1'){
            this.setState({
                idcardFrontUrl:value,
                ocrFlag:false
            })
        }else{
            this.setState({
                idcardBackUrl:value,
                ocrFlag:false
            })
        }

        if(this.state.idcardFrontUrl&&this.state.idcardBackUrl){
            this.refs.toast.show('正在进行OCR识别,请等待一会');
            this.idCardOcr();
        }

        
    }

    save =()=>{
        if(this.valid()){
            if(this.state.type == 'houseMaster'){
                this.props.navigation.navigate('DealTask')
            } else if(this.state.type == 'disputePeople'){
                this.props.navigation.navigate('DisputeTask')
            } else{
                this.props.navigation.navigate('DealTaskPerson')
            }
        }
    }



    idCardOcr=()=>{

        console.log('this.props.User.token',this.props.User.token)

        let formData = new FormData();
        let idcardFront = {uri: this.state.idcardFrontUrl, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,
        let idcardBack = {uri: this.state.idcardBackUrl, type: 'multipart/form-data', name: 'image.png'};
        formData.append('idcardFront',idcardFront);
        formData.append('idcardBack',idcardBack);


        let url = RoutApi.idCardUploadOcr+'?fileType=image&filePath=policeidcard';
        console.log('token',this.props.User.token)

        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
                'Authorization': this.props.User.token,
                'areaKey': this.props.User.areaKey
            },
            body:formData,
        })
        .then((response) => response.text() )
        .then((responseData)=>{
            console.log('responseData',responseData)

            let result = JSON.parse(responseData);
            if(result.code==0){
                this.refs.toast.show('OCR识别成功!');
                if(this.state.type == 'houseMaster'){
                    this.props.CheckData.updateByKey('idcardUrl',result.data.idcardFaceUrl);
                    this.props.CheckData.updateByKey('identyPhoto1',result.data.idcardFrontUrl);
                    this.props.CheckData.updateByKey('identyPhoto2',result.data.idcardBackUrl);
                } else if(this.state.type == 'disputePeople'){
                    if(result.data.idcardBackInfo.result_list[0].code !=0){
                        this.refs.toast.show('身份证背面识别失败，请重新上传图片');
                        this.setState({
                            ocrFlag:false
                        })
                        return;
                    }
                    if(result.data.idcardFrontInfo.result_list[0].code !=0){
                        this.refs.toast.show('身份证正面识别失败，请重新上传图片');
                        this.setState({
                            ocrFlag:false
                        })
                        return;
                    }
                    this.props.DisputeData.updateDisputePeopleImagesByKey(this.state.peopleIndex,"idcardFrontUrl",result.data.idcardFrontUrl)
                    this.props.DisputeData.updateDisputePeopleImagesByKey(this.state.peopleIndex,"idcardBackUrl",result.data.idcardBackUrl)
                    this.props.DisputeData.updateDisputePeopleImagesByKey(this.state.peopleIndex,"idcardFaceUrl",result.data.idcardFaceUrl)
                } else{
                    this.props.CheckData.updatePersonByKey(this.state.personIndex,'identyPhoto',result.data.idcardFaceUrl);
                    this.props.CheckData.updatePersonByKey(this.state.personIndex,'identyPhoto1',result.data.idcardFrontUrl);
                    this.props.CheckData.updatePersonByKey(this.state.personIndex,'identyPhoto2',result.data.idcardBackUrl);
                }
                this.setState({
                    ocrFlag:true
                })
            }else{
                this.refs.toast.show('身份证人像照片OCR识别失败，请重新上传图片');
            }
            
        })
        .catch((error)=>{
            console.log('error',error)
            this.refs.toast.show('身份证人像照片OCR识别失败，请重新上传图片');
        });

    }

    render() {


        return (

            <View style={[GlobalStyles.pageBg,GlobalStyles.pdlr15]}>
                <View style={[GlobalStyles.alignCenter]}>

                    <View style={[GlobalStyles.flexDirectRow,GlobalStyles.center,{marginTop:35}]}>
                        <Text style={GlobalStyles.font15Gray}>拍摄/上传您的二代身份证</Text>
                        <TouchableOpacity onPress={ () => this.setModal(true)}>
                            <FontAwesome name={"question-circle-o"} size={20} color={Color.whiteColor} style={GlobalStyles.ml10}/>
                        </TouchableOpacity>
                    </View>

                    <CommonIdCardUpload text={'点击拍摄/上传人像面'} bg={require('../../../assets/images/id_front.png')} style={GlobalStyles.mt30}
                        imageType = {'identyPhoto1'} callBack={this.idCardCallBack} url={this.state.idcardFrontUrl}
                    >
                    </CommonIdCardUpload>

                    <CommonIdCardUpload text={'点击拍摄/上传国徽面'} bg={require('../../../assets/images/id_back.png')} style={GlobalStyles.mt30}
                        imageType = {'identyPhoto2'}  callBack={this.idCardCallBack} url={this.state.idcardBackUrl}
                    >
                    </CommonIdCardUpload>

                </View>

                <CommonBtn text={'保存'} onPress={this.save} style={[GlobalStyles.mt30]} 
                        containerStyle = {styles.submitBtn}></CommonBtn>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={ () => this.setModal(false)}>
                    <View style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]}>
                        <TouchableWithoutFeedback onPress={ () => this.setModal(false)}>
                            <Image source={require('../../../assets/images/id_sample.png')} />
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.msgVisible}
                    onRequestClose={ () => this.setMsgModal(false)}>
                    <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]} onPress={ () => this.setMsgModal(false)}>
                        <View style={{backgroundColor: Color.fontColor,borderRadius: 5}}>
                            <Text>上传失败,返回重新上传</Text>
                        </View>
                    </TouchableOpacity>
                </Modal>
                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={3000} opacity={0.8}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    submitBtn:{
        borderRadius:8,
    },

});

