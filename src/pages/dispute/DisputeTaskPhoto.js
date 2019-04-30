import React, { Component } from 'react';
import {
    StyleSheet,
    Text,TouchableOpacity,TouchableWithoutFeedback,
    View,PixelRatio,Modal,Image,Platform,
} from 'react-native';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {observer,inject} from 'mobx-react/native';
import Toast, {DURATION} from 'react-native-easy-toast';
import RoutApi from '../../api/index';
import ImagePicker from 'react-native-image-picker';
import {imageBaseUrl} from '../../config/index';
import CommonBtn from  '../../componets/CommonBtn';

@inject('DisputeData')
@inject('User')
@observer
export default class DisputeTaskPhoto extends Component {

    constructor(props) {
        super(props);
        let type = this.props.navigation.getParam('type','');
        let taskId = this.props.navigation.getParam('taskId','');
        let peopleIndex = this.props.navigation.getParam('peopleIndex','');
        let viewType = this.props.navigation.getParam('viewType','');


        let lifePhoto = [];
        let maxPhotoNum = 1;
        let roomerIndex = 0;

        if(type=='dispute'){
            if(this.props.DisputeData.disputeImages.imgUrl1!=null && this.props.DisputeData.disputeImages.imgUrl1!=''){
                lifePhoto.push(this.props.DisputeData.disputeImages.imgUrl1);
            }
            if(this.props.DisputeData.disputeImages.imgUrl2!=null && this.props.DisputeData.disputeImages.imgUrl2!=''){
                lifePhoto.push(this.props.DisputeData.disputeImages.imgUrl2);
            }
            if(this.props.DisputeData.disputeImages.imgUrl3!=null && this.props.DisputeData.disputeImages.imgUrl3!=''){
                lifePhoto.push(this.props.DisputeData.disputeImages.imgUrl3);
            }
            if(this.props.DisputeData.disputeImages.imgUrl4!=null && this.props.DisputeData.disputeImages.imgUrl4!=''){
                lifePhoto.push(this.props.DisputeData.disputeImages.imgUrl4);
            }
            maxPhotoNum = 4;
        }else if(type='people'){
            if(this.props.DisputeData.dPeopleImgList[peopleIndex] != null && this.props.DisputeData.dPeopleImgList[peopleIndex].imgUrl != null){
                lifePhoto.push(this.props.DisputeData.dPeopleImgList[peopleIndex].imgUrl);
            }
            maxPhotoNum = 1;
        }

        if(viewType=='view'){
            maxPhotoNum = -1;
        }

        this.state = {
            type:type,
            taskId:taskId,
            peopleIndex:peopleIndex,
            msgVisible:false,
            lifePhoto:lifePhoto,
            maxPhotoNum:maxPhotoNum,
            roomerIndex:roomerIndex,
            viewType:viewType,
        };

    }




    uploadFunc = (msg) =>{
        this.refs.toast.show(msg);
    };

    setModal=(flag)=>{
        this.setState({
            msgVisible:flag,
        });
    };

    save=()=>{
        if(this.state.type=='dispute'){
            this.state.lifePhoto.map((item,index)=>{
                this.props.DisputeData.updateDisputeImagesByKey('imgUrl'+(index+1) , item)
            });
            this.props.navigation.navigate('DisputeTask');
        }else if(this.state.type='people'){
            this.props.DisputeData.updateDisputePeopleImagesByKey(this.state.peopleIndex,'imgUrl' , this.state.lifePhoto[0])
            this.props.navigation.navigate('DisputeTask');
        }
    };
    


    uploadImage=(nativeUri,callback)=>{

        console.log('this.props.User.token',this.props.User.token)

        let formData = new FormData();
        let file = {uri: nativeUri, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,
        formData.append('file',file);
        //+ '/' + this.state.taskId;
        formData.append('filePath',this.state.type);
        formData.append('fileType','image');
        //+'?fileType=image&filePath='+encodeURI(filePath)
        let url = RoutApi.imageUpload;
        console.log('url',url);
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
                this.refs.toast.show('图片上传成功!');
                callback && callback(result.data && result.data.fileUrl)
            }else{
                this.setModal(true);
            }
            
        })
        .catch((error)=>{
            console.log('error',error)
            this.setModal(true);
        });

    }


    startCamera=(index)=>{
        if(this.state.viewType == 'view'){
            return;
        }

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
                let source;  // 保存选中的图片
                source = {uri: 'data:image/jpeg;base64,' + res.data};

                if (Platform.OS === 'android') {
                    source = { uri: res.uri };
                } else {
                    source = { uri: res.uri.replace('file://','') };
                }

                this.uploadImage(source.uri,(filePath)=>{
                    let lifePhoto = this.state.lifePhoto;
                    if(this.state.lifePhoto.length-1< index){
                        lifePhoto.push(imageBaseUrl+filePath);
                    }else{
                        lifePhoto.splice(index,1,imageBaseUrl+filePath);
                    }
                    console.log('lifePhoto',lifePhoto)
                    this.setState({
                        lifePhoto:lifePhoto
                    })
                })
                
            }
        })
    }

    render() {
        return (

            <View style={[GlobalStyles.pageBg,GlobalStyles.pdlr15]}>
                <View style={styles.photoListView}>
                    {this.state.lifePhoto.map((item,index)=>{
                        return(
                            <TouchableOpacity key={index} style={styles.photoView} onPress={()=>(this.startCamera(index))}>
                                <Image source={{uri:item}} style={styles.photo}></Image>
                            </TouchableOpacity>
                        )
                    })}

                    {this.state.lifePhoto.length<this.state.maxPhotoNum?
                        (
                           <TouchableOpacity style={[styles.photoView,styles.addView,GlobalStyles.containerBg]} 
                                onPress={()=>(this.startCamera(this.state.lifePhoto.length))}>
                                <Text style={GlobalStyles.font50White}>+</Text>
                            </TouchableOpacity> 
                        ):null}
                    
                </View>

                {
                    this.state.viewType=='view'?(<View/>):(
                        <CommonBtn text={'保存'} onPress={this.save} style={[GlobalStyles.mt30]} 
                            containerStyle = {styles.submitBtn}></CommonBtn>
                    )
                }

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.msgVisible}
                    onRequestClose={ () => this.setModal(false)}>
                    <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]} onPress={ () => this.setModal(false)}>
                        <Text>上传失败,返回重新上传</Text>
                    </TouchableOpacity>
                </Modal>
                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={3000} opacity={0.8}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    photoListView:{
        flexDirection: 'row' ,
        flexWrap: 'wrap' ,
        marginTop: 20,
        paddingLeft: 15,
    },
    photoView:{
        width:106,
        height:123,
        borderRadius: 5,
        marginBottom: 20,
        marginRight: 15,
    },
    photo:{
        width:106,
        height:123,
        borderRadius: 5,
    },
    addView:{
        flexDirection: 'row',
        justifyContent:  'center',
        alignItems: 'center' ,
    },
    submitBtn:{
        borderRadius:8,
    }

});

