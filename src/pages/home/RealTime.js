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
        const { navigate } = this.props.navigation;
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

const styles = StyleSheet.create({

    leftStyle: {
        width: 200,
    },
    itemStyle: {
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
    },
    numberView: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    number: {
        marginRight: 15
    },
    subItem: {
        paddingLeft: 25,
        paddingRight: 30
    },
});