import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    DeviceEventEmitter,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from "../../config/color";

export default class QuickSearchHeader extends Component{
    constructor(props) {
        super(props);
        this.isSpecialType = false;
        this.specialType = "";
        this.state = {
            keyword:"",
            placeholder:"请输入关键字"
        }
    }

    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('QuickSearch',(str,type) => {
            console.log("QuickSearchHeader",str,type);
            this.isSpecialType = true;
            this.specialType  = type;
            this.setState({
                keyword:str
            },this.clickSearch);
        });
    }

    componentWillUnmount(){
        this.subscription && this.subscription.remove();
    }

    changeText = (keyword) => {
        this.isSpecialType = false;
        this.setState({keyword});
    }

    clickSearch = () => {
        this.refs.quickSearchRef.blur();
        this.props.onSearch && this.props.onSearch(this.state.keyword,this.isSpecialType,this.specialType);
    }

    render(){
        return (

         <View style={[GlobalStyles.flexDirectRow,GlobalStyles.alignCenter,{paddingRight:15}]}>
            <View style={[GlobalStyles.flexDirectRow,GlobalStyles.center,GlobalStyles.flex,
                GlobalStyles.pageBg1,GlobalStyles.borderColor,styles.searchContainer]}>
                <FontAwesome name={"search"} size={12} color={Color.whiteColor} style={[GlobalStyles.mr10,GlobalStyles.ml10]} />
                <TextInput underlineColorAndroid={"transparent"} style={[GlobalStyles.flex,GlobalStyles.font14White,
                        styles.textInput]}
                        placeholder={this.state.placeholder} 
                        placeholderTextColor={Color.whiteColor}  
                        maxLength={30}
                        onSubmitEditing={this.clickSearch}
                        autoFocus={false} value={this.state.keyword} ref="quickSearchRef"
                        onChangeText={(keyword) => this.changeText(keyword)}
                    />
            </View>
            <TouchableOpacity onPress={this.clickSearch}>
                <Text style={[GlobalStyles.font14White,{paddingLeft:15}]}>搜索</Text>
            </TouchableOpacity>
          </View>
        );
    }

}

const styles = StyleSheet.create({
    searchContainer:{
        borderRadius: 3,
        height:32,
        borderWidth:1,
    },
    textInput:{
        padding:0,
        margin:0,
    },
    searchButton:{
        height: 30,
        width:43,
        marginLeft: 15,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
    }
});