import React, { Component } from 'react';
import {
    View
} from 'react-native';

import { getUserId } from "../../utils/Common";
import PageItemImage from '../../componets/PageItemImage';

let itemArr = [
    {
        name: '车辆出入',
        color: '#89DBFD',
        image: require('../../../assets/images/home_population.png'),
        page: 'OldMan'
    },
    {
        name: '门禁管理',
        color: '#B9E669',
        image: require('../../../assets/images/home_dispute.png'),
        page: 'OldMan'
    }
];

export default class RealTime extends Component {


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
