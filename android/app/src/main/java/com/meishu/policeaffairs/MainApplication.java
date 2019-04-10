package com.meishu.policeaffairs;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactApplication;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.meishu.policeaffairs.xinge.XingePackage;
import com.oblador.vectoricons.VectorIconsPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new BackgroundJobPackage(),
            new ReactNativePushNotificationPackage(),
            new RNCWebViewPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage(),
            new ImagePickerPackage(),
            new RNExitAppPackage(),
            new SvgPackage(),
            new SplashScreenReactPackage(),
              new XingePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {

    try {
      Class aClass = Class.forName("android.content.pm.PackageParser$Package");
      Constructor declaredConstructor = aClass.getDeclaredConstructor(String.class);
      declaredConstructor.setAccessible(true);
    } catch (Exception e) {
      e.printStackTrace();
    }
    try {
      Class cls = Class.forName("android.app.ActivityThread");
      Method declaredMethod = cls.getDeclaredMethod("currentActivityThread");
      declaredMethod.setAccessible(true);
      Object activityThread = declaredMethod.invoke(null);
      Field mHiddenApiWarningShown = cls.getDeclaredField("mHiddenApiWarningShown");
      mHiddenApiWarningShown.setAccessible(true);
      mHiddenApiWarningShown.setBoolean(activityThread, true);
    } catch (Exception e) {
      e.printStackTrace();
    }

    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
