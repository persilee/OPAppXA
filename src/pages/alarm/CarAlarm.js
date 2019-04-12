import React, { Component } from 'react';
import { StyleSheet, Modal, TextInput, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import Toast, { DURATION } from 'react-native-easy-toast';
import { observer, inject } from 'mobx-react';
import API from '../../api/index';
import CommonFetch from '../../componets/CommonFetch';
import Color from '../../config/color';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CommonBtn from '../../componets/CommonBtn';

let titleArr = [
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

@inject('User')
@observer
export default class CarAlarm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.navigation.getParam('queryParam', {}),
			modalVisible: false,
			text: '',
		};
	}

	openFilterModal = () => {
		this.modalSelect(true);
	}

	modalSelect = (flag) => {
		this.setState({
			modalVisible: flag
		});
	};

	cancelTasks = () => {
		this.setState({
			text: ''
		});
		this.modalSelect(false);
	}

	doTasks = () => {
		let params = {
			AlarmID: this.state.data.ID,
			BackDescription: this.state.text,
			DealAlarmPolice: this.props.User.userNameChn,
			pwd: '2ysh3z72w'
		};
		console.log('params', params);
		CommonFetch.doFetch(API.getAlarmDealData, params, (responseData) => {
			if (responseData.msg == 'success') {
				this.modalSelect(false);
				this.setState({
					text: '',
					data: {}
				});
				this.refs.toast.show('报警任务处理成功');
				this.props.navigation.state.params.refresh();
				this.props.navigation.goBack();
			}
		});
	};

	renderPersonItem = () => {
		return (
			<View>
				{titleArr.map((item, index) => {
					let specialColor = GlobalStyles.font14Gray;
					if (item.value == 'like') {
						specialColor = GlobalStyles.font14Red;
					}
					return (
						<View
							style={[ GlobalStyles.flexDirectRow, GlobalStyles.mb5, GlobalStyles.justifyCenter ]}
							key={`item-${index}`}
						>
							<Text style={[ GlobalStyles.font14Gray, GlobalStyles.mr5 ]}>{item.title}：</Text>
							<Text style={[ GlobalStyles.flex, GlobalStyles.justifyCenter, specialColor ]}>
								{this.state.data[item.value]}
							</Text>
						</View>
					);
				})}
			</View>
		);
	};

	render() {
		return (
			<View style={[ GlobalStyles.pageBg, GlobalStyles.pdlr15 ]}>
				<View style={[ GlobalStyles.containerBg, styles.itemContainer ]}>
					<View style={[ GlobalStyles.flexDirectRow, GlobalStyles.mb10, GlobalStyles.alignCenter ]}>
						<View style={[ styles.imgContainer, GlobalStyles.alignCenter, GlobalStyles.borderColor ]}>
							<View style={[ GlobalStyles.center, { position: 'relative' } ]}>
								<Image
									source={{
                                        uri: this.state.data.SnapImageUrl
                                    }}
                                    resizeMode='contain'
									style={styles.imgStyle}
								/>
								{/* <Text style={[ GlobalStyles.font14Gray, styles.alarmTips ]}>原始图片</Text> */}
							</View>
                            <Text style={[GlobalStyles.font12Gray, styles.imgText]}>抓拍图片</Text>
						</View>
					</View>

					{this.renderPersonItem()}

					<CommonBtn text={'处 理'} onPress={() => this.openFilterModal()} style={{ marginTop: 10, width: 86, alignSelf: 'flex-end' }} ></CommonBtn>
				</View>
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
							{ justifyContent: 'center' }
						]}
					>
						<View style={[styles.modalStyle, GlobalStyles.containerBg]}>
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
								<Text style={[GlobalStyles.font14Gray, GlobalStyles.mr5]}>处理人：</Text>
								<TextInput
									editable={false}
									style={[GlobalStyles.borderColor, GlobalStyles.font14White, GlobalStyles.pdlr5, GlobalStyles.mr5, GlobalStyles.mt10, { height: 40, borderWidth: 1, borderRadius: 4 }]}
									value={this.props.User.userNameChn}
								/>
								<Text style={[GlobalStyles.font14Gray, GlobalStyles.mt10]}>处理事由：</Text>
								<TextInput
									multiline={true}
									numberOfLines={4}
									maxLength={40}
									style={[GlobalStyles.pdlr5, GlobalStyles.borderColor, GlobalStyles.font14White, GlobalStyles.mt10, { height: 80, borderWidth: 1, borderRadius: 4 }]}
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
	itemContainer: {
		borderRadius: 8,
		elevation: 2,
		marginTop: 20,
		marginBottom: 20,
		padding: 15
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
	imgText: {
		height: 30,
		lineHeight: 30
	},
	alarmTips: {
		position: 'absolute',
		left: 25,
		top: 55
	},
	modalStyle: {
		width: 360,
		height: 340,
		marginTop: 126,
	},
});
