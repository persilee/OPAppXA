import React, { Component } from 'react';
import {
	StyleSheet,
	ScrollView,
	Modal,
	Text,
	TouchableOpacity,
	TextInput,
	View,
	PixelRatio,
	FlatList,
	Image
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from '../../../assets/styles/GlobalStyles';
import CommonSearch from '../../componets/CommonSearch';
import CommonFetch from '../../componets/CommonFetch';
import RoutApi from '../../api/index';
import Toast, { DURATION } from 'react-native-easy-toast';

import { getUserId } from '../../utils/Common';
import Color from '../../config/color';
import Communications from 'react-native-communications';
export default class OldMan extends Component {
	constructor(props) {
		super(props);

		this.pageNo = 1;
		this.state = {
			data: [],
			keyword: '',
			searchFlag: false
		};
	}

	componentDidMount() {
		getUserId().then((_userId) => {
			this.userId = _userId;
			this.doFetch();
		});
	}

	/**
    *查询数据
    */
	doFetch = () => {
		let params = {
			page: this.pageNo,
			limit: 20,
			key: this.state.keyword,
			pwd: '2ysh3z72w'
		};
		console.log('params', params);
		CommonFetch.doFetch(RoutApi.getOldManList, params, this.dealResponseData, this.refs.toast);
	};

	doSearch = () => {
		if (!this.state.searchFlag) {
			this.state.searchFlag = true;
			this.setState(
				{
					data: []
				},
				this.doFetch
			);
			this.pageNo = 1;
			this.refs.oldMan.refs.commonSerachInputRef.blur();
			this.refs.oldMan.refs.commonSerachInputRef.clear();
		}
	};

	dealResponseData = (responseData) => {
		let data = this.state.data;
		console.log('data', data);
		if (responseData.data.list) {
			data = data.concat(responseData.data.list);
		}
		console.log('responseData', data);
		this.setState({
			data: data,
			searchFlag: false,
			keyword: ''
		});
		this.pageNo = this.pageNo + 1;
	};

	headerPress = (item) => {
		console.log('provincePress', item);
		this.props.navigation.navigate('OldManDetail', { queryParam: item });
	};

	_renderItem = ({ item, index }) => {
		let emptyColor = !item.family ? Color.specialColor : Color.fontColor;
		return (
			<TouchableOpacity
				key={index}
				style={[ styles.itemStyle, GlobalStyles.lineBottom ]}
				onPress={() => this.headerPress(item)}
			>
				{item.IdentyPhoto ? (
					<Image source={{ uri: item.IdentyPhoto }} style={styles.image} />
				) : (
					<Image source={require('../../../assets/images/idcard_default.png')} style={styles.image} />
				)}
				<View style={[styles.detailView]}>
					<View style={styles.detailTextView}>
						<Text style={[styles.detailKey, { color: emptyColor }]}>姓名:</Text>
						<Text numberOfLines={3} style={[{ color: emptyColor }]}>
							{item.RoomerName}
						</Text>
					</View>
					{this.detailText('年龄', item.Age, emptyColor)}
					<View style={[ styles.detailTextView, GlobalStyles.flexDirectRow ]}>
						{this.detailText('联系方式', item.CallPhone, emptyColor)}
						{item.CallPhone == '' ? (
							<Text />
						) : (
							<TouchableOpacity onPress={() => Communications.phonecall(item.CallPhone, true)}>
								<Text style={[ GlobalStyles.font14Blue, GlobalStyles.pdlr10, { top: 3 } ]}>一键拨号</Text>
							</TouchableOpacity>
						)}
					</View>
					{this.detailText('联系地址', item.RoomAddress, emptyColor)}
				</View>
			</TouchableOpacity>
		);
	};

	detailText = (key, value, color) => {
		return (
			<View style={styles.detailTextView}>
				<Text style={[ {color: color}, styles.detailKey ]}>{key}:</Text>
				<Text numberOfLines={3} style={[{color: color}]}>
					{value}
				</Text>
			</View>
		);
	};

	_renderEmptyComponent = () => {
		return (
			<View style={[ GlobalStyles.center, GlobalStyles.mt40 ]}>
				<Text style={[ GlobalStyles.font14Gray ]}>无数据</Text>
			</View>
		);
	};

	render() {
		return (
			<View style={[ GlobalStyles.pageBg ]}>
				<View style={[ GlobalStyles.containerBg, styles.searchView ]}>
					<CommonSearch
						placeholder={'请输入关键字'}
						placeholderTextColor={Color.whiteColor}
						style={[ GlobalStyles.pageBg, GlobalStyles.borderColor, { borderWidth: 1 } ]}
						onChangeText={(keyword) => this.setState({ keyword: keyword })}
						onSubmitEditing={this.doSearch}
						autoFocus={false}
						ref="oldMan"
					/>
					<TouchableOpacity style={styles.searchButton} onPress={this.doSearch}>
						<Text style={[ GlobalStyles.font14White ]}>搜索</Text>
					</TouchableOpacity>
				</View>

				<FlatList
					ListEmptyComponent={this._renderEmptyComponent}
					keyExtractor={(item, index) => index + ''}
					data={this.state.data}
					renderItem={this._renderItem}
					onEndReachedThreshold={0.2}
					onEndReached={this.doFetch}
				/>

				<Toast
					ref="toast"
					style={{ backgroundColor: '#EEE' }}
					textStyle={{ color: '#333' }}
					position={'center'}
					fadeOutDuration={1000}
					opacity={0.8}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	itemStyle: {
		height: 130,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingLeft: 30,
		paddingRight: 30
	},

	image: {
		width: 78,
		height: 96,
		borderRadius: 4
	},

	detailView: {
		height: 130,
		marginTop: 23,
		marginLeft: 10,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		fontSize: 14
	},

	detailTextView: {
		marginTop: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},

	detailKey: {
		width: 65
	},

	detailValue: {
		width: 200
	},

	searchView: {
		height: 48,
		paddingLeft: 20,
		paddingRight: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	searchStyle: {
		flexGrow: 1,
		backgroundColor: '#FFF'
	},

	searchButton: {
		height: 30,
		width: 43,
		marginLeft: 15,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
});
