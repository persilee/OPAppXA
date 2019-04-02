import React, { Component } from 'react';
import {
    StyleSheet,ScrollView,Modal,
    Text,TouchableOpacity,TextInput,
    View,PixelRatio,FlatList,Image
} from 'react-native';

import ItemInput from '../../componets/ItemInput';
import GlobalStyles from "../../../assets/styles/GlobalStyles";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Shadow from "../../componets/Shadow";
import LongInput from "../../componets/LongInput";
import DateTimePicker from 'react-native-modal-datetime-picker';
import {formatDate} from  '../../utils/Utils';
import Color from "../../config/color";
import {observer,inject} from 'mobx-react';

@inject('CheckData')
@observer
export default class  DealTaskPerson extends Component {


    constructor(props) {
        super(props);
        let personIndex = this.props.navigation.getParam('personIndex',-1)
        console.log('personIndex',personIndex);
        let isAdd = false;
        if(personIndex == -1){
            isAdd = true;
            this.props.CheckData.addPerson();
            personIndex = this.props.CheckData.personData.length - 1;
        }

        this.state = {
            personIndex:personIndex,
            longInputTitle:'',
            longInputShow:false,
            longInputValue:'',
            longInputKey:'',
            typeVisible:false,
            dateType:'',
            peopleTypeVisible:false,
            nationVisible:false,
            isAdd:isAdd
        }
    }

    goHousePhoto=()=>{
        console.log('goHousePhoto');
    }

    inputChange=(key,value)=>{
        console.log('key',key);
        console.log('value',value);
        this.props.CheckData.updatePersonByKey(this.state.personIndex,key,value);
    }

    openLongInput=(titel,key)=>{
        console.log('openLongInput');
        this.setState({
            longInputTitle:titel,
            longInputShow:true,
            longInputValue:this.props.CheckData.personData[this.state.personIndex][key],
            longInputKey:key,

            
        })
    }
    

    longInputChange=(data)=>{
        this.inputChange(this.state.longInputKey,data)
    }

    longInputClose=()=>{
        this.setState({
            longInputShow:false
        })
    }



    dateSelect = (flag,type) => {

        this.setState({
            dateVisible:flag,
            dateType:type
        });

    }


    confirmDate = (date) => {
        let dateStr = formatDate(new Date(date),"yyyy-MM-dd");
        this.props.CheckData.updatePersonByKey(this.state.personIndex,this.state.dateType,dateStr);
        this.dateSelect(false);
    }


    typeSelect =(falg)=>{
        this.setState({
            typeVisible:true
        })
    }

    typeChange=(type)=>{
        let personTypeStr= '';
        switch(type){
            case(1):
                personTypeStr='业主';
                break;
            case(2):
                personTypeStr='家人';
                break;
            case(3):
                personTypeStr='租客';
                break;
            case(4):
                personTypeStr='临时客人';
                break;
        }
        this.props.CheckData.updatePersonByKey(this.state.personIndex,'userType',personTypeStr);
        this.setState({
            typeVisible:false
        })
    }

    save=()=>{
        this.props.navigation.navigate('DealTask');
    }

    delete=()=>{
        this.props.navigation.navigate('DealTask');
        this.props.CheckData.removePerson(this.state.personIndex);
    }

    goCard=()=>{
        this.props.navigation.navigate('DealTaskCard',{type:'roomer',roomerIndex:this.state.personIndex});
    }

    goPhoto=()=>{
        this.props.navigation.navigate('DealTaskPhoto',{type:'roomer',roomerIndex:this.state.personIndex});
    }


