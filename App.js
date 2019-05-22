/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    AppRegistry,
    YellowBox,
    View,
} from 'react-native';

import SetUp from './src/index';

// ignore specific yellowbox warnings
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

export default class Root extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <SetUp/>
        )
    }
}

AppRegistry.registerComponent('PoliceAffairs', () => Root);
