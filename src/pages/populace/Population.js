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
import { Toast } from 'teaset';

let itemArr = [
    {
        name: '户籍统计',
        color: '#89DBFD',
        image: require('../../../assets/images/home_population.png'),
        page: 'Distribution'
    },
    {
        name: '高龄老人',
        color: '#FEA095',
        image: require('../../../assets/images/home_dispute.png'),
        page: 'OldMan'
    },
    {
        name: '租客信息',
        color: '#FCC23F',
        image: require('../../../assets/images/home_check.png'),
        page: ''
    },
    {
        name: '访客信息',
        color: '#B9E669',
        image: require('../../../assets/images/home_house.png'),
        page: ''
    },
];

export default class Population extends Component {


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
        const { navigate } = this.props.navigation;
        return (
            <View style={[GlobalStyles.pageBg, { position: "relative" }]}>
                {itemArr.map(
                    (item, index) => {
                        return (
                            <PageItemImage
                                key={`${item.page}-${index}`}
                                name={ item.name }
                                color={ item.color }
                                image={ item.image }
                                onPress={ () => this.userPress(item.page) }
                            />
                        );
                    }
                )}
                {/* <TouchableOpacity style={[GlobalStyles.containerBg, styles.itemStyle, GlobalStyles.lineBlackBottom, GlobalStyles.pdlr15]}
                    onPress={() => this.props.navigation.navigate('Distribution')}>
                    <View
                        style={{ 
                            backgroundColor: '#89DBFD', 
                            justifyContent: "center",
                            alignItems: "center",
                            width: 32, 
                            height: 32, 
                            borderRadius: 16
                        }}>
                        <Image
                            style={{ tintColor: "#fff", width: 20, height: 20 }}
                            source={require("../../../assets/images/home_population.png")}  />
                    </View>
                    <Text style={[GlobalStyles.font14Gray, GlobalStyles.pdlr10, { flex: 1 }]}>户籍统计</Text>
                    <View style={styles.numberView}>
                        <FontAwesome name={"angle-right"} color={Color.whiteColor} size={14} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[GlobalStyles.containerBg, styles.itemStyle, GlobalStyles.lineBlackBottom, GlobalStyles.pdlr15]}
                    onPress={() => this.props.navigation.navigate('OldMan')}>
                    <View
                        style={{
                            backgroundColor: '#FEA095',
                            justifyContent: "center",
                            alignItems: "center",
                            width: 32,
                            height: 32,
                            borderRadius: 16
                        }}>
                        <Image 
                            style={{ tintColor: "#fff", width: 20, height: 20 }}
                            source={require("../../../assets/images/home_dispute.png")}  />
                    </View>
                    <Text style={[GlobalStyles.font14Gray, GlobalStyles.pdlr10, { flex:1 }]}>高龄老人</Text>
                    <View style={styles.numberView}>
                        <FontAwesome name={"angle-right"} color={Color.whiteColor} size={14} />
                    </View>
                    
                </TouchableOpacity>
                <TouchableOpacity style={[GlobalStyles.containerBg, styles.itemStyle, GlobalStyles.lineBlackBottom, GlobalStyles.pdlr15]}
                    onPress={() => this.props.navigation.navigate('OldMan')}>
                    <View
                        style={{
                            backgroundColor: '#FCC23F',
                            justifyContent: "center",
                            alignItems: "center",
                            width: 32,
                            height: 32,
                            borderRadius: 16
                        }}>
                        <Image
                            style={{ tintColor: "#fff", width: 20, height: 20 }}
                            source={require("../../../assets/images/home_house.png")} />
                    </View>
                    <Text style={[GlobalStyles.font14Gray, GlobalStyles.pdlr10, { flex: 1 }]}>租客信息</Text>
                    <View style={styles.numberView}>
                        <FontAwesome name={"angle-right"} color={Color.whiteColor} size={14} />
                    </View>

                </TouchableOpacity>
                <TouchableOpacity style={[GlobalStyles.containerBg, styles.itemStyle, GlobalStyles.lineBlackBottom, GlobalStyles.pdlr15]}
                    onPress={() => this.props.navigation.navigate('OldMan')}>
                    <View
                        style={{
                            backgroundColor: '#B9E669',
                            justifyContent: "center",
                            alignItems: "center",
                            width: 32,
                            height: 32,
                            borderRadius: 16
                        }}>
                        <Image
                            style={{ tintColor: "#fff", width: 20, height: 20 }}
                            source={require("../../../assets/images/home_check.png")} />
                    </View>
                    <Text style={[GlobalStyles.font14Gray, GlobalStyles.pdlr10, { flex: 1 }]}>访客信息</Text>
                    <View style={styles.numberView}>
                        <FontAwesome name={"angle-right"} color={Color.whiteColor} size={14} />
                    </View>

                </TouchableOpacity> */}
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