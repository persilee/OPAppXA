import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';

import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from "../../config/color";
import Communications from 'react-native-communications';


export default class  OldManDetail extends Component {


    constructor(props) {
        super(props);

        this.queryParam = this.props.navigation.getParam('queryParam', {});

        console.log('queryParam', this.queryParam);
        

        this.state = {
            expandOldManInfo: true,
            expandFamilyInfo: false,
        }
    }


    componentWillMount(){
        
    }


    detailText = (key,value,isClick=false)=>{
        if (value) {
            return (
                <View style={styles.detailTextView} key={key}>
                    <Text style={[GlobalStyles.font14Gray, styles.detailKey]}>{key}:</Text>
                    {isClick ? (
                        <TouchableOpacity onPress={() => Communications.phonecall(value, true)}>
                            <Text numberOfLines={3} style={[GlobalStyles.font14Blue, GlobalStyles.pdlr10]}>{value} &nbsp;<FontAwesome name="phone" color={Color.btnColor} size={14} /></Text>
                        </TouchableOpacity>
                    ) : (
                            <Text numberOfLines={3} style={[GlobalStyles.font14Gray]}>{value}</Text>
                        )}
                </View>
            )
        }else{
            return (
                <View style={styles.detailTextView} key={key}>
                    <Text style={[GlobalStyles.font14Gray, styles.detailKey]}>{key}:</Text>
                    <Text numberOfLines={3} style={[GlobalStyles.font14Gray]}>{value}</Text>
                </View>
            )
        }
        
    }

    oldManDetail = () => {
        return (
            <View style={[GlobalStyles.pageBg, GlobalStyles.mb5]}>

                <View style={[GlobalStyles.containerBg, , GlobalStyles.p20]}>
                    <View style={styles.imageView}>
                        {this.queryParam.IdentyPhoto ?
                            (<Image source={{ uri: this.queryParam.IdentyPhoto }} style={[styles.image, { marginRight: 30 }]}></Image>) :
                            (<Image source={require("../../../assets/images/idcard_default.png")} style={[styles.image, { marginRight: 30 }]}></Image>)
                        }
                        {this.queryParam.ImgUrl ?
                            (<Image source={{ uri: this.queryParam.ImgUrl }} style={[styles.image]}></Image>) :
                            (<Image source={require("../../../assets/images/image_default.png")} style={[styles.image]}></Image>)
                        }
                    </View>

                    <View style={styles.detailTextView}>
                        <Text style={[GlobalStyles.font14Gray, styles.detailKey]}>姓名:</Text>
                        <Text numberOfLines={3} style={[GlobalStyles.font14Gray]} >{this.queryParam.RoomerName}</Text>
                        {this.queryParam.PeopleType ? (<Image style={{ height: 15, width: 15, marginLeft: 10, marginTop: 2 }} source={require("../../../assets/images/star.png")}></Image>) : null}
                    </View>
                    {this.queryParam.PeopleType && (
                        <View style={styles.detailTextView}>
                            <Text style={[GlobalStyles.font14Gray, styles.detailKey]}>重点类型:</Text>
                            <Text style={[GlobalStyles.font14Red]} numberOfLines={3} >{this.queryParam.PeopleType}</Text>
                        </View>
                    )}
                    {this.detailText('民族', this.queryParam.Nation)}
                    {this.detailText('住户类型', this.queryParam.RoomUserType)}
                    {this.detailText('是否外籍', this.queryParam.IsForeign)}
                    {this.detailText('身份证号', this.queryParam.CardNumber)}
                    {this.detailText('联系电话', this.queryParam.CallPhone, true)}
                    {this.detailText('小区名称', this.queryParam.AreaName)}
                    {this.detailText('楼宇单元', this.queryParam.RoomAddress)}
                    {this.detailText('登记时间', this.queryParam.CheckInTime)}
                    {this.detailText('户籍地址', this.queryParam.HousePlace)}
                </View>

            </View>

        )
    }

