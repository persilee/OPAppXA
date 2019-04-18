import React from 'react';
import { Platform, View, DeviceEventEmitter } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Tabs from './tab';

import Distribution from '../pages/populace/Distribution';
import PopulaceList from '../pages/populace/PopulaceList';
import PopulaceDetail from '../pages/populace/PopulaceDetail';

import CheckResult from '../pages/check/CheckResult';
import CheckResultPhoto from '../pages/check/CheckResultPhoto';
import WaitCheck from '../pages/check/WaitCheck';
import DealTask from '../pages/check/DealTask';
import DealTaskPerson from '../pages/check/DealTaskPerson';
import DealTaskCard from '../pages/check/DealTaskCard';
import DealTaskPhoto from '../pages/check/DealTaskPhoto';
import DealTaskResult from '../pages/check/DealTaskResult';

import VehicleRegional from '../pages/vehicle/VehicleRegional';
import OldMan from '../pages/oldMan/OldMan';
import OldManDetail from '../pages/oldMan/OldManDetail';
import VehicleDetails from '../pages/vehicle/VehicleDetails';
import Login from '../pages/login/Login';
import Home from '../pages/home/Home';
import Mine from '../pages/mine/Mine';
import QuickSearch from '../pages/quicksearch/QuickSearch';
import HouseReal from '../pages/house/HouseReal';
import HouseEmphasis from '../pages/house/HouseEmphasis';
import HouseDetail from '../pages/house/HouseDetail';
import RealUnit from '../pages/unit/RealUnit';
import EmployeeInfo from '../pages/unit/EmployeeInfo';
import QuickSearchDetail from '../pages/quicksearch/QuickSearchDetail';
import Setting from '../pages/mine/Setting';
import ControlDetail from '../pages/control/ControlDetail';
import DisputeList from '../pages/dispute/DisputeList';

import WaitDispute from '../pages/dispute/WaitDispute';
import DisputeTask from '../pages/dispute/DisputeTask';
import DisputeTaskPhoto from '../pages/dispute/DisputeTaskPhoto';
import DisputeTaskDetail from '../pages/dispute/DisputeTaskDetail';
import AlarmList from '../pages/alarm/AlarmList';

import History from '../pages/mine/History';
import HouseCheck from '../pages/house/HouseCheck';
import FaceAlarm from '../pages/alarm/FaceAlarm';
import CarAlarm from '../pages/alarm/CarAlarm';
import InfoAlarm from '../pages/alarm/InfoAlarm';
import Color from '../config/color';

