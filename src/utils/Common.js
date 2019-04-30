import {Dimensions,PixelRatio,AsyncStorage} from "react-native";

const {width,height} = Dimensions.get('window');
const onePixel =  1 / PixelRatio.get();

function getUserId(){
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('_userId',(err,result) => {
            if(!err){
                resolve(result)
            }else{
                reject(err);
            }
        });
    });
  }

function getUser() {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('_userInfo', (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err);
            }
        });
    });
}

export { 
    width,
    height,
    onePixel,
    getUserId,
    getUser
}


