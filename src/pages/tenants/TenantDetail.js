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
import { Toast } from 'teaset';


export default class TenantDetail extends Component {

    static navigationOptions = ({navigation,screenProps}) => ({
        headerTitle: (<Text style={[GlobalStyles.font20White,GlobalStyles.taCenter,GlobalStyles.flex]}>{navigation.getParam('name', '')}</Text>),
    });

    constructor(props) {
        super(props);

        this.unitId = this.props.navigation.getParam('unitId', '');
        

        this.state = {

        }
    }

    componentDidMount(){
        Toast.smile('正在开发中，敬请期待...');
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

    render() {

        return (
            <ScrollView style={GlobalStyles.pageBg}>
                <View style={[GlobalStyles.pageBg, GlobalStyles.mb5]}>

                    {/* <View style={[GlobalStyles.containerBg, , GlobalStyles.p20]}>
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
                    </View> */}

                </View>
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