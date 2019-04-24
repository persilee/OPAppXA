//入口

import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import Navigator from './router/navigator';
import { Provider } from 'mobx-react';
import stores from './store';

class SetUp extends Component {

	componentDidMount() {
		// do anything while splash screen keeps, use await to wait for an async task.
        // SplashScreen.hide(); //关闭启动屏幕
	}

	render() {
		return (
			<View style={styles.container}>
				<Provider {...stores}>
					<Navigator />
				</Provider>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});

export default SetUp;