export default createStackNavigator(
	{
		Login: {
			screen: Login,
			navigationOptions: ({ navigation }) => ({
				header: null
			})
		},
		Main: {
			screen: Tabs
		},
		Distribution: {
			screen: Distribution,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '实有人口',
				headerRight: <View />
			})
		},
		PopulaceList: {
			screen: PopulaceList,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '实有人口',
				headerRight: <View />
			})
		},
		PopulaceDetail: {
			screen: PopulaceDetail,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '实有人口',
				headerRight: <View />
			})
		},
		CheckResult: {
			screen: CheckResult,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '核查详情',
				headerRight: <View />
			})
		},

		CheckResultPhoto: {
			screen: CheckResultPhoto,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '房屋采集照片',
				headerRight: <View />
			})
		},

		WaitCheck: {
			screen: WaitCheck,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '待核查任务',
				headerRight: <View />
			})
		},

		DealTask: {
			screen: DealTask,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '核查登记',
				headerRight: <View />
			})
		},

		DealTaskPerson: {
			screen: DealTaskPerson,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '住户登记',
				headerRight: <View />
			})
		},

		DealTaskCard: {
			screen: DealTaskCard,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '身份证采集',
				headerRight: <View />
			})
		},

		DealTaskPhoto: {
			screen: DealTaskPhoto,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '照片采集',
				headerRight: <View />
			})
		},

		DealTaskResult: {
			screen: DealTaskResult,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '提交成功',
				headerLeft: <View />
			})
		},

		VehicleRegional: {
			screen: VehicleRegional,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '实有车辆',
				headerRight: <View />
			})
		},
        OldMan: {
            screen: OldMan,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '高龄老人',
				headerRight: <View />
			})
        },
        OldManDetail: {
            screen: OldManDetail,
            navigationOptions: ({ navigation }) => ({
                headerTitle: '高龄老人',
                headerRight: <View />
            })
        },
		RealUnit: {
			screen: RealUnit,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '实有单位',

				headerRight: <View />
			})
		},
		EmployeeInfo: {
			screen: EmployeeInfo,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '从业人员列表',

				headerRight: <View />
			})
		},
		VehicleDetails: {
			screen: VehicleDetails,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '车辆信息列表',
				headerRight: <View />
			})
		},
		QuickSearch: {
			screen: QuickSearch,
			navigationOptions: ({ navigation }) => ({
				// headerTitle: "警务快搜",
			})
		},
		HouseReal: {
			screen: HouseReal,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '实有房屋',
				headerRight: <View />
			})
		},
		HouseEmphasis: {
			screen: HouseEmphasis,
			navigationOptions: ({ navigation }) => ({
				// headerTitle: "实有房屋",
				headerRight: <View />
			})
		},
		HouseDetail: {
			screen: HouseDetail,
			navigationOptions: ({ navigation }) => ({
				// headerTitle: "房屋详情",
			})
		},
		QuickSearchDetail: {
			screen: QuickSearchDetail,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '人员详情',
				headerRight: <View />
			})
		},
		Setting: {
			screen: Setting,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '设置',
				headerRight: <View />
			})
		},
		ControlDetail: {
			screen: ControlDetail,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '预警布控',
				headerRight: <View />
			})
		},
		//纠纷
		DisputeList: {
			screen: DisputeList,
			navigationOptions: ({ navigation }) => ({})
		},
		WaitDispute: {
			screen: WaitDispute,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '待处理纠纷'
			})
		},
		DisputeTask: {
			screen: DisputeTask,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '处置反馈'
			})
		},
		DisputeTaskDetail: {
			screen: DisputeTaskDetail,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '详情'
			})
		},
		DisputeTaskPhoto: {
			screen: DisputeTaskPhoto,
			navigationOptions: ({ navigation }) => ({
				headerTitle: navigation.state.params.viewType == 'view' ? '查看图片' : '上传图片',
				headerRight: <View />
			})
		},
		History: {
			screen: History,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '任务统计',
				headerRight: <View />
			})
		},
		HouseCheck: {
			screen: HouseCheck,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '核查任务',
				headerRight: <View />
			})
		},
		AlarmList: {
			screen: AlarmList,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '报警列表',
				headerRight: <View />
			})
		},
		FaceAlarm: {
			screen: FaceAlarm,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '人脸报警',
				headerRight: <View />
			})
		},
		CarAlarm: {
			screen: CarAlarm,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '车辆报警',
				headerRight: <View />
			})
		},
		InfoAlarm: {
			screen: InfoAlarm,
			navigationOptions: ({ navigation }) => ({
				headerTitle: '手机报警',
				headerRight: <View />
			})
		}
	},
	{
		headerMode: 'screen', // 标题导航
		initialRouteName: 'Login', // 默认先加载的页面组件,指定堆栈中的初始路由
		mode: 'modal', // 定义跳转风格(card、modal)
		/* The header config from HomeScreen is now here */
		navigationOptions: {
			// header:null,
			headerBackTitleVisible: false,
			headerBackTitle: null,
			headerStyle: {
				paddingTop: Platform.OS === 'ios' ? 20 : 0,
				backgroundColor: Color.headerBgColor,
				height: 44,
				borderWidth: 0
			},
			headerTintColor: '#fff',
			headerTitleStyle: {
				fontSize: 20,
				color: '#fff',
				flex: 1,
				textAlign: 'center',
				alignSelf: 'center'
			}
		}
		// onTransitionEnd: ()=>{
		//     DeviceEventEmitter.emit("tabChange");
		//     console.log('导航栏切换结束');
		//     //console.log(this);
		// }
	}
);
