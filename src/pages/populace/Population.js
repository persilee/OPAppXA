import React, { Component } from 'react';
import {
    StyleSheet, 
    Text, 
    Image,
    TouchableOpacity, 
    View
} from 'react-native';

import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getUserId } from "../../utils/Common";
import Color from "../../config/color";

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


    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={[GlobalStyles.pageBg, { position: "relative" }]}>
                <TouchableOpacity style={[GlobalStyles.containerBg, styles.itemStyle, GlobalStyles.lineBlackBottom, GlobalStyles.pdlr15]}
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

                </TouchableOpacity>
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