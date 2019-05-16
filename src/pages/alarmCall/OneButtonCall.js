import React, { Component } from 'react';
import { Platform, StyleSheet,Alert,Text, View, Dimensions,PermissionsAndroid,ToastAndroid, } from 'react-native';

import { observer, inject } from 'mobx-react';
import { MapView, MapTypes, Geolocation, Overlay } from 'react-native-baidu-map';
import { Button, Toast } from 'teaset';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from '../../config/color';

@inject('User')
@observer
export default class OneButtonCall extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mayType: MapTypes.NORMAL,
            zoom: 19,
            center: {
                longitude: 108.909539,
                latitude: 34.255132
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            zoomControlsVisible: false,
            marker: {
                longitude: 108.909539,
                latitude: 34.255132,
                title: "公园天下"
            },
            geolocation : {}
        };
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.checkPermission(); 
        }else{
             Toast.smile('正在开发中，敬请期待...');
        }
    }

    show(data) {
        if(page){
            const { navigate } = this.props.navigation;
            navigate(page);
        }else{
            Toast.smile('正在开发中，敬请期待...');
        }
    }

    getGeolocation() {
        Geolocation.getCurrentPosition()
            .then(data => {
                console.log('Geolocation', data);
                this.setState({
                    geolocation: data,
                    zoom: 19,
                    marker: {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        title: data.street + data.streetNumber
                    },
                    center: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    }
                });
            })
            .catch(e => {
                console.warn(e, 'error');
            })
    }

    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '我要定位权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("你已获取了定位权限")
                this.getGeolocation();
            } else {
                console.log("获取定位权限失败")
            }
        } catch (err) {
            console.log('err', err.toString())          
        }
    }

    checkPermission() {
        try {
            //返回Promise类型
            const granted = PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            granted.then((data)=>{
                console.log('data',data);
                if (!data) {
                    this.requestLocationPermission();
                }
                if (data) {
                    this.getGeolocation();
                }
            }).catch((err)=>{
                console.log('err',err);
            })
        } catch (err) {
            console.log('PermissionsAndroid.PERMISSIONS',PermissionsAndroid.PERMISSIONS);
            console.log('err1',err);
        }
    }

    onAlarm () {
		Alert.alert('一键报警', `是否确定一键报警!\r\n经度：${this.state.marker.longitude}\r\n纬度：${this.state.marker.latitude}\r\n当前位置：${this.state.geolocation.address}`, [
			{ text: '否' },
			{ text: '是', onPress: () => { Toast.success('一键报警成功') }}
		], { cancelable: false });
    }

    render() {
        if (Platform.OS === 'android') {
            console.log('Overlay', Overlay);
        const { Marker, Arc, Circle, Polyline, Polygon, InfoWindow } = Overlay;
        console.log('this.state.geolocation', this.state.geolocation);
        console.log('this.state.marker', this.state.marker);
        return (
            <View style={[styles.container, GlobalStyles.pageBg]}>
                <MapView
                    trafficEnabled={this.state.trafficEnabled}
                    baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                    zoomControlsVisible={this.state.zoomControlsVisible}
                    zoom={this.state.zoom}
                    mapType={this.state.mapType}
                    center={this.state.center}
                    style={styles.map}
                    onMapClick={(e) => {
                    }}
                >
                    <InfoWindow
                        title={this.state.marker.title ? this.state.marker.title : ''}
                        location={{ longitude: this.state.marker.longitude, latitude: this.state.marker.latitude }}
                    ></InfoWindow>

                    <Marker
                        title={this.state.marker.title ? this.state.marker.title : ''}
                        location={{ longitude: this.state.marker.longitude, latitude: this.state.marker.latitude }}
                        perspective={true}
                        flat={true}
                    >                       
                    </Marker> 
                </MapView>
                
                <View style={[styles.itemContainer, GlobalStyles.pageBg, GlobalStyles.p15]}>
                    <View style={[GlobalStyles.flexDirectColumn, GlobalStyles.center]}>
                        <Text style={[GlobalStyles.font14White, GlobalStyles.mb5]}>服务民警：{this.props.User.userNameChn}</Text>
                        <Text style={[GlobalStyles.font14White, GlobalStyles.mb5]}>当前位置：{this.state.geolocation.address}</Text>
                        <Text style={[GlobalStyles.font14White, GlobalStyles.mb5]}>经度：{this.state.marker.longitude} 纬度： {this.state.marker.latitude}</Text>
                        <Button style={{ backgroundColor: '#FD6D6D', borderColor: Color.borderColor , borderRadius: 28, width: 56, height: 56, marginTop: 10 }} onPress = { () => this.onAlarm() }>
                            <FontAwesome name={'phone'} size={32} color={"#fff"} />
                            {/* <Image source={require('../../../assets/images/baojing.png')}  style={{width: 26, height: 26, tintColor: '#fff'}} /> */}
                        </Button>
                        
                    </View>
                </View>
            </View>
        );
        }else{
             return (
                <View style={[styles.container, GlobalStyles.pageBg]}></View>
             );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    itemContainer: {
        width: Dimensions.get('window').width,
        height: 166,
        position: 'absolute',
        bottom: 0,
        elevation: 2,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 100,
        marginBottom: 16
    }
});