import React, { Component } from 'react';
import {
    View
} from 'react-native';

import { getUserId } from "../../utils/Common";
import PageItemImage from '../../componets/PageItemImage';
import { Toast } from 'teaset';

let itemArr = [
    {
        name: '车辆出入',
        color: '#89DBFD',
        image: require('../../../assets/images/CarOut.png'),
        page: 'CarOut'
    },
    {
        name: '门禁管理',
        color: '#B9E669',
        image: require('../../../assets/images/Entrance.png'),
        page: 'Entrance'
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
        if(page){
            const { navigate } = this.props.navigation;
            navigate(page);
        }else{
            Toast.smile('正在开发中，敬请期待...');
        }
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
