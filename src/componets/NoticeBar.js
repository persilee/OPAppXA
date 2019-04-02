import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Easing
} from 'react-native';

export default class NoticeBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(0),
            index:0,
            count:1
        };

        this.showHeadBar();
    }

    componentWillReceiveProps(props) {
        if(props.dataSource && props.dataSource.length != this.props.dataSource.length){
            this.setState({
                count:props.dataSource.length + 1
            })
        }
    }

    showHeadBar() {

        setInterval(()=>{
            this.state.index++;
            //每一个动画结束后的回调
            if (this.state.index >= this.state.count) {
                this.state.index = 0;
                this.state.translateY.setValue(0);
            }

            Animated.timing(this.state.translateY, {
                toValue: -20 * this.state.index, //40为文本View的高度
                duration: 300, //动画时间
                Easing: Easing.linear,
                delay: 2000 //文字停留时间
            }).start();
        },5000)

    }

    render() {
        const {
            containerStyle,
            dataSource,
        } = this.props;

        let tmpArr = dataSource.length ? [...dataSource, dataSource[0]] : null;
        //如果不添加数据第一条的话会出现最后一条空白滚动

        return (
                <View style={[styles.container,containerStyle ? containerStyle : '']}>
                    <Animated.View
                        style={{
                                transform: [
                                    {
                                        translateY: this.state.translateY
                                    }
                                ]
                            }
                        }
                    >
                        { tmpArr &&
                            tmpArr.map((item, index) => {
                                return (
                                    <Text style={styles.noticeLabel} key={index}>{item.title}</Text>
                                )
                             })
                        }
                    </Animated.View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        height:20,
        backgroundColor:"#fff",
        overflow: 'hidden',
    },
    noticeLabel:{
        height:20,
        lineHeight:20,
        fontSize:14,
        color:"#000"
    },
});
