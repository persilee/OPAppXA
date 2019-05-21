import React, { Component } from 'react';
import {
    View
} from 'react-native';

import { getUserId } from "../../utils/Common";
import PageItemImage from '../../componets/PageItemImage';
import { Toast } from 'teaset';

let itemArr = [
    {
        name: '重点房屋核查',
        color: '#89DBFD',
        image: require('../../../assets/images/HouseReal.png'),
        page: 'CheckList',
        type: 'Emphasis'
    },
    {
        name: '空置房屋核查',
        color: '#FD6D6D',
        image: require('../../../assets/images/HouseReal.png'),
        page: 'CheckList',
        type: 'Vacancy'
    },
    {
        name: '七人以上房屋核查',
        color: '#B9E669',
        image: require('../../../assets/images/HouseReal.png'),
        page: 'CheckList',
        type: 'MultiUser'
    }
];

export default class CheckListType extends Component {


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

    userPress = async (item) => {
        console.log('item',item);
        if(item.page){
            const { navigate } = this.props.navigation;
            navigate(item.page, {type:item.type});
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
                            onPress={() => this.userPress(item)}
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
                                    onPress={() => this.userPress(item)}
                                />
                            );
                        }
                    }
                )}
            </View>
        );
    }
}
