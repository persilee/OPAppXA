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
import CommonBtn from  '../../componets/CommonBtn';

export default class CheckResultPhoto extends Component {


    constructor(props) {
        super(props);
        let photoList = this.props.navigation.getParam('photoList',[]);

        
        this.state = {
            msgVisible:false,
            lifePhoto:photoList,
            selectImageUrl:''
        };

    }

    
    setModal=(flag)=>{
        this.setState({
            msgVisible:flag
        })
    }

    goBack=()=>{
        this.props.navigation.goBack();
    }

    openLargeImage=(index)=>{
        this.setState({
            selectImageUrl:this.state.lifePhoto[index],
            msgVisible:true
        })
    }


    render() {
        return (

            <View style={[GlobalStyles.pageBg,GlobalStyles.pdlr15]}>
                <View style={styles.photoListView}>
                    {this.state.lifePhoto.map((item,index)=>{
                        return(
                            <TouchableOpacity key={index} style={styles.photoView} onPress={()=>(this.openLargeImage(index))}>
                                <Image source={{uri:item}} style={styles.photo}></Image>
                            </TouchableOpacity>
                        )
                    })}
                    
                </View>

                <CommonBtn text={'返回'} onPress={this.goBack} 
                    style={[GlobalStyles.mt30,GlobalStyles.pdlr15]} 
                    containerStyle = {styles.buttonTouch}></CommonBtn> 

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.msgVisible}
                    onRequestClose={ () => this.setModal(false)}>
                    <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]} onPress={ () => this.setModal(false)}>
                        <Image source={{uri:this.state.selectImageUrl}} style={styles.photoLarge} resizeMode={'contain'}></Image>
                    </TouchableOpacity>
                </Modal>
                <Toast ref="toast" position={"center"}  fadeInDuration={1500} />
            </View>
        );
    }
}

const styles = StyleSheet.create({


    buttonTouch:{
        borderRadius:8,
    },
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

    photoLarge:{
        width:'100%',
        height:'100%'
    }

});

