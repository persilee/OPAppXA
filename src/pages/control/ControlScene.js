import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity, Dimensions, Modal, TextInput } from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Toast, { DURATION } from 'react-native-easy-toast';
import API from '../../api/index';
import { observer, inject } from 'mobx-react';
import Color from '../../config/color';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonFetch from '../../componets/CommonFetch';
import CommonBtn from '../../componets/CommonBtn';


let carTitleArr = [
	{
		title: '车辆号码',
		value: 'RealName'
	},
	{
		title: '卡口名称',
		value: 'AlarmAddress'
	},
	{
		title: '通过卡口时间',
		value: 'alarmTime'
	},
	{
		title: '布控原因',
		value: 'Remark'
	}
];

let faceTitleArr = [
	{
		title: '姓名',
		value: 'RealName'
	},
	{
		title: '相似度',
		value: 'Similary'
	},
	{
		title: '小区',
		value: 'AlarmAddress'
	},
	{
		title: '布控原因',
		value: 'Remark'
	},
	{
		title: '时间',
		value: 'alarmTime'
	}
];

@inject('User')
@observer
export default class ControlScene extends Component {
	constructor(props) {
		super(props);
		this.pageNum = 1;
		this.state = {
			data: [],
			senderId: 'senderID',
			modalVisible: false,
			text: '',
			tasksInfo: ''
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

	modalSelect = (flag) => {
		this.setState({
			modalVisible: flag
		});
	};

	openFilterModal = (item) => {
		this.setState({
			tasksInfo: item
		});
		this.modalSelect(true);
	}

	renderCarItem = (item) => {
		return (
			<View>
				{carTitleArr.map((titleItem, index) => {
					let specialColor = GlobalStyles.font14Gray;
					if (item.value == 'like') {
						specialColor = GlobalStyles.font14Red;
					}
					return (
						<View
							style={[ GlobalStyles.flexDirectRow, GlobalStyles.mb5, GlobalStyles.justifyCenter ]}
							key={`item-${index}`}
						>
							<Text style={[ GlobalStyles.font14Gray, GlobalStyles.mr5 ]}>{titleItem.title}：</Text>
							<Text style={[ GlobalStyles.flex, GlobalStyles.justifyCenter, specialColor ]}>
								{item[titleItem.value]}
							</Text>
						</View>
					);
				})}
			</View>
		);
	};

	renderFaceItem = (item) => {
		return (
			<View>
				{faceTitleArr.map((titleItem, index) => {
					let specialColor = GlobalStyles.font14Gray;
					if (item.value == 'like') {
						specialColor = GlobalStyles.font14Red;
					}
					return (
						<View
							style={[ GlobalStyles.flexDirectRow, GlobalStyles.mb5, GlobalStyles.justifyCenter ]}
							key={`item-${index}`}
						>
							<Text style={[ GlobalStyles.font14Gray, GlobalStyles.mr5 ]}>{titleItem.title}：</Text>
							<Text style={[ GlobalStyles.flex, GlobalStyles.justifyCenter, specialColor ]}>
								{item[titleItem.value]}
							</Text>
						</View>
					);
				})}
			</View>
		);
	};

	_renderItem = ({ item, index }) => {
		let color = this.convertAlarmColor(item.alarmType);
		let specialColor = GlobalStyles.font14Gray;
		if (item.value == 'like') {
			specialColor = GlobalStyles.font14Red;
		}
		return (
			<View style={[ GlobalStyles.pageBg ]}>
				{item.alarmType == '人脸报警' ? (
					<View style={[ GlobalStyles.pageBg ]}>
						<View style={[ GlobalStyles.containerBg, styles.itemContainer ]}>
							<View
								style={[
									GlobalStyles.flexDirectRow,
									GlobalStyles.mb10,
									GlobalStyles.alignCenter,
									{ justifyContent: 'space-between' }
								]}
							>
								<View
									style={[
										styles.imgFaceContainer,
										GlobalStyles.alignCenter,
										GlobalStyles.borderColor
									]}
								>
									<Image source={{ uri: item.DestinationUrl }} style={styles.imgFaceStyle} />
									<Text style={[ GlobalStyles.font12Gray, styles.imgText ]}>原始图片</Text>
								</View>
								<View style={GlobalStyles.justifyCenter}>
									<Text style={[ GlobalStyles.font12Gray, GlobalStyles.mb5, GlobalStyles.taCenter ]}>
										VS
									</Text>
									<Text style={[ GlobalStyles.font12Gray ]}>
										相似度:<Text style={GlobalStyles.font12Red}>{item.Similary}</Text>
									</Text>
								</View>
								<View
									style={[
										styles.imgFaceContainer,
										GlobalStyles.alignCenter,
										GlobalStyles.borderColor
									]}
								>
									<Image source={{ uri: item.SnapImageUrl }} style={styles.imgFaceStyle} />
									<Text style={[ GlobalStyles.font12Gray, styles.imgText ]}>抓拍照片</Text>
								</View>
							</View>
							{this.renderFaceItem(item)}
							{this.props.readStatus == 0 ? (
								<CommonBtn text={'处 理'} onPress={() => this.openFilterModal(item) } style={{ marginTop: 10, width: 86, alignSelf: 'flex-end' }} />
							): null}
						</View>
					</View>
				) : (
					<View style={[ GlobalStyles.containerBg, styles.itemContainer ]}>
						<View style={[ GlobalStyles.flexDirectRow, GlobalStyles.mb10, GlobalStyles.alignCenter ]}>
							<View style={[ styles.imgContainer, GlobalStyles.alignCenter, GlobalStyles.borderColor ]}>
								<View style={[ GlobalStyles.center, { position: 'relative' } ]}>
									<Image
										source={{
											uri: item.SnapImageUrl
										}}
										resizeMode="contain"
										style={styles.imgStyle}
									/>
									{/* <Text style={[ GlobalStyles.font14Gray, styles.alarmTips ]}>原始图片</Text> */}
								</View>
								<Text style={[ GlobalStyles.font12Gray, styles.imgText ]}>抓拍图片</Text>
							</View>
						</View>
						{this.renderCarItem(item)}
						{this.props.readStatus == 0 ? (
								<CommonBtn text={'处 理'} onPress={ () => this.openFilterModal(item) } style={{ marginTop: 10, width: 86, alignSelf: 'flex-end' }} />
							): null}
					</View>
				)}
			</View>
		);
	};

	doTasks = () => {
		let params = {
			AlarmID: this.state.tasksInfo.ID,
			BackDescription: this.state.text,
			DealAlarmPolice: this.props.User.userNameChn,
			pwd: '2ysh3z72w'
		};
		CommonFetch.doFetch(API.getAlarmDealData, params, (responseData) => {
			if (responseData.msg == 'success' ){
				this.modalSelect(false);
				this.setState({
					tasksInfo: '',
					text: '',
					data: []
				});
				this.fetchData();
				this.refs.toast.show('报警任务处理成功');
			}
		});
	};

	cancelTasks = () => {
		this.setState({
			tasksInfo: '',
			text: ''
		});
		this.modalSelect(false);
	}

	fetchData = () => {
		let params = {
			alarmstate: this.props.readStatus,
			istoday: 0,
			page: this.pageNum,
			limit: 20,
			pwd: '2ysh3z72w'
		};

		CommonFetch.doFetch(API.getAlarmListData, params, (responseData) => {
			if (responseData.data && responseData.data.list && responseData.data.list.length > 0) {
				let arr = [ ...responseData.data.list, ...this.state.data ];
				function compare(property) {
					return function(obj1, obj2) {
						var value1 = obj1[property];
						var value2 = obj2[property];
						return value2 > value1 ? 1 : -1;
					};
				}
				var sortArr = arr.sort(compare('alarmTime'));
				this.setState({
					data: sortArr
				});
				sortArr = [];
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

				<Modal
					animationType={'fade'}
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => this.modalSelect(false)}
				>
					<View
						style={[
							GlobalStyles.flex,
							GlobalStyles.blackAlpha50,
							GlobalStyles.flexDirectRow,
							{ justifyContent: 'center'}
						]}
					>
						<View style={[ styles.modalStyle, GlobalStyles.containerBg ]}>
							<View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
								<TouchableOpacity onPress={() => this.cancelTasks()}>
									<FontAwesome
										name={'close'}
										size={15}
										color={Color.whiteColor}
										style={{ padding: 10 }}
									/>
								</TouchableOpacity>
							</View>

							<View style={[GlobalStyles.p25]}>
								<Text style={[ GlobalStyles.font14Gray, GlobalStyles.mr5 ]}>处理人：</Text>
								<TextInput
									editable = {false}
									style={[GlobalStyles.borderColor, GlobalStyles.font14White, GlobalStyles.pdlr5, GlobalStyles.mr5, GlobalStyles.mt10, { height: 40, borderWidth: 1, borderRadius: 4}]}
									value={this.props.User.userNameChn}
								/>
								<Text style={[GlobalStyles.font14Gray, GlobalStyles.mt10]}>处理事由：</Text>
								<TextInput
									multiline = {true}
									numberOfLines = {4}
        							maxLength = {40}
									style={[GlobalStyles.pdlr5,GlobalStyles.borderColor, GlobalStyles.font14White, GlobalStyles.mt10, { height: 80, borderWidth: 1, borderRadius: 4 }]}
									onChangeText={(text) => this.setState({ text })}
									value={this.state.text}
								/>
								<View style={[GlobalStyles.flexDirectRow, GlobalStyles.justifyAround]}>
									<CommonBtn text={'取 消'} onPress={() => this.cancelTasks()} style={{ marginTop: 20, width: 86, alignSelf: 'flex-end' }} />
									<CommonBtn text={'确 定'} onPress={() => this.doTasks()} style={{ marginTop: 20, width: 86, alignSelf: 'flex-end' }} />
								</View>
							</View>
						</View>
					</View>
				</Modal>
				<Toast ref="toast" position={"center"} fadeInDuration={600} />
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
	},
	itemContainer: {
		borderRadius: 8,
		elevation: 2,
		marginTop: 20,
		marginBottom: 20,
		padding: 15
	},
	imgFaceContainer: {
		width: 106,
		height: 153,
		borderWidth: 1,
		borderRadius: 4
	},
	imgContainer: {
		flex: 1,
		height: 230,
		borderWidth: 1,
		borderRadius: 4
	},
	imgStyle: {
		width: Dimensions.get('window').width - 62,
		height: 200,
		borderRadius: 3
	},
	imgFaceStyle: {
		width: 104,
		height: 123,
		borderRadius: 3
	},
	imgText: {
		height: 30,
		lineHeight: 30
	},
	alarmTips: {
		position: 'absolute',
		left: 25,
		top: 55
	},
	btnContainer: {
		width: 86,
		height: 38,
		borderRadius: 8,
		justifyContent: 'center',
		overflow: 'hidden'
	},
	btn: {
		textAlign: 'center'
		// backgroundColor:"transparent",
	},
	modalStyle:{
        width:360,
        height: 340,
        marginTop:126,
    },
});
