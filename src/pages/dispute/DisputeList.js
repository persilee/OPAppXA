import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';


import GlobalStyles from "../../../assets/styles/GlobalStyles";
import ScrollableTabView, {DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import CheckListWait from '../check/CheckListWait'
import CheckListDone from '../check/CheckListDone'
import WaitDisputeList from './WaitDisputeList'
import Color from "../../config/color";

export default class DisputeList extends Component {

    constructor(props) {
        super(props);
        _this = this
    }


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

                    <WaitDisputeList type= 'wait' navigation={this.props.navigation} tabLabel='待处理纠纷'/>
                    <WaitDisputeList type= 'success' navigation={this.props.navigation} tabLabel='已处理纠纷'/>

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