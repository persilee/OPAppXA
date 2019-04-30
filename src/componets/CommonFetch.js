
import { width, getUser } from '../utils/Common';

export default {

    doFetch(api,params,callback,toast,failCallback,errorCallback,token) {
        let areaKey = '';
        getUser().then((_user) => {
            areaKey = _user ? JSON.parse(_user).areaKey : '';
            let requestParams = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'areaKey': areaKey,
                },
                body: JSON.stringify(params)
            };
            if (token) {
                requestParams.headers = Object.assign({}, requestParams.headers, {
                    'Authorization': token,
                });
            }
            fetch(api, requestParams)
                .then(response => {
                    // console.log(api,params,response);
                    return response.json()
                })
                .then(responseData => {
                    //  console.log('responseData',responseData)
                    if (responseData.code == 0) {
                        callback && callback(responseData)
                    } else {
                        failCallback && failCallback(responseData.msg);
                        toast && toast.show(responseData.msg);
                        console.log(api, responseData);
                    }
                })
                .catch(err => {
                    console.log(api, err);
                    toast && toast.show("网络异常", 1000);
                    errorCallback && errorCallback(err.message);
                });
        });
    },

    doPut(api,params,callback,toast,token) {
        let areaKey = '';
        getUser().then((_user) => {
            areaKey = _user ? JSON.parse(_user).areaKey : '';
            let requestParams = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'areaKey': areaKey,
            },
            body:JSON.stringify(params)
        };

        if(token){
            requestParams.headers["Authorization"] = token;
        }

        fetch(api,requestParams)
        .then(response => {
            // console.log("doPut",response);
            return response.json()})
        .then(responseData => {
            // console.log('responseData doPut',responseData);
            if(responseData.code == 0){
                callback&&callback(responseData)
            }else {
                console.error(JSON.stringify(responseData))
                toast&&toast.show(responseData.msg);
            }
        })
        .catch(err => {
            console.log(api,err);
            toast&&toast.show("网络异常",1000);
        });
        });
        
    }
}
