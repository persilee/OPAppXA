import React, { Component } from 'react';
import {
    StyleSheet,
    Text,TouchableOpacity,
    View,PixelRatio,Image,
    Modal,TouchableHighlight,DeviceEventEmitter,NativeModules,ToastAndroid,Platform
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import GlobalStyles from '../../assets/styles/GlobalStyles';
import RNExitApp from 'react-native-exit-app';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import {version} from '../config/index'

let basicColor = ['#36CDF9', '#289EF4'];



export default class UpdateApp extends Component {

    static hiddenModal = false;

    constructor(props) {
        super(props);
        this.state = {
            updateInfo:{
                newVersion:"",
                needUpdate:false,
                needForceUpdate:false,
                appleId:0,
                apkUrl:"",
                appSize:""
            },
            updating:false,
            rate:0
        }
    }

    componentDidMount(){
        // Door.getVersionInfo((res)=>{
        //     console.log('getVersionInfo',res)
        //     if(res.code ==0){
        //         this.setState({
        //             updateInfo:{
        //                 newVersion:res.data.latestVersion,
        //                 needUpdate:res.data.latestVersion != version,
        //                 needForceUpdate:res.data.isForceUpdate,
        //                 appleId:res.data.appleId,
        //                 apkUrl:res.data.apkDloadUrl,
        //                 appSize:res.data.updateFileSize
        //             }
        //         })
        //     }
        // })

        DeviceEventEmitter.addListener('LOAD_PROGRESS',(msg)=>{
            console.log('LOAD_PROGRESS',msg);
            let title = "当前下载进度：" + msg 

            this.setState({
                rate:msg
            })
        }); 

        DeviceEventEmitter.addListener('LOG',(msg)=>{
            console.log('LOG',msg);
            
        }); 

        DeviceEventEmitter.addListener('ERROR',(msg)=>{
            console.log('ERROR',msg);
            ToastAndroid.show(msg, ToastAndroid.LONG);

            this.setState({
               updating:false 
            })
        }); 
    }

    onRequestClose = ()=>{
        if(this.state.updateInfo.needForceUpdate){
            RNExitApp.exitApp();
        }else{
            UpdateApp.hiddenModal = true;
            this.setState({})
        }
    }

    updateApp = ()=>{
        if(Platform.OS == 'android'){
            NativeModules.upgrade.upgrade(this.state.updateInfo.apkUrl);
            this.setState({
               updating:true 
            })
        }else{
             NativeModules.upgrade.openAPPStore(this.state.updateInfo.appleId);  
        }
    }




    render() {
        let infoView = (
            <View style={styles.modalView}>
                    <View style={styles.infoView}>
                        <View style={styles.headerInfo}>
                            <Text style={styles.header}>更新提示</Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.infoText}>应用现在有新的版本可供更新（文件大小{this.state.updateInfo.appSize}）</Text>
                        </View>

                      <View style={styles.buttonView}>
                          <TouchableOpacity style={[styles.button,{borderRightWidth:1,borderColor:'#eee'}]}
                            onPress={this.onRequestClose}
                          >
                            <Text >取消</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.button}
                            onPress={this.updateApp}
                          >
                            <Text>更新</Text>
                          </TouchableOpacity>
                      </View>
                    </View>
                  </View>
            )

        let androidUpdate = (
                 <View style={styles.modalView}>
                    <View style={styles.updateView}>
                        <AnimatedCircularProgress
                          size={140}
                          width={4}
                          fill={this.state.rate}
                          tintColor="#019bfd"
                          backgroundColor="#eeeeee">
                          {
                            (fill) => (
                              <Text>
                                正在更新{ this.state.rate+'%' }
                              </Text>
                            )
                          }
                        </AnimatedCircularProgress>
                    </View>
                </View>
            )
        
        return (

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={this.state.updateInfo.needUpdate && !UpdateApp.hiddenModal}
                  onRequestClose={this.onRequestClose}
                >
                  {this.state.updating ? androidUpdate : infoView}
                </Modal>

        );
    }
}

const  styles = StyleSheet.create({
    modalView:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'

    },

    infoView:{
        height:'25%',
        width:'66.7%',
        backgroundColor:'#FFFFFF',
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        borderRadius:8
    },

    updateView:{
        height:200,
        width:200,
        backgroundColor:'#FFFFFF',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8
    },

    headerInfo:{
        height:'30%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    header:{
        fontSize:16,
        color:'#000000',
    },

    info:{
        height:'40%',
        
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:1,
        borderColor:'#eee',
        paddingLeft:30,
        paddingRight:30,
    },
    infoText:{
        
        fontSize:13,
        color:'#333333',

    },

    buttonView:{

        height:'30%',
        flexDirection:'row',
        justifyContent:'center',
    },

    button:{
        width:'50%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
    
});