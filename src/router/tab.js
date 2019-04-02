import React from 'react';
import {createBottomTabNavigator} from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Platform,Image,Text,TouchableOpacity,View ,DeviceEventEmitter} from "react-native";
import {renderTabIcon} from '../utils/RouterUtil';

import HomePage from "../pages/home/Home";
import MinePage from "../pages/mine/Mine";
import CheckList from "../pages/check/CheckList";
import ControlList from "../pages/control/ControlList";
import DisputeList from "../pages/dispute/DisputeList";

import Color from "../config/color";
// 注册tabs
const Tabs = createBottomTabNavigator({
    Home: {
        screen: HomePage,
        navigationOptions:({navigation}) => ({
            tabBarLabel: '首页',
            tabBarIcon:({focused, tintColor}) => {
                return  renderTabIcon(focused, tintColor,'home');
            }
        }),
    },

    Check: {
        screen: CheckList,
        navigationOptions:({navigation}) => ({
            tabBarLabel: '核查',
            tabBarIcon:({focused, tintColor}) => {
                return  renderTabIcon(focused, tintColor,'calendar');
            },
            tabBarOnPress:(obj)=>{
                console.log("obj",obj);
                DeviceEventEmitter.emit("reloadCheckList");
                obj.navigation.navigate('Check');
            }
        }),
    },

    Dispute: {
        screen: DisputeList,
        navigationOptions:({navigation}) => ({
            tabBarLabel: '纠纷',
            tabBarIcon:({focused, tintColor}) => {
                return  renderTabIcon(focused, tintColor,'slideshare');
            },
            tabBarOnPress:(obj)=>{
                console.log("obj",obj);
                DeviceEventEmitter.emit("reloadDisputeList");
                obj.navigation.navigate('Dispute');
            }
        }),
    },

    Control:{
        screen: ControlList,
        navigationOptions:({navigation}) => ({
            tabBarLabel: '布控',
            tabBarIcon:({focused, tintColor}) => {
                return  renderTabIcon(focused, tintColor,'film');
            },
            tabBarOnPress:(obj)=>{
                DeviceEventEmitter.emit("reloadControllList");
                obj.navigation.navigate('Control');
            }
        }),
    },
    Me: {
        screen: MinePage,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '我的',
            tabBarIcon:({focused, tintColor}) => {
                return  renderTabIcon(focused, tintColor,'user');
            },
        }),
    }
}, {
    animationEnabled: true, // 切换页面时是否有动画效果
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    // animationEnabled: false, // 是否在更改标签时显示动画。
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    lazy:true, // 是否根据需要懒惰呈现标签，而不是提前制作，意思是在app打开的时候将底部标签栏全部加载，默认false,推荐改成true哦。
    tabBarOptions: {
        activeTintColor: Color.whiteColor, // 文字和图片选中颜色
        inactiveTintColor: Color.whiteAlpha50Color, // 文字和图片未选中颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {
            height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
        },
        style: {
            backgroundColor: Color.tabAndOtherBgColor, // TabBar 背景色
            height:49,
            overflow:'visible',
            borderTopColor:"rgba(151,151,151,0.1)",
            borderTopWidth:1,
        },
        labelStyle: {
            fontSize: 12, // 文字大小
            paddingBottom:2,
        },
    },
});


Tabs.navigationOptions = ({ navigation }) => {
    let route = navigation.state.routes[navigation.state.index];

    let options = null;
    if(route.routeName === 'Home'){
        options = {
            headerTitle:(
                <Text style={{fontSize:18,color:"#fff",flex: 1, textAlign: 'center'}}>警务通</Text>
            ),
            headerTitleStyle:{
                flex: 1,
                textAlign: 'center',
            },
            headerRight: (
                <TouchableOpacity>
                    <FontAwesome size={15} color={"#fff"} name={"bell"} />
                </TouchableOpacity>
            ),
            headerRightContainerStyle:{
                paddingRight:10
            },
            headerLeft:(
                <View />
            ),
            headerLeftContainerStyle:{
                paddingLeft:10,
            },
        }
    } else if(route.routeName === 'Dispute'){
        options = {
            headerTitle: "纠纷",
            headerLeft:(
                <View />
            ),
            headerRight:(<View>
                <TouchableOpacity onPress={()=>{
                   navigation.navigate('DisputeTask');
                }}>
                    <Text style={{marginRight:20,color:'#FFFFFF'}}>登记</Text>
                </TouchableOpacity>

            </View>)
        }

    }else if(route.routeName === 'Check'){
        options = {
            headerTitle: "核查",
            headerLeft:(
                <View />
            ),
            headerRight:(
                <View />
            ),
        }

    } else if(route.routeName === 'Control'){
        options = {
            headerTitle: "布控",
            headerLeft:(
                <View />
            ),
            headerRight:(
                <View />
            ),
        }
    }else if(route.routeName === 'News'){
        options = {
            headerTitle: "新闻",
        }
    }else if(route.routeName === 'Me'){
        options = {
            headerTitle: "我的",
            headerLeft:(
                <View />
            ),
            headerRight:(
                <View />
            ),
        }
    }
    return options;
};


export default Tabs;
