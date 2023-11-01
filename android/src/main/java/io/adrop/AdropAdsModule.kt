package io.adrop

import android.app.Application
import io.adrop.bridge.AdropError
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.adrop.ads.Adrop
import io.adrop.ads.model.AdropErrorCode

class AdropAdsModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun initialize(production: Boolean) {
    val context = reactApplicationContext.applicationContext
    if (context is Application) {
      Adrop.initialize(context, production)
    } else {
      throw AdropError(AdropErrorCode.ERROR_CODE_INITIALIZE)
    }
  }

  companion object {
    const val NAME = "AdropAds"
  }
}
