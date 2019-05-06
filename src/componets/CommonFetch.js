
import { width, getUser } from '../utils/Common';
import Loading from './Loading';

export default {

    // 新的方法需要传入对象参数： {api,params,callback,toast,failCallback,errorCallback,token,loading}
    doFetchExtends(orgParams) {
        let isLoading = orgParams.loading == false ? false : true;
        isLoading && Loading.showCustom();
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
                body: JSON.stringify(orgParams.params)
            };
            if (orgParams.token) {
                requestParams.headers = Object.assign({}, requestParams.headers, {
                    'Authorization': orgParams.token,
                });
            }
            fetch(orgParams.api, requestParams)
                .then(response => {
                    // console.log(api,params,response);
                    return response.json()
                })
                .then(responseData => {
                    //  console.log('responseData',responseData)
                    if (responseData.code == 0 || responseData.code == 200) {
                        orgParams.callback && orgParams.callback(responseData);
                    } else {
                        orgParams.failCallback && orgParams.failCallback(responseData.msg);
                        orgParams.toast && orgParams.toast.show(responseData.msg);
                        console.log(orgParams.api, responseData);
                    }
                    isLoading && Loading.hideCustom();
                })
                .catch(err => {
                    console.log(orgParams.api, err);
                    orgParams.toast && orgParams.toast.show("网络异常", 1000);
                    orgParams.errorCallback && errorCallback(err.message);
                    isLoading && Loading.hideCustom();
                });
        });
    },

    doFetch(api,params,callback,toast,failCallback,errorCallback,token) {
        Loading.showCustom();
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
                    if (responseData.code == 0 || responseData.code == 200) {
                        callback && callback(responseData)
                    } else {
                        failCallback && failCallback(responseData.msg);
                        toast && toast.show(responseData.msg);
                        console.log(api, responseData);
                    }
                    Loading.hideCustom();
                })
                .catch(err => {
                    console.log(api, err);
                    toast && toast.show("网络异常", 1000);
                    errorCallback && errorCallback(err.message);
                    Loading.hideCustom();
                });
        });
    },

    doPost(api,params,callback,toast,failCallback,errorCallback,token) {
        Loading.showCustom();
        let url = api + '?' + params;

        console.log('newToken', token);
        console.log('api', api);
        console.log('url', url);

        fetch(url,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
         .then(response =>{
             console.log('response',response);
            return response.json()})
            .then(responseData => {
                if(responseData.code == 200){
                    callback&&callback(responseData)
                }else {
                    failCallback && failCallback(responseData.msg);
                    toast&&toast.show(responseData.msg);
                }
                Loading.hideCustom();
            })
            .catch(err => {
                toast&&toast.show("网络异常",1000);
                errorCallback && errorCallback(err.message);
                Loading.hideCustom();
            })
    },

    doPut(api,params,callback,toast,token) {
        Loading.showCustom();
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
            Loading.hideCustom();
        })
        .catch(err => {
            console.log(api,err);
            toast&&toast.show("网络异常",1000);
            Loading.hideCustom();
        });
        });
        
    }
}
