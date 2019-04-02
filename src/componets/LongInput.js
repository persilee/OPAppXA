import React, { Component } from 'react';
import {
    StyleSheet,TextInput,
    Text,TouchableOpacity,
    View,Image,Modal

} from 'react-native';

import GlobalStyles from '../../assets/styles/GlobalStyles';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from "../config/color";

export default class LongInput extends Component {

    constructor(props) {
        super(props);

    }

    render() {
       let {show,title,value,onChangeText,close,...props} = this.props;
       

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={show}
                onRequestClose={close}
                >
                <View style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]}>
                    <View style={[styles.modal,GlobalStyles.containerBg]}>
                        
                        <TextInput
                            defaultValue={value}
                            onChangeText={onChangeText}
                            onSubmitEditing={close}
                            multiline={true}
                            placeholder={'请输入'+title}
                            placeholderTextColor={Color.whiteColor}
                            style={[styles.input,GlobalStyles.font15White]}>
                        </TextInput>
                            
                        <TouchableOpacity style={[styles.buttonView,GlobalStyles.lineBlackTop]} onPress={close}>
                            <Text style={GlobalStyles.font14White}>确定</Text>
                        </TouchableOpacity>
                    
                    </View>
                </View>

            </Modal>
            
        );
    }

}

const styles = StyleSheet.create({
    
    modal:{
        flexDirection: 'column',
        justifyContent:  'center' ,
        alignItems:  'center' ,
        height:150,
        width:300,
        borderRadius: 8,
    },

    buttonView:{
        width:300,
        height:50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:  'center',
    },
    input:{
      textAlignVertical: 'top' ,
      borderRadius: 5,
      height:100,
      width:270,
      marginLeft:15,
      marginTop: 15,
      marginLeft: 15,
    }
});

