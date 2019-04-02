import React, {Component} from 'react';
import {
    StyleSheet, ScrollView,
    Text, TouchableOpacity,
    View, Modal,

} from 'react-native';

import GlobalStyles from '../../assets/styles/GlobalStyles';
import Color from "../config/color";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default class SelectInput extends Component {

    constructor(props) {
        super(props);
        // this.defaultName = props.defaultName;
        // this.defaultCode = props.defaultCode;
        // this.data = props.data;

        let data = props.data;
        this.state = {
            currText: null,
            statusVisible: false,
        }
        if(data.length > 0) {
            let index = 0;
            if (this.props.defaultCode != null) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].code == this.props.defaultCode) {
                        index = i;
                    }
                }
            } else if (this.props.defaultName != null) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name1 == this.props.defaultName) {
                        index = i;
                    }
                }
            }
            if(this.props.defaultCode != null || this.props.defaultName != null){
                let currObj = data[index]
                this.currObj = currObj;
                this.state = {
                    currText: currObj.name1,
                    currObj: currObj,
                    statusVisible: false,
                }
            }
        }
    }




    componentDidMount() {
    }

    onPressName = (index) => {
        this.currObj = this.props.data[index]
        this.statusSelect(true);
        this.setState({
            statusVisible: !this.state.statusVisible,
            currText: this.props.data[index].name1
        })
        this.props.callbackParent(this.currObj)

    }


    statusSelect=(flag)=>{
        this.setState({
            statusVisible:flag
        })
    }

    render() {
        let {name, style, textType, textValue, imageURL, imageStyle, pressFunc, arrowVisible, leftStyle, rightStyle, rightFontStyle, ...props} = this.props;

        return (
            <View>
                <TouchableOpacity style={[GlobalStyles.flexDirectRow,GlobalStyles.pageBg1,styles.viewContainer,style]}
                                  onPress={() => this.statusSelect(true)}>
                    <Text style={[GlobalStyles.font14Gray, leftStyle]}>{this.props.title}</Text>
                    <View style={styles.rightView}>
                        <View style={[{height: 20}, rightStyle]}>
                            <Text style={[GlobalStyles.font14Gray,GlobalStyles.taRight,styles.rightFont,rightFontStyle]} {...props}>{this.state.currText}</Text>
                        </View>
                        <FontAwesome name={"angle-right"} color={Color.whiteColor} size={22} style={GlobalStyles.ml5}/>
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.statusVisible}
                    onRequestClose={() => this.statusSelect(false)}>
                    <View style={[GlobalStyles.flex, GlobalStyles.center, GlobalStyles.blackAlpha50]}>
                        <View style={styles.modalStyle}>
                            <ScrollView style={[GlobalStyles.containerBg]}>
                                {
                                    this.props.data.map((obj, index) => {
                                        return (
                                            <TouchableOpacity
                                                style={[GlobalStyles.center, GlobalStyles.h50, GlobalStyles.lineBlackBottom]}
                                                key={index}
                                                onPress={() => {this.onPressName(index)}}
                                            >
                                                <Text style={[GlobalStyles.font15Gray]}>{obj.name1}</Text>
                                            </TouchableOpacity>)
                                    })
                                }
                            </ScrollView>
                        </View>

                    </View>
                </Modal>


            </View>
        )

    }


}


const styles = StyleSheet.create({
    viewContainer: {
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rightView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rightFont: {
        
    },
    imageStyle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    alignEnd: {
        alignItems: "flex-end"
    },
    modalStyle: {
        borderRadius: 50,
        overflow: 'hidden',
        height: 280,
        width: 280,
        borderRadius: 8,
    },


});

