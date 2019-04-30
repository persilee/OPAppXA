import React, { Component } from 'react';
import {
    StyleSheet,
    Text,TouchableOpacity,TouchableWithoutFeedback,
    View,PixelRatio,Modal,Image,Platform,
} from 'react-native';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {observer,inject} from 'mobx-react/native'
import Toast, {DURATION} from 'react-native-easy-toast';
import RoutApi from '../../api/index';
import ImagePicker from 'react-native-image-picker';
import {imageBaseUrl} from '../../config/index';

import Color from "../../config/color";
import CommonBtn from  '../../componets/CommonBtn';

@inject('CheckData')
@inject('User')
@observer
export default class DealTaskPhoto extends Component {


    constructor(props) {
        super(props);
        let type = this.props.navigation.getParam('type','');

        let lifePhoto = [];
        let maxPhotoNum = 1;
        let roomerIndex = 0;
        if(type=='house'){
            if(this.props.CheckData.data.imgUrl1!=null && this.props.CheckData.data.imgUrl1!=''){
               lifePhoto.push(this.props.CheckData.data.imgUrl1); 
            }
            if(this.props.CheckData.data.imgUrl2!=null && this.props.CheckData.data.imgUrl2!=''){
               lifePhoto.push(this.props.CheckData.data.imgUrl2); 
            }
            if(this.props.CheckData.data.imgUrl3!=null && this.props.CheckData.data.imgUrl3!=''){
               lifePhoto.push(this.props.CheckData.data.imgUrl3); 
            }
            if(this.props.CheckData.data.imgUrl4!=null && this.props.CheckData.data.imgUrl4!=''){
               lifePhoto.push(this.props.CheckData.data.imgUrl4); 
            }
            maxPhotoNum = 4;
        }else if(type=='houseMaster'){
            if(this.props.CheckData.data.imgUrl!=null && this.props.CheckData.data.imgUrl!=''){
               lifePhoto.push(this.props.CheckData.data.imgUrl); 
            }
            maxPhotoNum = 1;
        }else if(type=='roomer'){
            roomerIndex = this.props.navigation.getParam('roomerIndex',0)
            if(this.props.CheckData.personData[roomerIndex].imgUrl!=null && this.props.CheckData.personData[roomerIndex].imgUrl!=''){
               lifePhoto.push(this.props.CheckData.personData[roomerIndex].imgUrl); 
            }
            maxPhotoNum = 1;
        }
        this.state = {
            type:type,
            msgVisible:false,
            lifePhoto:lifePhoto,
            maxPhotoNum:maxPhotoNum,
            roomerIndex:roomerIndex,
        };

    }

    



    uploadFunc = (msg) =>{
        this.refs.toast.show(msg);
    }

    setModal=(flag)=>{
        this.setState({
            msgVisible:flag,
        });
    }

    save=()=>{
        if(this.state.type=='house'){
            this.state.lifePhoto.map((item,index)=>{
                this.props.CheckData.updateByKey('imgUrl'+(index+1),item)
            })
            this.props.navigation.navigate('DealTask');
        }

        if(this.state.type=='houseMaster'&& this.state.lifePhoto.length>0){
            this.props.CheckData.updateByKey('imgUrl',this.state.lifePhoto[0]);
            this.props.navigation.navigate('DealTask');
        }

        if(this.state.type=='roomer'&& this.state.lifePhoto.length>0){
            this.props.CheckData.updatePersonByKey(this.state.roomerIndex,'imgUrl',this.state.lifePhoto[0]);
            this.props.navigation.navigate('DealTaskPerson');
        }

        
    }
    


    uploadImage=(nativeUri,callback)=>{

        console.log('this.props.User.token',this.props.User.token)

        let formData = new FormData();
        let file = {uri: nativeUri, type: 'multipart/form-data', name: 'image.png'};   //这里的key(uri和type和name)不能改变,
        formData.append('file',file);
        let filePath = '';

        if(this.state.type=='house'){
            filePath='policehousephoto';
        }else{
            filePath='policelifephoto';
        }

        let url = RoutApi.imageUpload+'?fileType=image&filePath='+filePath;
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
                           <TouchableOpacity style={[styles.photoView,GlobalStyles.containerBg,styles.addView]} onPress={()=>(this.startCamera(this.state.lifePhoto.length))}>
                                <Text style={GlobalStyles.font50White}>+</Text>
                            </TouchableOpacity> 
                        ):null}
                    
                </View>

                <CommonBtn text={'保存'} onPress={this.save} style={[GlobalStyles.mt30]} 
                        containerStyle = {styles.submitBtn}></CommonBtn>

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
    },

});

