import React, { Component } from 'react';
import {
    StyleSheet, 
    ActivityIndicator,
    View
} from 'react-native';

import { Toast, Theme } from 'teaset';

export default class Loading {

    static customKey = null;

    static showCustom() {
        if (Loading.customKey) return;
        Loading.customKey = Toast.show({
            text: '正在加载数据...',
            icon: <ActivityIndicator size='large' color={Theme.toastIconTintColor} />,
            position: 'center',
            duration: 10000,
        });
    }

    static hideCustom() {
        if (!Loading.customKey) return;
        Toast.hide(Loading.customKey);
        Loading.customKey = null;
    }

    static renderFooter = (loading) => {

        if (loading) return null;
        return (
            <View
                style={{
                    paddingVertical: 20,
                }}
            >
                <ActivityIndicator size='small' color={Theme.toastIconTintColor} />
            </View>
        );
    };

}