    _renderPeopleTypeItem=({item,index})=>{
        return (
            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} onPress={() => this.peopleTypeChange(item)}>
                <Text style={[GlobalStyles.font15Gray]}>{item.name1}</Text>
            </TouchableOpacity>
        )
    }

    peopleTypeChange=(item)=>{
        this.props.CheckData.updatePersonByKey(this.state.personIndex,'peopleType',item.name1);
        this.props.CheckData.updatePersonByKey(this.state.personIndex,'peopleTypeCode',item.code);
        this.peopleTypeSelect(false);
    }

    peopleTypeSelect=(flag)=>{
        this.setState({
            peopleTypeVisible:flag
        })
    }

    _renderNationItem=({item,index})=>{
        return (
            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} onPress={() => this.nationChange(item)}>
                <Text style={[GlobalStyles.font15Gray]}>{item.name1}</Text>
            </TouchableOpacity>
        )
    }

    nationChange=(item)=>{
        this.props.CheckData.updatePersonByKey(this.state.personIndex,'nation',item.name1);
        this.nationSelect(false);
    }

    nationSelect=(flag)=>{
        this.setState({
            nationVisible:flag
        })
    }

    statusSelect=(flag)=>{
        this.setState({
            typeVisible:flag
        })
    }




    render() {
        console.log('render');

        let person =  this.props.CheckData.personData[this.state.personIndex];
        if(!person){
            person = {}
        }

        

        return (
            <ScrollView style={GlobalStyles.pageBg}>
                
                <ItemInput name={'姓名'} textType={"input"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  rightStyle={{width:220}} value={person.roomerName} 
                    onChangeText={(roomerName) => this.inputChange('roomerName',roomerName)}></ItemInput>
                <ItemInput name={'民族'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={person.nation} 
                    arrowVisible={true} pressFunc={()=>{this.nationSelect(true)}}></ItemInput>
                <ItemInput name={'住户类型'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={person.userType} 
                    arrowVisible={true} pressFunc={()=>{this.typeSelect(true)}}></ItemInput>
                {(person.peopleType||this.state.isAdd)&&(
                <ItemInput name={'重点类型'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={person.peopleType} rightFontStyle={{color:'#F00'}}
                    arrowVisible={true} pressFunc={()=>{this.peopleTypeSelect(true)}}></ItemInput>)}
                
                <ItemInput name={'联系电话'} textType={"input"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} rightStyle={{width:220}} value={person.phone} 
                    onChangeText={(phone) => this.inputChange('phone',phone)}></ItemInput>

                <ItemInput name={'身份证号'} textType={"input"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} rightStyle={{width:220}} value={person.cardNumber} 
                    onChangeText={(cardNumber) => this.inputChange('cardNumber',cardNumber)}></ItemInput>
                <ItemInput name={'户籍地址'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} rightStyle={{width:220}} textValue={person.housePlace}  
                    ellipsizeMode={'head'} numberOfLines={1} pressFunc={()=>this.openLongInput('户籍地址','housePlace')}></ItemInput>
                

                {person.userType=='租客'&&(<ItemInput name={"开始时间"} textType={"text"} style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} textValue={person.startTime} pressFunc={() => this.dateSelect(true,"startTime")}
                           arrowVisible={true}  ></ItemInput>)}

                {person.userType=='租客'&&(<ItemInput name={"结束时间"} textType={"text"} style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]} textValue={person.endTime} pressFunc={() => this.dateSelect(true,"endTime")}
                           arrowVisible={true}  ></ItemInput>)}

                <ItemInput name={'身份证照片'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={'采集'} 
                    arrowVisible={true} pressFunc={this.goCard}></ItemInput>
                <ItemInput name={'采集照片'} textType={"text"}  style={[GlobalStyles.lineBottom,GlobalStyles.pdlr15]}  textValue={'采集'} 
                    arrowVisible={true} pressFunc={this.goPhoto}></ItemInput>


                <View style={styles.buttonView}>

                    <TouchableOpacity onPress={this.delete} style={[styles.buttonTouch,{backgroundColor: '#FF4618',marginRight: 40}]}>
                        <Text style={GlobalStyles.font14White}>删除</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.save} style={styles.buttonTouch}>
                        <Text style={GlobalStyles.font14White}>保存</Text>
                    </TouchableOpacity>

                    
                </View>


                <DateTimePicker
                    isVisible={this.state.dateVisible}
                    onConfirm={this.confirmDate}
                    onCancel={() => this.dateSelect(false)}
                    cancelTextIOS={"取消"} confirmTextIOS={"确定"} titleIOS={"请选择日期"} datePickerModeAndroid={"spinner"}
                />


                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.typeVisible}
                    onRequestClose={ () => this.statusSelect(false)}>
                    <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]} onPress={() => this.statusSelect(false)}>
                        <View style={[styles.modalStyle,GlobalStyles.containerBg]}>
                            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} onPress={() => this.typeChange(1)}>
                                <Text style={[GlobalStyles.font15Gray]}>业主</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} onPress={() => this.typeChange(2)}>
                                <Text style={[GlobalStyles.font15Gray]}>家人</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} onPress={() => this.typeChange(3)}>
                                <Text style={[GlobalStyles.font15Gray]}>租客</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[GlobalStyles.center,GlobalStyles.h50,GlobalStyles.lineBlackBottom]} onPress={() => this.typeChange(4)}>
                                <Text style={[GlobalStyles.font15Gray]}>临时客人</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>


                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.peopleTypeVisible}
                    onRequestClose={ () => this.peopleTypeSelect(false)}>
                    <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]} onPress={() => this.peopleTypeSelect(false)}>
                        <View style={[styles.modalStyle,GlobalStyles.containerBg,{height: '50%'}]}>
                            <FlatList
                                keyExtractor={(item, index) => index+""}
                                data={this.props.CheckData.peopleTypeList}
                                renderItem={this._renderPeopleTypeItem}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.nationVisible}
                    onRequestClose={ () => this.nationSelect(false)}>
                    <TouchableOpacity style={[GlobalStyles.flex,GlobalStyles.center,GlobalStyles.blackAlpha50]} onPress={() => this.nationSelect(false)}>
                        <View style={[styles.modalStyle,GlobalStyles.containerBg,{height: '50%'}]}>
                            <FlatList
                                keyExtractor={(item, index) => index+""}
                                data={this.props.CheckData.nationList}
                                renderItem={this._renderNationItem}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>


                <LongInput 
                    show={this.state.longInputShow} 
                    title={this.state.longInputTitle}
                    value={this.state.longInputValue}
                    onChangeText={this.longInputChange}
                    close={this.longInputClose}/>


            </ScrollView>
        );
    }

   
}

const  styles = StyleSheet.create({

    buttonTouch:{
        height:36,
        width:100,
        backgroundColor: Color.btnColor,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:  'center'
    },

    buttonView:{
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'center' ,
        alignItems:  'center',
        marginTop: 30
    },
    modalStyle:{
        width:'60%',
        borderRadius: 8,
    }
    
});