import React, { Component } from 'react';
import {
    View
} from 'react-native';

import { getUserId } from "../../utils/Common";
import PageItemImage from '../../componets/PageItemImage';

let itemArr = [
    {
        name: '房屋核查',
        color: '#FCC23F',
        image: require('../../../assets/images/home_check.png'),
        page: 'Check'
    },
    {
        name: '报警任务',
        color: '#FEA095',
        image: require('../../../assets/images/home_control.png'),
        page: 'Control'
    }
];

export default class Task extends Component {

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
