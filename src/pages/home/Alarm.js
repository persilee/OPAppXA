import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';

import { getUserId } from "../../utils/Common";
import PageItemImage from '../../componets/PageItemImage';
import { Toast } from 'teaset';

let itemArr = [
    {
        name: '警务通讯录',
        color: '#FCC23F',
        image: require('../../../assets/images/home_check.png'),
        page: 'AddressList',
        isToggle: true,
        isSwitch: true,
    },
    {
        name: '一键报警',
        color: '#FEA095',
        image: require('../../../assets/images/baojing.png'),
        page: 'OneButtonCall'
    }
];

let itemListArr = [
    {
        name: '社区民警通讯录',
        color: '#FCC23F',
        image: require('../../../assets/images/home_check.png'),
        page: '',
        isText: true
    },
    {
        name: '派出所民警通信录',
        color: '#FEA095',
        image: require('../../../assets/images/home_control.png'),
        page: '',
        isText: true
    },
    {
        name: '其他通信录',
        color: '#FEA095',
        image: require('../../../assets/images/home_control.png'),
        page: '',
        isText: true
    },
];

export default class Alarm extends Component {

    constructor(props) {
        super(props);
        this.index = 0,
        this.state = {
            isSwitch: false,
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
