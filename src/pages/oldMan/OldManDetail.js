import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import CommonSearch from "../../componets/CommonSearch";
import CommonFetch from "../../componets/CommonFetch";
import Shadow from "../../componets/Shadow";
import RoutApi from '../../api/index';
import Toast, {DURATION} from 'react-native-easy-toast';

import {getUserId} from "../../utils/Common";


export default class  OldManDetail extends Component {


    constructor(props) {
        super(props);

        this.queryParam = this.props.navigation.getParam('queryParam', {});

        this.state = {
            data:{
            },
        }
    }


    componentWillMount(){
        
    }


    detailText = (key,value)=>{
        return(
            <View style={styles.detailTextView} key={key}>
                <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>{key}:</Text>
                <Text numberOfLines={3} style={[GlobalStyles.font14Gray,styles.detailValue]}>{value}</Text>
            </View>
        )
    }



    render() {

        return (
            <View style={[GlobalStyles.pageBg,styles.page]}>
                


                <View style={[GlobalStyles.containerBg,GlobalStyles.containerBorder,styles.detailView]}>
                    <View style={styles.imageView}>
                        {this.queryParam.IdentyPhoto?
                            (<Image source={{ uri: this.queryParam.IdentyPhoto}} style={[styles.image,{marginRight: 30}]}></Image>):
                            (<Image source={require("../../../assets/images/idcard_default.png")} style={[styles.image,{marginRight: 30}]}></Image>)
                        }
                        {this.queryParam.ImgUrl?
                            (<Image source={{ uri: this.queryParam.ImgUrl}} style={[styles.image]}></Image>):
                            (<Image source={require("../../../assets/images/image_default.png")} style={[styles.image]}></Image>)
                        }
                    </View>

                    <View style={styles.detailTextView}>
                        <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>姓名:</Text>
                        <Text numberOfLines={3} style={[GlobalStyles.font14Gray]} >{this.queryParam.RoomerName}</Text>
                        {this.queryParam.PeopleType?(<Image style={{height:15,width:15,marginLeft:10,marginTop:2}} source={require("../../../assets/images/star.png")}></Image>):null}
                    </View>
                    {this.queryParam.PeopleType&&(
                        <View style={styles.detailTextView}>
                            <Text style={[GlobalStyles.font14Gray,styles.detailKey]}>重点类型:</Text>
                            <Text style={[GlobalStyles.font14Red]} numberOfLines={3} >{this.queryParam.PeopleType}</Text>
                        </View>
                    )}
                    {this.detailText('民族', this.queryParam.Nation)}
                    {this.detailText('住户类型', this.queryParam.RoomUserType)}
                    {this.detailText('是否外籍', this.queryParam.IsForeign)}
                    {this.detailText('身份证号', this.queryParam.CardNumber)}
                    {this.detailText('联系电话', this.queryParam.CallPhone)}
                    {this.detailText('小区名称', this.queryParam.AreaName)}
                    {this.detailText('楼宇单元', this.queryParam.RoomAddress)}
                    {this.detailText('登记时间', this.queryParam.CheckInTime)}
                    {this.detailText('户籍地址', this.queryParam.HousePlace)}
                </View>
            </View>
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

   

});