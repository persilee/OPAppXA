import React, { Component } from 'react';
import {
    View
} from 'react-native';

import { getUserId } from "../../utils/Common";
import PageItemImage from '../../componets/PageItemImage';
import { Toast } from 'teaset';

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
        page: 'Population',
        isToggle: true,
        isSwitch: true,
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

let itemListArr = [
    {
        name: '户籍统计',
        color: '#89DBFD',
        image: require('../../../assets/images/home_population.png'),
        page: 'Distribution',
        isText: true
    },
    {
        name: '高龄老人',
        color: '#FEA095',
        image: require('../../../assets/images/home_dispute.png'),
        page: 'OldMan',
        isText: true
    },
    {
        name: '租客信息',
        color: '#FCC23F',
        image: require('../../../assets/images/home_check.png'),
        page: 'Tenants',
        isText: true
    },
    {
        name: '访客信息',
        color: '#B9E669',
        image: require('../../../assets/images/home_house.png'),
        page: 'Visitors',
        isText: true
    },
];

export default class Basis extends Component {


    constructor(props) {
        super(props);
        this.index = 0,
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


    itemList = () => {
        return (
            <View>
                {itemListArr.map((item, index) => {
                    this.index += 1; 
                    return (
                        <PageItemImage
                            key={`${item.page}-${index}-${this.index}`}
                            name={item.name}
                            color={item.color}
                            image={item.image}
                            onPress={() => this.userPress(item.page)}
                            isText={item.isText}
                        />
                    );
                })}
            </View>
        )
    }

    render() {
        return (
            <View style={[GlobalStyles.pageBg, { position: "relative" }]}>
                {itemArr.map(
                    (item, index) => {
                        this.index += 1; 
                        if(item.isToggle) {
                            return (
                                <View key={`View-${index}-${this.index}`}> 
                                    <PageItemImage
                                        key={`${item.page}-${index}-${this.index}`}
                                        name={item.name}
                                        color={item.color}
                                        image={item.image}
                                        onPress={() => { this.setState({isSwitch:!this.state.isSwitch})}}
                                        isSwitch={this.state.isSwitch}
                                        isToggle={item.isToggle}
                                    />
                                    { this.state.isSwitch ? this.itemList() : null}
                                </View>
                            )
                        }else{
                            return (
                                <PageItemImage
                                    key={`${item.page}-${index}-${this.index}`}
                                    name={item.name}
                                    color={item.color}
                                    image={item.image}
                                    onPress={() => this.userPress(item.page)}
                                />
                            );
                        }
                    }
                )}
            </View>
        );
    }
}
