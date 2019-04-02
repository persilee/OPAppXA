import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlobalStyles from "../../assets/styles/GlobalStyles";

class SpacingView extends PureComponent {
    render() {
        return (
            <View style={[styles.container,GlobalStyles.blackBg]}></View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 10,
    },
})

export default SpacingView