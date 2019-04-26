import React, { Component } from 'react';
import {
    View
} from 'react-native';

import { getUserId } from "../../utils/Common";
import PageItemImage from '../../componets/PageItemImage';

let itemArr = [
    {
        name: '警务通讯录',
        color: '#FCC23F',
        image: require('../../../assets/images/home_check.png'),
        page: 'AddressList'
    },
    {
        name: '一键报警',
        color: '#FEA095',
        image: require('../../../assets/images/home_control.png'),
        page: 'OneButtonCall'
    }
];

export default class Alarm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        getUserId().then(_userId => {
            this.userId = _userId;
        });
    }

    userPress = async (page) => {
        const { navigate } = this.props.navigation;
        navigate(page);
    };


    render() {
        return (
            <View style={[GlobalStyles.pageBg, { position: "relative" }]}>
                {itemArr.map(
                    (item, index) => {
                        return (
                            <PageItemImage
                                key={`${item.page}-${index}`}
                                name={item.name}
                                color={item.color}
                                image={item.image}
                                onPress={() => this.userPress(item.page)}
                            />
                        );
                    }
                )}
            </View>
        );
    }
}
