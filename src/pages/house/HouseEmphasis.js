import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Platform,
    BackHandler,
} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import HouseAllScene from "./HouseAllScene";
import {width} from "../../utils/Common";
import Color from "../../config/color";
export default class HouseEmphasis extends Component{

    static navigationOptions = ({navigation,screenProps}) => ({
        headerTitle: (<Text style={[GlobalStyles.font20White,GlobalStyles.taCenter,GlobalStyles.flex]}>{navigation.getParam('name', '')}</Text>),
    });
    
    constructor(props) {
        super(props);
        this.unitId = this.props.navigation.getParam('unitId', '');
    }

    render(){
        let titles = [{ title: "单元信息", colorType: "房屋类型",type:"all" }, 
            { title: "重点关注人员房", colorType: "重点关注类型",type:"emphasis" }];
        return (
            <ScrollableTabView
            renderTabBar={() => <DefaultTabBar style={{borderWidth: 1,borderColor: Color.basicColor,height:60}}/>}
            style={[GlobalStyles.pageBg]}
            tabBarPosition={"top"}
            tabBarBackgroundColor={Color.basicColor}
            tabBarActiveTextColor={Color.whiteColor}
            tabBarInactiveTextColor={Color.whiteAlpha50Color}
            tabBarTextStyle={styles.tabBarText}
            tabBarUnderlineStyle={styles.tabBarUnderline}
            >
                {titles.map((title, i) => (
                    <HouseAllScene
                        tabLabel={titles[i].title}
                        key={i}
                        type={titles[i].type}
                        navigation={this.props.navigation}
                        unitId={this.unitId}
                        colorType={titles[i].colorType}
                    />
                ))}
                
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    tabBarText: {
        fontSize: 14,
        marginTop: 13,
    },
    tabBarUnderline: {
        backgroundColor: Color.whiteColor,
        opacity: 0.8,
        width:100,
        marginLeft:(width/2 - 100)/2,
    },
});