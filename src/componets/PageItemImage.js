import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import Color from "../config/color";


export default  class  PageItemImage extends  Component{

    static propTypes = {
        name: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]).isRequired,
        color: PropTypes.string.isRequired,
        onPress: PropTypes.func,
        image: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]).isRequired,
        isToggle: PropTypes.bool,
        isSwitch: PropTypes.bool,
        isText: PropTypes.bool
    }

    static defaultProps = {
        isToggle: false,
        isSwitch: false
    }

    constructor(props){
        super(props);
    }

    render(){
        return (
            <TouchableOpacity style={[GlobalStyles.containerBg, styles.itemStyle, GlobalStyles.lineBlackBottom, GlobalStyles.pdlr15]}
                onPress={this.props.onPress}>
                {this.props.isText ? null : <View
                    style={{
                        backgroundColor: this.props.color,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 16
                    }}>
                    <Image
                        style={{ tintColor: "#fff", width: 18, height: 18 }}
                        source={this.props.image} />
                </View>}
                <Text style={[this.props.isText ? { marginLeft: 30 }: null,GlobalStyles.font14Gray, GlobalStyles.pdlr10, { flex: 1 }]}>{this.props.name}</Text>
                <View style={styles.numberView}>
                    <FontAwesome name={this.props.isSwitch ? "angle-down" : "angle-right"} color={Color.whiteColor} size={14} />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemStyle: {
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
    },
});