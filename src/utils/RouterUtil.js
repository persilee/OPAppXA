import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export function renderTabIcon(focused, tintColor,tabIcon){
    let color = "#777";
    if (focused) {
        color = tintColor;
    }
    return (
        <FontAwesome size={25} name={tabIcon} color={color} style={{marginTop:2}}/>
    );
}

