import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import CommonFetch from "../../componets/CommonFetch";
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RoutApi from '../../api/index';
import Toast, {DURATION} from 'react-native-easy-toast';
import {getUserId} from "../../utils/Common";
import Color from "../../config/color";

export default class  Distribution extends Component {


    constructor(props) {
        super(props);

        this.state = {
            data:[]
        }
    }


    componentDidMount(){
        getUserId().then(_userId => {
            this.userId = _userId;
            this.getList();
        });
    }

    getList = () => {
        let params={init: 0,
                   pageNum: 1,
                   pageSize: 10,
                   queryPair: {
                    //    userId: "001",
                        userId:this.userId,
                    //    type:"",
                   }};

        CommonFetch.doFetch(RoutApi.getPopulaceDistribution,params,this.dealResponseData,this.refs.toast)
    }


    dealResponseData = (responseData)=>{
        let data = responseData.data.list;
        console.log(responseData);
        data.map((item,index)=>{
            item.expanded = false;

            let totalNumber = 0;
            item.childData.map((item2)=>{
                totalNumber += item2.roomUserNum
            })
            item.totalNumber = totalNumber;

            item.childData.unshift({
                areaName: item.areaName,
                name: "全部",
                id: item.id,
                sfid: "0",
                roomUserNum: totalNumber
            })
        })

        this.setState({
            data:data
        })
    }


    provincePress = (item) =>{
        console.log('provincePress',item)
        this.props.navigation.navigate('PopulaceList',{queryParam:item});
    }
    

    headerPress = (index) =>{

        let list = [...this.state.data];
        list.map((item,ind)=>{
            if(ind == index){
                item.expanded = !item.expanded;
            }else{
                item.expanded = false;
            }
        })
        this.setState({
            data:list
        });
    }


    _renderItem = ({item,index}) =>{
            console.log(item);
        return (
             <View key={index}>
                <TouchableOpacity style={[GlobalStyles.containerBg,styles.itemStyle,GlobalStyles.lineBlackBottom,GlobalStyles.pdlr15]}
                    onPress={() => this.headerPress(index)}>
                    <Text style={[GlobalStyles.font14Gray]}>{item.areaName}</Text>
                    <View style={styles.numberView}>
                        <Text style={[GlobalStyles.font14Gray]}>{item.NAME}</Text>
                        <Text style={[GlobalStyles.font14Gray,GlobalStyles.mr15]}>{item.totalNumber}</Text>
                        <FontAwesome name={item.expanded?"angle-down":"angle-right"} color={Color.whiteColor} size={14} />
                    </View>
                </TouchableOpacity>

                {
                    item.expanded ? item.childData.map( (subItem,index) => {
                        return this._subRenderItem(subItem,index);
                    }) : null
                }
                
            </View>
        )
    }

    _subRenderItem = (item,index) =>{
        return (
            <TouchableOpacity key={index} onPress={()=>{this.provincePress(item)}}>
                 <ItemInput name={item.name} textType={"text"}  textValue={item.roomUserNum} 
                 style={[styles.subItem,GlobalStyles.lineBottom]}
                 leftStyle={[GlobalStyles.font14Gray,styles.leftStyle]}></ItemInput>
            </TouchableOpacity>
        )
    }



    render() {
        const { navigate } = this.props.navigation;

        return (
            <View style={[GlobalStyles.pageBg,{position:"relative"}]}>

                <FlatList
                    keyExtractor={(item, index) => index+''}
                    data={this.state.data}
                    renderItem={this._renderItem}
                />
                <Toast ref="toast" style={{backgroundColor:'#EEE'}} textStyle={{color:'#333'}} position={"center"} fadeOutDuration={1000} opacity={0.8}/>
            </View>
        );
    }

   
}

const  styles = StyleSheet.create({
    
    leftStyle:{
        width:200,
    },
    itemStyle:{
        height:50,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingLeft: 20,
        paddingRight: 20,
    },
    numberView:{
        flexDirection:"row",
        justifyContent:"flex-end",
        alignItems:"center"
    },
    number:{
        marginRight: 15
    },
    subItem:{
        paddingLeft: 25,
        paddingRight: 30
    }
});