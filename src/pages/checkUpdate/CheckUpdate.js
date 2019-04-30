import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Linking
} from 'react-native';
import _updateConfig from '../../../update.json';
import { Toast, Theme } from 'teaset';
import {
	isFirstTime,
	isRolledBack,
	packageVersion,
	currentVersion,
	checkUpdate,
	downloadUpdate,
	switchVersion,
	switchVersionLater,
	markSuccess,
} from 'react-native-update';


const { appKey } = _updateConfig[Platform.OS];

export default class CheckUpdate extends Component {
    static customKey = null;
    static downKey = null;
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	
	componentWillMount() {
		console.log('isFirstTime', isFirstTime);
		if (isFirstTime) {
			Alert.alert('提示', '是否更新当前版本，点击是，更新，点击否，回退上一个版本', [
				{ text: '否', onPress: () => { throw new Error('启动失败,请重启应用') } },
				{ text: '是', onPress: () => { markSuccess() } },
			]);
		} else if (isRolledBack) {
			Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
			this.props.navigation.replace('Login');
		}
    }
    
    showCustom() {
        if (CheckUpdate.customKey) return;
        CheckUpdate.customKey = Toast.show({
            text: '正在检查更新...',
            icon: <ActivityIndicator size='large' color={Theme.toastIconTintColor} />,
            position: 'center',
            duration: 10000,
        });
    }

    showDownCustom() {
        if (CheckUpdate.downKey) return;
        CheckUpdate.downKey = Toast.show({
            text: '正在下载更新包...',
            icon: <ActivityIndicator size='large' color={Theme.toastIconTintColor} />,
            position: 'center',
            duration: 10000,
        });
    }

    hideCustom() {
        if (!CheckUpdate.customKey) return;
        Toast.hide(CheckUpdate.customKey);
        CheckUpdate.customKey = null;
    }

    hideDownCustom() {
        if (!CheckUpdate.downKey) return;
        Toast.hide(CheckUpdate.downKey);
        CheckUpdate.downKey = null;
    }

	checkUpdate = () => {
		checkUpdate(appKey).then(info => {
			if (info.expired) {
				Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    { text: '是', onPress: () => { info.downloadUrl && Linking.openURL(info.downloadUrl) } },
                    {text: '否', onPress: () => { this.props.navigation.replace('Login'); }}
				], { cancelable: false });
			} else if (info.upToDate) {
				this.props.navigation.replace('Login');
				// Alert.alert('提示', '您的应用版本已是最新.');
			} else {
				Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
					{ text: '是', onPress: () => { this.doUpdate(info); this.showDownCustom();} },
					{ text: '否', onPress: () => { this.props.navigation.replace('Login');}}
				], { cancelable: false });
            }
            this.hideCustom();
		}).catch(err => {
			Alert.alert('提示', '更新失败.');
			this.props.navigation.replace('Login');
		});
	};

	doUpdate = info => {
		downloadUpdate(info).then(hash => {
            this.hideDownCustom();
			Alert.alert('提示', '下载完毕,是否重启应用?', [
				{ text: '是', onPress: () => { switchVersion(hash); } },
				{ text: '否', onPress: () => { this.props.navigation.replace('Login');}},
				{ text: '下次启动时', onPress: () => { switchVersionLater(hash); } }
			], { cancelable: false });
		}).catch(err => {
			Alert.alert('提示', '更新失败.');
			this.props.navigation.replace('Login');
		});
	};

	componentDidMount() {
        this.showCustom();
		this.checkUpdate();
	}

	render() {

		return (
            <ImageBackground source={require("../../../assets/images/login_bg.png")} style={{ flex: 1 }}>
                <View style={GlobalStyles.flex}>
                    
                </View>
            </ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	
});
