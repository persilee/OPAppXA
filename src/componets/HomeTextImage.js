import React, { Component } from 'react';
import {
    StyleSheet,Image,
    Text,Platform,
    View,PixelRatio,TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../../assets/styles/GlobalStyles';

// const size = 64/PixelRatio.get();

export default  class  HomeTextImage extends  Component{

    static propTypes = {
        title:PropTypes.string.isRequired,
        name: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]).isRequired,
        height:PropTypes.number.isRequired,
        iconOutSize:PropTypes.number.isRequired,
        iconSize:PropTypes.number.isRequired,
        color:PropTypes.string.isRequired,
        onPress:PropTypes.func,
        isImage:PropTypes.bool,
    }

    static defaultProps = {
        isImage: false
    }

    constructor(props){
        super(props);
    }

    render(){
        let viewPaddingTop = 0;
        if(Platform.OS == 'android'){
            viewPaddingTop = 5;
        }

        return (
            <TouchableOpacity style={[{height:this.props.height,justifyContent:"center",alignItems:"center",
                paddingTop:viewPaddingTop},this.props.style]}
                              onPress={this.props.onPress}>
                <View style={{backgroundColor:this.props.color,justifyContent:"center",alignItems:"center",
                    width:this.props.iconOutSize,height:this.props.iconOutSize,borderRadius:this.props.iconOutSize/2}}>
                     {
                        this.props.isImage ? <Image source={this.props.name} resizeMode={"contain"}
                            style={{tintColor:"#fff",width:this.props.iconSize,height:this.props.iconSize}} /> :  
                        <FontAwesome name={this.props.name} size={this.props.iconSize} color={"#fff"} />
                     }
                </View>

                <Text style={[styles.itemFont,GlobalStyles.font14White]}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemFont:{
        marginTop:Platform.OS == 'ios' ? 9 : 0,
    }

});