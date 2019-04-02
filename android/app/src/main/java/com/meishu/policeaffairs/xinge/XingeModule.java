package com.meishu.policeaffairs.xinge;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.tencent.android.tpush.XGIOperateCallback;
import com.tencent.android.tpush.XGLocalMessage;
import com.tencent.android.tpush.XGPushConfig;
import com.tencent.android.tpush.XGPushManager;

/*
    信鸽sdk封装类
 */
public class XingeModule extends ReactContextBaseJavaModule {

    public static final String MODULE_NAME = "Xinge";
    private Context reactContext;

    public XingeModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    /**
     * 绑定module名称,在nativemodules中可以使用Xinge
     * @return
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /*****************************************************************
     *                         XGPushManager功能类
     * （对于本类提供的set和enable方法，要在XGPushManager接口前调用才能及时生效）
     *****************************************************************/

    @ReactMethod
    public void registerPush(final Promise promise){
        XGPushManager.registerPush(this.reactContext, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object data, int flag) {
                Log.d("TPush", "注册成功，设备token为：" + data);
                promise.resolve(data);
            }

            @Override
            public void onFail(Object data, int errCode, String msg) {
                Log.d("TPush", "注册失败，错误码：" + errCode + ",错误信息：" + msg);
                promise.reject(String.valueOf(errCode), msg);
            }
        });
    }

    @ReactMethod
    public void registerPushWithAccount(String account,final  Promise promise ){
        XGPushManager.registerPush(this.reactContext, account,new XGIOperateCallback() {
            @Override
            public void onSuccess(Object data, int flag) {
                Log.d("TPush", "注册成功，设备token为：" + data);
                promise.resolve(data);
            }

            @Override
            public void onFail(Object data, int errCode, String msg) {
                Log.d("TPush", "注册失败，错误码：" + errCode + ",错误信息：" + msg);
                promise.reject(String.valueOf(errCode), msg);
            }
        });
    }
    /**
     * 启动并注册APP，同时绑定账号,推荐有帐号体系的APP使用
     * （此接口会覆盖设备之前绑定过的账号，仅当前注册的账号生效）
     * @param account
     * @param promise
     */
    @ReactMethod
    public void bindAccount(String account, final Promise promise) {
        XGPushManager.bindAccount(this.reactContext, account, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object data, int flag) {
                Log.i("bindAccount","启动并注册APP，同时绑定账号 onSuccess" + data);
                promise.resolve(data);
            }

            @Override
            public void onFail(Object data, int errCode, String msg) {
                Log.i("bindAccount","启动并注册APP，同时绑定账号 onFail 错误码：" + errCode + ",错误信息：" + msg);
                promise.reject(String.valueOf(errCode), msg);
            }
        });
    }

    /**
     * 启动并注册APP，同时绑定账号,推荐有帐号体系的APP使用
     * （此接口保留之前的账号，只做增加操作，一个token下最多只能有3个账号超过限制会自动顶掉之前绑定的账号）
     * @param account
     * @param promise
     */
    @ReactMethod
    public void appendAccount(String account, final Promise promise) {
        XGPushManager.appendAccount(this.reactContext, account, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object data, int flag) {
                promise.resolve(data);
            }

            @Override
            public void onFail(Object data, int errCode, String msg) {
                promise.reject(String.valueOf(errCode), msg);
            }
        });
    }

    /**
     * 解绑指定账号
     * @param account
     * @param promise
     */
    @ReactMethod
    public void delAccount(String account, final Promise promise) {
        XGPushManager.delAccount(this.reactContext, account, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object date, int flag) {
                promise.resolve(date);
            }

            @Override
            public void onFail(Object data, int errCode, String msg) {
                promise.reject(String.valueOf(errCode), msg);
            }
        });
    }

    /**
     * 反注册
     * @param promise
     */
    @ReactMethod
    public void unregisterPush(final Promise promise) {
        XGPushManager.unregisterPush(this.reactContext, new XGIOperateCallback() {
            @Override
            public void onSuccess(Object data, int flag) {
                WritableMap map = Arguments.createMap();
                map.putString("data", (String) data);
                map.putInt("flag", flag);
                promise.resolve(map);
            }

            @Override
            public void onFail(Object data, int errCode, String msg) {
                promise.reject(String.valueOf(errCode), msg);
            }
        });
    }

    /**
     * 设置tag
     * @param tagName
     */
    @ReactMethod
    public void setTag(String tagName) {
        XGPushManager.setTag(this.reactContext, tagName);
    }

    /**
     * 删除tag
     * @param tagName
     */
    @ReactMethod
    public void deleteTag(String tagName) {
        XGPushManager.deleteTag(this.reactContext, tagName);
    }

    @ReactMethod
    public void addLocalNotification(String title, String content) {
        XGLocalMessage message = new XGLocalMessage();
        message.setTitle(title);
        message.setContent(content);
        Log.i(MODULE_NAME, title);
        Log.i(MODULE_NAME, content);
        XGPushManager.addLocalNotification(this.reactContext, message);
    }

    /**
     * 检测通知栏是否关闭
     * @param promise
     */
    @ReactMethod
    public void isNotificationOpened(Promise promise) {
        promise.resolve(XGPushManager.isNotificationOpened(this.reactContext));
    }

    /**
     * 清除单个通知
     * @param id
     */
    @ReactMethod
    public void cancelNotifaction(int id){
        XGPushManager.cancelNotifaction(this.reactContext,id);
    }

    /**
     * 清除通知栏所有通知
     */
    @ReactMethod
    public void cancelAllNotifaction(){
        XGPushManager.cancelAllNotifaction(this.reactContext);
    }



    /*****************************************************************
     *                         XGPushConfig配置类
     * （对于本类提供的set和enable方法，要在XGPushManager接口前调用才能及时生效）
     *****************************************************************/

    /**
     * 初始化
     * @param accessId
     * @param accessKey
     */
    @ReactMethod
    public void init(int accessId, String accessKey) {
        XGPushConfig.setAccessId(this.reactContext, accessId);
        XGPushConfig.setAccessKey(this.reactContext, accessKey);
    }

    /**
     * 是否开启debug模式，即输出logcat日志重要：为保证数据的安全性，发布前必须设置为false）
     */
    @ReactMethod
    public void enableDebug(boolean isDebug) {
        XGPushConfig.enableDebug(this.reactContext, isDebug);
    }

    /**
     * 开启logcat输出，方便debug，发布时请关闭
     */
    @ReactMethod
    public void isEnableDebug(Promise promise) {
        promise.resolve(XGPushConfig.isEnableDebug(this.reactContext));
    }

    /**
     * 获取设备的token，只有注册成功才能获取到正常的结果
     * @param promise
     */
    @ReactMethod
    public void getToken(Promise promise) {
        promise.resolve(XGPushConfig.getToken(this.reactContext));
    }

    /**
     * 设置上报通知栏是否关闭 默认打开
     * @param debugMode
     */
    @ReactMethod
    public void setReportNotificationStatusEnable(boolean debugMode) {
        XGPushConfig.setReportNotificationStatusEnable(this.reactContext, debugMode);
    }

    /**
     * 设置上报APP 列表，用于智能推送 默认打开
     * @param debugMode
     */
    @ReactMethod
    public void setReportApplistEnable(boolean debugMode) {
        XGPushConfig.setReportApplistEnable(this.reactContext, debugMode);
    }

    @ReactMethod
    public void setAccessId(String accessId) {
        try{
            XGPushConfig.setAccessId(this.reactContext, Long.parseLong(accessId));
        } catch (NumberFormatException exception) {
            exception.printStackTrace();
        }
    }

    @ReactMethod
    public long getAccessId() {
        return XGPushConfig.getAccessId(this.reactContext);
    }

    @ReactMethod
    public void setAccessKey(String accessKey) {
        XGPushConfig.setAccessKey(this.reactContext, accessKey);
    }

    /**
     * 获取accessKey
     * @return accessKey
     */
    @ReactMethod
    public String getAccessKey() {
        return XGPushConfig.getAccessKey(this.reactContext);
    }

    /**
     * 第三方推送开关
     * 需要在 registerPush 之前调用
     */
    @ReactMethod
    public void enableOtherPush(boolean isEnable) {
        XGPushConfig.enableOtherPush(this.reactContext, isEnable);
    }

    @ReactMethod
    public void setHuaweiDebug(boolean isDebug) {
        XGPushConfig.setHuaweiDebug(isDebug);
    }

    @ReactMethod
    public void initXiaomi(String appId, String appKey) {
        XGPushConfig.setMiPushAppId(this.reactContext, appId);
        XGPushConfig.setMiPushAppKey(this.reactContext, appKey);
    }

    @ReactMethod
    public void initMeizu(String appId, String appKey) {
        //设置魅族APPID和APPKEY
        XGPushConfig.setMzPushAppId(this.reactContext, appId);
        XGPushConfig.setMzPushAppKey(this.reactContext, appKey);
    }


}
