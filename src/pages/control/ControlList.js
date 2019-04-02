import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';

import GlobalStyles from "../../../assets/styles/GlobalStyles";
import ScrollableTabView, {DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ControlScene from "./ControlScene";
import Color from "../../config/color";
export default class ControlList  extends Component {

    constructor(props) {
        super(props);
    }

    // changeTab = (obj) => {
    //     if(obj.i == 0){
    //         this.refs.controlTodoList.changeTabFetchData();
    //     }else if(obj.i == 1){
    //         this.refs.controlAlreadyList.changeTabFetchData();
    //     }
    // }

    render() {

        return (
            <View style={[GlobalStyles.pageBg]}>
                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar style={{borderWidth: 1,borderColor: Color.tabAndOtherBgColor,height:60}}/>}
                    style={{borderWidth: 0,height:60}}
                    tabBarPosition={"top"}
                    tabBarBackgroundColor={Color.tabAndOtherBgColor}
                    tabBarActiveTextColor={Color.whiteColor}
                    tabBarInactiveTextColor={Color.whiteAlpha50Color}
                    tabBarTextStyle={styles.tabBarText}
                    tabBarUnderlineStyle={styles.tabBarUnderline}>

                    <ControlScene tabLabel='待处理任务' navigation={this.props.navigation}
                        readStatus="0" ref="controlTodoList"></ControlScene>
                    <ControlScene tabLabel='历史类任务' navigation={this.props.navigation}
                        readStatus="1" ref="controlAlreadyList"></ControlScene>
                    
                </ScrollableTabView>

            </View>
        );
    }

   
}

const  styles = StyleSheet.create({
    tabBarText: {
        fontSize: 14,
        marginTop: 13,
    },
    tabBarUnderline: {
        backgroundColor: Color.whiteColor,
        opacity: 0.8,
        width:'9%',
        marginLeft:'15%'
    },

});