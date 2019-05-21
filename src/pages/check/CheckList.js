import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';


import GlobalStyles from "../../../assets/styles/GlobalStyles";
import ScrollableTabView, {DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import CheckListWait from './CheckListWait'
import CheckListDone from './CheckListDone'
import Color from "../../config/color";


export default class  CheckList extends Component {


    constructor(props) {
        super(props);
        this.type = this.props.navigation.getParam('type', {});
    }


    render() {

        return (
            <View style={[GlobalStyles.pageBg,{position:"relative"}]}>

                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar style={{borderWidth: 1,borderColor:Color.tabAndOtherBgColor,height:60}}/>}
                    tabBarUnderlineStyle ={styles.tabBarUnderline}
                    tabBarPosition={"top"}
                    tabBarBackgroundColor={Color.tabAndOtherBgColor}
                    tabBarActiveTextColor={Color.whiteColor}
                    tabBarInactiveTextColor={Color.whiteAlpha50Color}
                    tabBarTextStyle={styles.tabBarText}
                    style={{borderWidth: 0,height:60}}>

                    <CheckListWait type={this.type} navigation={this.props.navigation} tabLabel='待核查任务'/>
                    <CheckListDone type={this.type} navigation={this.props.navigation} tabLabel='已核查任务'/>
                    
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