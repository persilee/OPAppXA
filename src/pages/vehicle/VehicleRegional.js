import React from 'react';
import {
    StyleSheet, ScrollView, Modal,
    Text, TouchableOpacity, TextInput,
    View, PixelRatio, FlatList
} from 'react-native';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RoutApi from '../../api/index';
import {observer,inject} from 'mobx-react';
import Color from "../../config/color";
@inject('User')
@observer
export default class VehicleRegional extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: []
        }
    }

    getJsonData() {
        const url = RoutApi.getVehicleRegional;
            //"http://192.168.1.147:8091/mqi/pageOrData/6e48b45d8454446b9c2fe3506900b4af";
        return fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                init: 0,
                pageNum: 1,
                pageSize: 10,
                queryPair: {
                    userId: this.props.User.userInfo.userId,
                }
            })
        }).then(response => response.json())
            .then(responseJson => {
                if (responseJson.code == 0) {
                    let dataList = responseJson.data.list;
                    for (var i in dataList) {
                        var carNum = 0;
                        for (var j in dataList[i].childData) {
                            carNum += dataList[i].childData[j].carNum
                        }
                        dataList[i]["expanded"] = false;
                        dataList[i]["carNum"] = carNum;
                    }
                    this.setState({
                        data: dataList
                    })
                }

            }).catch(error => {
                console.error("post error:" + error);
            });
    }

    componentWillMount() {
        this.getJsonData();

    }

    headerPress = (index) => {

        let list = [...this.state.data];
        list.map((item, ind) => {
            if (ind == index) {
                item.expanded = !item.expanded;
            } else {
                item.expanded = false;
            }
        })
        this.setState({
            data: list
        });
    }


    _renderItem = ({item, index}) => {
        return (
            <View key={index} >
                <TouchableOpacity style={[GlobalStyles.containerBg,styles.itemStyle,GlobalStyles.lineBlackBottom,GlobalStyles.pdlr15]}
                                  onPress={() => this.headerPress(index)}>
                    <Text style={[GlobalStyles.font14Gray]}>{item.areaName}</Text>
                    <View style={styles.numberView}>
                        <Text style={[GlobalStyles.mr15,GlobalStyles.font14Gray]}>{item.carNum}</Text>
                        <FontAwesome name={item.expanded ? "angle-down" : "angle-right"} color={Color.whiteColor} size={14}/>
                    </View>
                </TouchableOpacity>

                {
                    item.expanded ? item.childData.map((subItem, index) => {
                        return this._subRenderItem(subItem, index);
                    }) : null
                }

            </View>
        )
    }

    _subRenderItem = (item, index) => {
        return (
            <TouchableOpacity key={index}  style={[GlobalStyles.pageBg1,GlobalStyles.lineBottom]} 
            onPress={(vItem) => {
                this.provincePress(item)
            }}>
                <ItemInput name={item.name1} textType={"text"}
                           textValue={item.carNum}
                           style={[GlobalStyles.lineBottom,styles.subItem]}
                           leftStyle={GlobalStyles.font14Gray}></ItemInput>
            </TouchableOpacity>

        )
    }

    provincePress = (item) => {
        if (item.areaName === '全部') {
            this.props.navigation.navigate('VehicleDetails', {
                queryParam: {
                    name2: item.name2,
                }
            });
        } else {
            this.props.navigation.navigate('VehicleDetails', {
                queryParam: {
                    name2: item.name2,
                    areaName: item.areaName
                }

            });
        }
    }

    _renderEmptyComponent = () => {
        return (
            <View style={[GlobalStyles.center,GlobalStyles.mt40]}>
                <Text style={[GlobalStyles.font14Gray]}>无数据</Text>
            </View>
        );
    }


    render() {
        return (
            <FlatList
                ListEmptyComponent = {this._renderEmptyComponent}
                style={[GlobalStyles.pageBg]}
                // initialNumToRender={10}
                data={this.state.data}
                keyExtractor={(item, index) => `car-${index}`}
                renderItem={this._renderItem}
            />

        );
    }


}


const styles = StyleSheet.create({
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
    subItem: {
        paddingLeft: 25,
        paddingRight: 30
    }

});