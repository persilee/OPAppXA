import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View
} from 'react-native';

import { getUserId } from "../../utils/Common";
import PageItemImage from '../../componets/PageItemImage';

let itemArr = [
    {
        name: '实有房屋',
        color: '#89DBFD',
        image: require('../../../assets/images/home_house.png'),
        page: 'HouseReal'
    },
    {
        name: '实有人口',
        color: '#FD6D6D',
        image: require('../../../assets/images/home_population.png'),
        page: 'Population'
    },
    {
        name: '实有单位',
        color: '#B9E669',
        image: require('../../../assets/images/home_unit.png'),
        page: 'RealUnit'
    },
    {
        name: '实有车辆',
        color: '#FCC23F',
        image: require('../../../assets/images/home_car.png'),
        page: 'VehicleRegional'
    },
];

export default class Basis extends Component {


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
