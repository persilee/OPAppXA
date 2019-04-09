import React, { Component } from 'react';
import {
    StyleSheet,TextInput,
    Text,TouchableOpacity,
    View,Image,

} from 'react-native';

import GlobalStyles from '../../assets/styles/GlobalStyles';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default class ItemInput extends Component {

    constructor(props) {
        super(props);

    }

    render() {
       let {name,style,textType,textValue,imageURL,imageStyle,pressFunc,arrowVisible,leftStyle,rightStyle,rightFontStyle,...props} = this.props;
       let rightView = null,rightArrowView = null;
       if(textType == "image"){
           rightView =(
               <View style={[GlobalStyles.flex,styles.alignEnd]}>
                    <Image source={imageURL} style={[styles.imageStyle,imageStyle]} />
               </View>
           );
       }else if(textType == 'text'){
           rightView = (
               <View style={[{height:20},rightStyle]} >
                   <Text style={[GlobalStyles.font14Gray,GlobalStyles.taRight,rightFontStyle]} {...props}>{textValue}</Text>
               </View>
           );
       } else if (textType == 'textLine'){
           <View style={[{ height: 20 }, rightStyle]} >
               <Text style={[GlobalStyles.font14Gray, rightFontStyle]} {...props}>{textValue}</Text>
           </View>
       }else if(textType == 'input' || !textType){
           rightView = (
               <TextInput
                   style={[GlobalStyles.font14Gray,GlobalStyles.taRight,rightStyle]}
                   underlineColorAndroid={"transparent"}
                   {...props}
               />
           );
       }
       if(arrowVisible){
           rightArrowView = (
               <FontAwesome name={"angle-right"} color={"#ccc"} size={22} style={GlobalStyles.ml5} />
           );
       }

        return (
            pressFunc ? 
              (<TouchableOpacity style={[GlobalStyles.flexDirectRow,GlobalStyles.pageBg1,styles.viewContainer,style]} onPress={pressFunc && pressFunc}>
                  <Text style={[GlobalStyles.font14Gray,leftStyle]}>{name}</Text>
                  <View style={styles.rightView}>
                    {rightView}
                    {rightArrowView}
                  </View>
              </TouchableOpacity>)
            :
              (<View style={[GlobalStyles.flexDirectRow,GlobalStyles.pageBg1,styles.viewContainer,style]}>
                  <Text style={[GlobalStyles.font14Gray,{width:100},leftStyle]}>{name}</Text>
                  <View style={styles.rightView}>
                    {rightView}
                    {rightArrowView}
                  </View>
              </View>)
            
            
        );
    }

}

const styles = StyleSheet.create({
    viewContainer:{
        height:50,
        justifyContent: 'space-between',
        alignItems:  'center' 
    },
    rightView:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center' 
    },
    imageStyle:{
        width:30,
        height:30,
        borderRadius:15,
    },
    alignEnd:{
        alignItems:"flex-end"
    }


});

