import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image,DeviceEventEmitter
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from "../../config/color";

export default class  DealTaskResult extends Component {


    static navigationOptions = ({ navigation }) => {
       return {
           headerRight: (
               <TouchableOpacity onPress={navigation.getParam('nextStep')}>
                   <Text style={[GlobalStyles.font14White,{padding:15}]}>完成</Text>
               </TouchableOpacity>
           ),
       }
    };

    componentDidMount(){
        this.props.navigation.setParams({ nextStep: this.nextStep });
    }

    nextStep = () =>{
        if(this.type == "check"){
            this.props.navigation.navigate("Check");
        }else if(this.type == "dispute"){
            this.props.navigation.navigate("Dispute");
        }
    }

    constructor(props) {
        super(props);
        DeviceEventEmitter.emit('reloadMyStatistics',"核查任务处理成功");
        let unitName = this.props.navigation.getParam('unitName','');
        this.type = this.props.navigation.getParam('type','');
        this.state = {
            unitName:unitName
        }
    }
    
    render() {

        return (
            <View style={[GlobalStyles.pageBg,GlobalStyles.alignCenter]}>

                <View style={[styles.checkView,GlobalStyles.center,GlobalStyles.whiteBg]}>
                    <FontAwesome name={'check'} color={Color.tabAndOtherBgColor} size={20} />
                </View>

                <Text style={[GlobalStyles.mt15,GlobalStyles.font15White]}>提交成功</Text>

                <Text style={[GlobalStyles.mt15,GlobalStyles.font12White]}>{this.state.unitName}采集任务</Text>
            </View>
        );
    }

   
}

const  styles = StyleSheet.create({
    checkView:{
        marginTop: 65,
        height:30,
        width:30,
        borderRadius:15,
    },
});