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
        name: '联勤资源',
        color: '#FCC23F',
        image: require('../../../assets/images/logistics.png'),
        page: '',
        isToggle: true,
        isSwitch: true,
    },
    {
        name: '值班备勤',
        color: '#FCC23F',
        image: require('../../../assets/images/Onduty.png'),
        page: ''
    },
    {
        name: '巡防报备',
        color: '#FEA095',
        image: require('../../../assets/images/Scouts.png'),
        page: ''
    },
    {
        name: '专项任务勤务报备',
        color: '#89DBFD',
        image: require('../../../assets/images/Specialtask.png'),
        page: ''
    },
    {
        name: '勤务查询',
        color: '#FD6D6D',
        image: require('../../../assets/images/Service.png'),
        page: ''
    },
    {
        name: '勤务监督',
        color: '#B9E669',
        image: require('../../../assets/images/Supervision.png'),
        page: ''
    },
    {
        name: '绩效统计',
        color: '#FCC23F',
        image: require('../../../assets/images/Performance.png'),
        page: ''  // Performance
    },
];

let itemListArr = [
    {
        name: '警务助理',
        color: '#FCC23F',
        image: require('../../../assets/images/home_check.png'),
        page: '',
        isText: true
    },
    {
        name: '信息员',
        color: '#FEA095',
        image: require('../../../assets/images/home_control.png'),
        page: '',
        isText: true
    },
    {
        name: '巡防人员',
        color: '#FEA095',
        image: require('../../../assets/images/home_control.png'),
        page: '',
        isText: true
    },
];

export default class Joint extends Component {

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
