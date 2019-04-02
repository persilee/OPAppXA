import React, { Component } from 'react';
import {
    StyleSheet,
    Text, TouchableOpacity,ImageBackground,
    View, PixelRatio, Modal, Image, Platform,

} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RoutApi from '../api/index';
import Color from "../config/color";

export default class CommonIdCardUpload extends Component {

    constructor(props) {
        super(props);
        let {url} = this.props;
        console.log('CommonIdCardUpload',url)
        this.state = {
            avatarSource:url?{uri:url}:"",
        }
    }

    imagePicker = () =>{
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
                console.log("showImagePicker",source);
                console.log("showImagePicker",res);

                this.setState({
                    avatarSource: source
                });

                this.props.callBack && this.props.callBack(this.props.imageType,source.uri);
            }
        })
    }

    render() {

        let {text,bg,style,cameraSize,cameraStyle,...props} = this.props;

        let view = null;
        if(this.state.avatarSource){ //有图
            view = (
                <View style={[{position:'relative',width:"100%",height:"100%",},styles.editImageContainer]}>
                    <TouchableOpacity style={{width:"100%",height:"100%"}} onPress={this.imagePicker}>
                        <Image source={this.state.avatarSource}  style={styles.editImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editContainer,GlobalStyles.center]} onPress={this.imagePicker}>
                        <FontAwesome name={"edit"} size={14} color={Color.whiteColor} />
                    </TouchableOpacity>
                </View>
            );
        }else{
            view = (
                <View style={{position:'relative'}}>
                    <Image source={bg} resizeMode={"cover"} />
                    <View style={[styles.posAbsolute,GlobalStyles.center]}>
                        <View style={[GlobalStyles.containerBg,styles.idBlueContainer,GlobalStyles.center,cameraStyle]}>
                            <FontAwesome name={'camera'} size={cameraSize ? cameraSize : 24} color={Color.whiteColor} />
                        </View>
                        <Text style={styles.idLabel}>{text}</Text>
                    </View>
                </View>
            );
        }

        return (
            <TouchableOpacity  style={[GlobalStyles.center,styles.uploadContainer,GlobalStyles.whiteBg,style]} 
                    onPress={this.imagePicker}>
                {view}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    uploadContainer:{
        width:197,
        height:118,
        borderRadius:5,
        shadowColor:Color.blackAlpha50Color,
        shadowOffset:{h:5,w:5},
        shadowRadius:5,
        shadowOpacity:0.1,
        elevation: 4,
    },
    editImageContainer:{
        //paddingLeft:18,
        //paddingRight:18,
        //paddingTop:10,
        //paddingBottom:10,
    },
    posAbsolute:{
        position:"absolute",
        left:0,
        right:0,
        top:0,
        bottom:0,
        margin:0,
        padding:0,
        // backgroundColor:"red",
        // width:"100%",
        // height:"100%",
    },
    avatar: {
        // width:197,
        // height:118,
    },
    idBlueContainer:{
        width:60,
        height:60,
        borderRadius:30,
    },
    idLabel:{
        fontSize: 14,
        color: Color.btnColor,
        marginTop:13,
    },
    editContainer:{
        backgroundColor:Color.btnColor,
        borderRadius:5,
        position:"absolute",
        width:22,
        height:22,
        left:0,
        bottom:0,
    },
    editImage:{
        transform: [{rotate:'-90deg'}],
        marginTop:-44,
        marginLeft:33,
        width:128,
        height:200,
        borderRadius:6,
    }
});