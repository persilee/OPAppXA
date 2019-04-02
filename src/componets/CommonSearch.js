import React, { Component } from 'react';
import {
    StyleSheet,TextInput,
    Text,TouchableOpacity,
    View,PixelRatio,
} from 'react-native';
import PropTypes from 'prop-types';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from "../config/color";
export default class CommonSearch extends Component {

    static defaultProps = {
        searchIconSize: 12,
        searchIconColor:Color.whiteColor,
    }

    constructor(props) {
        super(props);
        this.state = {
            keyword:""
        }
    }

    render() {
        let {searchIconSize,searchIconColor,style,...props} = this.props;

        return (
                <View style={[GlobalStyles.flexDirectRow,GlobalStyles.center,styles.searchContainer,style]}>
                    <FontAwesome name={"search"} size={searchIconSize} color={searchIconColor} style={[GlobalStyles.mr10,GlobalStyles.ml10]} />

                    <TextInput underlineColorAndroid={"transparent"} style={[GlobalStyles.flex,GlobalStyles.font14White,styles.textInput]}
                               {...props}  ref="commonSerachInputRef" />
                </View>
        );
    }

}

const  styles = StyleSheet.create({
    searchContainer:{
        borderRadius: 3,
        height:36,
    },
    textInput:{
        padding:0,
        margin:0,
    }
});