    familyDetail = () => {
        return (
            <View style={[GlobalStyles.pageBg, GlobalStyles.mb5]}>

                <View style={[GlobalStyles.containerBg, , GlobalStyles.p20]}>
                    <View style={styles.imageView}>
                        {this.queryParam.family.IdentyPhoto ?
                            (<Image source={{ uri: this.queryParam.family.IdentyPhoto }} style={[styles.image, { marginRight: 30 }]}></Image>) :
                            (<Image source={require("../../../assets/images/idcard_default.png")} style={[styles.image, { marginRight: 30 }]}></Image>)
                        }
                        {this.queryParam.family.ImgUrl ?
                            (<Image source={{ uri: this.queryParam.family.ImgUrl }} style={[styles.image]}></Image>) :
                            (<Image source={require("../../../assets/images/image_default.png")} style={[styles.image]}></Image>)
                        }
                    </View>

                    <View style={styles.detailTextView}>
                        <Text style={[GlobalStyles.font14Gray, styles.detailKey]}>姓名:</Text>
                        <Text numberOfLines={3} style={[GlobalStyles.font14Gray]} >{this.queryParam.family.RoomerName}</Text>
                        {this.queryParam.family.PeopleType ? (<Image style={{ height: 15, width: 15, marginLeft: 10, marginTop: 2 }} source={require("../../../assets/images/star.png")}></Image>) : null}
                    </View>
                    {this.queryParam.family.PeopleType && (
                        <View style={styles.detailTextView}>
                            <Text style={[GlobalStyles.font14Gray, styles.detailKey]}>重点类型:</Text>
                            <Text style={[GlobalStyles.font14Red]} numberOfLines={3} >{this.queryParam.family.PeopleType}</Text>
                        </View>
                    )}
                    {this.detailText('民族', this.queryParam.family.Nation)}
                    {this.detailText('住户类型', this.queryParam.family.RoomUserType)}
                    {this.detailText('是否外籍', this.queryParam.family.IsForeign)}
                    {this.detailText('身份证号', this.queryParam.family.CardNumber)}
                    {this.detailText('联系电话', this.queryParam.family.CallPhone, true)}
                    {this.detailText('小区名称', this.queryParam.family.AreaName)}
                    {this.detailText('楼宇单元', this.queryParam.family.RoomAddress)}
                    {this.detailText('登记时间', this.queryParam.family.CheckInTime)}
                    {this.detailText('户籍地址', this.queryParam.family.HousePlace)}
                </View>

            </View>

        )
    }


    render() {

        return (
            <ScrollView style={GlobalStyles.pageBg}>
                <TouchableOpacity style={[styles.title, GlobalStyles.containerBg, GlobalStyles.lineBlackBottom]}
                    onPress={() => { this.setState({ expandOldManInfo: !this.state.expandOldManInfo }) }}>
                    <Text style={GlobalStyles.font14White}>老人信息</Text>
                    <FontAwesome name={this.state.expandOldManInfo ? "angle-down" : "angle-right"} color={Color.whiteColor} size={14} />
                </TouchableOpacity>
                {this.state.expandOldManInfo ? this.oldManDetail() : null}
                {this.queryParam.family ? (
                    <TouchableOpacity style={[styles.title, GlobalStyles.containerBg, GlobalStyles.lineBlackBottom]}
                        onPress={() => { this.setState({ expandFamilyInfo: !this.state.expandFamilyInfo }) }}>
                        <Text style={GlobalStyles.font14White}>家人信息</Text>
                        <FontAwesome name={this.state.expandFamilyInfo ? "angle-down" : "angle-right"} color={Color.whiteColor} size={14} />
                    </TouchableOpacity>
                ): null}
                {this.queryParam.family && this.state.expandFamilyInfo ? this.familyDetail() : null}
                
            </ScrollView>
        );
    }

   
}

const  styles = StyleSheet.create({
    
    page:{
        height:"100%",
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"center",
        paddingLeft:20,
        paddingRight: 20
    },

    imageView:{
        flexDirection:"row",
        justifyContent:"center"
    },

    image:{
        width: 130,
        height:160,
        borderRadius: 4
    },

    detailView:{
        marginTop: 20,
        elevation:2,
        padding:30,
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"flex-start",
        borderRadius: 8,
    },

    detailTextView:{
        marginTop: 8,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"flex-start",
    },

    detailKey:{
        width:65
    },

    detailValue:{
        width:220
    },
    title: {
        height: 38,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },

   

});