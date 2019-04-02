import React, { Component } from 'react';
import { StyleSheet, Button, TextInput, View, Text, Image, TouchableOpacity,} from 'react-native';

import GlobalStyles from '../../assets/styles/GlobalStyles';
import {observer,inject} from 'mobx-react';

@inject('User')
@observer
export default class HomeHeader extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <Text style={styles.headerText}></Text>
        );
    }
 }

const styles = StyleSheet.create({
    headerText:{
        fontSize:20,color:"#fff",flex:1,textAlign:"center"
    }
});
