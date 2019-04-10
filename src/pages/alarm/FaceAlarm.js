import React, { Component } from 'react';
import { StyleSheet, WebView, ScrollView, View, Text, Image, TouchableOpacity, Platform } from 'react-native';

import GlobalStyles from '../../../assets/styles/GlobalStyles';
import API from '../../api/index';
import { width, getUserId } from '../../utils/Common';
import CommonFetch from '../../componets/CommonFetch';
import Geolocation from 'Geolocation';
import { formatDate } from '../../utils/Utils';
let titleArr = [
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
export default class AlarmInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.navigation.getParam('queryParam', {}),
			lon: '',
			lat: ''
		};
		this.getLocation();
	}

	getLocation() {
		Geolocation.getCurrentPosition((location) => {
			console.info('gps定位', location);
			this.setState({
				lon: location.coords.longitude,
				lat: location.coords.latitude
			});
		});
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
		// let mapUrl = `http://work.meishutech.com/test/map.html?lng=${this.state.lon}&lat=${this.state.lat}`;
		let mapUrl = `https://meishutest-1256675553.cos.ap-chengdu.myqcloud.com/%E8%AD%A6%E5%8A%A1%E9%80%9AAPP(%E7%94%9F%E4%BA%A7)/map.html?lng=115.862411&lat=28.692943&myLng=121.458033&myLat=31.232279`;
		return (
			<View style={[ GlobalStyles.pageBg, GlobalStyles.pdlr15 ]}>
				<View style={[ GlobalStyles.containerBg, styles.itemContainer ]}>
					<View
						style={[
							GlobalStyles.flexDirectRow,
							GlobalStyles.mb10,
							GlobalStyles.alignCenter,
							{ justifyContent: 'space-between' }
						]}
					>
						<View style={[ styles.imgContainer, GlobalStyles.alignCenter, GlobalStyles.borderColor ]}>
							<Image source={{ uri: this.state.data.DestinationUrl }} style={styles.imgStyle} />
							<Text style={[ GlobalStyles.font12Gray, styles.imgText ]}>原始图片</Text>
						</View>
						<View style={GlobalStyles.justifyCenter}>
							<Text style={[ GlobalStyles.font12Gray, GlobalStyles.mb5, GlobalStyles.taCenter ]}>VS</Text>
							<Text style={[ GlobalStyles.font12Gray ]}>
								相似度:<Text style={GlobalStyles.font12Red}>92%</Text>
							</Text>
						</View>
						<View style={[ styles.imgContainer, GlobalStyles.alignCenter, GlobalStyles.borderColor ]}>
							<Image source={{ uri: this.state.data.SnapImageUrl }} style={styles.imgStyle} />
							<Text style={[ GlobalStyles.font12Gray, styles.imgText ]}>抓拍照片</Text>
						</View>
					</View>

					{this.renderPersonItem()}
				</View>

				<WebView source={{ uri: mapUrl }} javaScriptEnabled={true} style={styles.mapContainer} />
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
		width: 106,
		height: 153,
		borderWidth: 1,
		borderRadius: 4
	},
	imgStyle: {
		width: 104,
		height: 123,
		borderRadius: 3
	},
	imgText: {
		height: 30,
		lineHeight: 30
	},
	mapContainer: {
		width: width - 30,
		height: 300,
		marginTop: 10,
		marginBottom: 20
	}
});
