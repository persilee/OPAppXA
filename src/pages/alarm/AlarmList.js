import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity, Alert } from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Toast, { DURATION } from 'react-native-easy-toast';
import API from '../../api/index';
import { observer, inject } from 'mobx-react';
import Color from '../../config/color';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonFetch from '../../componets/CommonFetch';
import NotifService from '../../componets/NotifService';
@inject('User')
@observer
export default class AlarmList extends Component<Props> {
	constructor(props) {
		super(props);
		this.pageNum = 1;
		this.total = -1;
		this.pageSize = 10;
		this.state = {
			data: [],
			senderId: 'senderID'
		};

		this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
	}

	onRegister(token) {
		Alert.alert('Registered !', JSON.stringify(token));
		console.log(token);
		this.setState({ registerToken: token.token, gcmRegistered: true });
	}

	onNotif(notif) {
		console.log(notif);
		Alert.alert(notif.title, notif.message);
	}

	componentDidMount() {
		this.fetchData();
	}

	jumpAlarm = (item) => {
		let page = ''; //1-车辆报警 2-人脸报警 3-手机报警
		if (item.alarmTypeId == '1') {
			page = 'CarAlarm';
		} else if (item.alarmTypeId == '2') {
			page = 'FaceAlarm';
		} else if (item.alarmTypeId == '3') {
			page = 'InfoAlarm';
		}
		this.props.navigation.navigate(page);
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
		if (this.total == -1 || this.total > (this.pageNum - 1) * this.pageSize) {
			let params = {
				init: 0,
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				queryPair: {
					userId: this.props.User.userId
				}
			};

			CommonFetch.doFetch(API.getHomeAlarmList, params, (responseData) => {
				console.info('alarmlist', responseData);
				if (responseData.data && responseData.data.list && responseData.data.list.length > 0) {
					// let sorted = groupBy(responseData.data.list, function (item) {
					//     return [item.alarmType];
					// });
					// let arr = []; //排序
					// arr = this.findIndexAlarm(arr,sorted,"人脸报警");
					// arr = this.findIndexAlarm(arr,sorted,"车辆报警");
					// arr = this.findIndexAlarm(arr,sorted,"信息报警");
					this.total = responseData.data.total;
					this.setState({
						data: responseData.data.list
					});
				}
			});

			this.pageNum = this.pageNum + 1;
		}
	};

	render() {
		return (
			<View style={[ GlobalStyles.pageBg, GlobalStyles.p15 ]}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						this.notif.localNotif();
					}}
				>
					<Text>Local Notification (now)</Text>
				</TouchableOpacity>
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
