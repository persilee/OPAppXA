import React, { Component } from 'react';
import { StyleSheet, WebView, ScrollView, View, Text, Image, TouchableOpacity, Platform, Dimensions } from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import API from '../../api/index';
import { width, getUserId } from '../../utils/Common';
import CommonFetch from '../../componets/CommonFetch';
import Geolocation from 'Geolocation';
import { formatDate } from '../../utils/Utils';
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
export default class CarAlarm extends Component {
	constructor(props) {
		super(props);
		this.state = {
            data: this.props.navigation.getParam('queryParam', {})
		};
	}

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
				</View>
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
	}
});
