import React, { Component } from 'react';
import {
    StyleSheet,TextInput,
    Text,TouchableOpacity,
    View,PixelRatio,Platform
} from 'react-native';

import {BoxShadow} from 'react-native-shadow';

export default class Shadow extends Component {

    constructor(props) {
        super(props);
    }

    render() {


        let {width, height} = this.props;
          return  Platform.OS == 'android'? 
          (
            <BoxShadow
              setting={{
                width: width,
                height: height,
                color: '#000',
                border: 4,
                radius: 6,
                opacity: 0.03,
                x: 0,
                y: 0,
                style: {marginVertical: 5, justifyContent: 'center'},
              }}>
              <View style={this.props.style}>
                {this.props.children}
              </View>
            </BoxShadow>
          ) : 
          (
            <View
              style={[{
                shadowColor: '#000000',
                shadowOffset: {h: 10, w: 10},
                shadowRadius: 5,
                shadowOpacity: 0.1,
              }]}>
              <View style={this.props.style}>
                {this.props.children}
              </View>
            </View>
          )

    }

}
