import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity } from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Toast, { DURATION } from 'react-native-easy-toast';
import API from '../../api/index';
import { observer, inject } from 'mobx-react';
import Color from '../../config/color';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonFetch from '../../componets/CommonFetch';

@inject('User')
@observer
export default class AlarmList extends Component {
	constructor(props) {
		super(props);
		this.pageNum = 1;
		this.state = {
			data: [],
			senderId: 'senderID'
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	jumpAlarm = (item) => {
		let page = ''; //1-车辆报警 2-人脸报警 3-手机报警
		if (item.alarmType == '车辆报警') {
			page = 'CarAlarm';
		} else if (item.alarmType == '人脸报警') {
			page = 'FaceAlarm';
		} else if (item.alarmType == '信息报警') {
			page = 'InfoAlarm';
		}
		this.props.navigation.navigate(page, { queryParam: item });
	};

	convertAlarmColor = (type) => {
		let color = '#D0021B';
		if (type == '人脸报警') {
			color = '#D0021B';
		} else if (type == '车辆报警') {
			color = '#FE7C03';
		} else if (type == '信息报警') {
			color = '#F8E71C';
		}
		return color;
	};

	_renderItem = ({ item, index }) => {
		let color = this.convertAlarmColor(item.alarmType);
		return (
			<TouchableOpacity
				style={[ styles.policeItem, GlobalStyles.flexDirectRow, GlobalStyles.center, GlobalStyles.containerBg ]}
				key={`alram-${index}`}
				onPress={() => this.jumpAlarm(item)}
			>
				<FontAwesome name={'warning'} color={color} size={13} style={GlobalStyles.mr5} />
				<Text style={[ GlobalStyles.font14White, GlobalStyles.flex ]} ellipsizeMode="tail" numberOfLines={1}>
					{item.alarmType}：{item.alarmTime}
				</Text>
				<FontAwesome name={'angle-right'} color={Color.whiteColor} size={14} style={GlobalStyles.ml5} />
			</TouchableOpacity>
		);
	};

	fetchData = () => {
		let params = {
			alarmstate: 0,
			istoday: 1,
			page: this.pageNum,
			limit: 20,
			pwd: '2ysh3z72w'
		};

		CommonFetch.doFetch(API.getAlarmListData, params, (responseData) => {
			if (responseData.data && responseData.data.list && responseData.data.list.length > 0) {
				let arr = [ ...responseData.data.list, ...this.state.data ];
				function compare(property) {
					return function (obj1, obj2) {
						var value1 = obj1[property];
						var value2 = obj2[property];
						return value2 > value1 ? 1 : -1;
					}
				}
				var sortArr = arr.sort(compare("alarmTime"));
				this.setState({
					data: sortArr
				});
			}
		});
		this.pageNum = this.pageNum + 1;
	};

	render() {
		return (
			<View style={[ GlobalStyles.pageBg, GlobalStyles.p15 ]}>
				<FlatList
					keyExtractor={(item, index) => `alarm-${index}`}
					data={this.state.data}
					extraData={this.state}
					renderItem={this._renderItem}
					onEndReachedThreshold={0.1}
					onEndReached={() => this.fetchData()}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	policeItem: {
		height: 40,
		paddingLeft: 10,
		paddingRight: 20,
		borderRadius: 3,
		shadowColor: Color.blackColor,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 2,
		marginBottom: 10
	},
	button: {
		borderWidth: 1,
		borderColor: '#000000',
		margin: 5,
		padding: 5,
		width: '70%',
		backgroundColor: '#DDDDDD',
		borderRadius: 5
	}
});
