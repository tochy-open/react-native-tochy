package io.adrop.banner

import android.util.Log
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.annotations.ReactPropGroup
import io.adrop.ads.banner.AdropBanner
import io.adrop.ads.banner.AdropBannerListener
import io.adrop.ads.model.AdropErrorCode
import io.adrop.bridge.AdropChannel
import io.adrop.bridge.AdropMethod


class AdropBannerViewManager(private val context: ReactApplicationContext) :
  SimpleViewManager<AdropBanner>(), AdropBannerListener {

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(p0: ThemedReactContext): AdropBanner {
    val banner = AdropBanner(p0, null)
    banner.listener = this
    return banner
  }

  override fun receiveCommand(root: AdropBanner, commandId: String?, args: ReadableArray?) {
    super.receiveCommand(root, commandId, args)

    when (commandId) {
      LOAD -> root.load()
    }
  }

  @ReactProp(name = "unitId")
  fun setUnitId(view: AdropBanner, unitId: String) {
    view.setUnitId(unitId)

    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(AdropChannel.METHOD_BANNER_CHANNEL, view.id)
  }

  override fun onAdClicked(banner: AdropBanner) {
    sendEvent(banner.id, AdropMethod.DID_CLICK_AD, null)
  }

  override fun onAdFailedToReceive(banner: AdropBanner, error: AdropErrorCode) {
    sendEvent(banner.id, AdropMethod.DID_FAIL_TO_RECEIVE_AD, error.name)
  }

  override fun onAdReceived(banner: AdropBanner) {
    sendEvent(banner.id, AdropMethod.DID_RECEIVE_AD, null)
  }

  private fun sendEvent(viewTag: Int, method: String, value: String?) {
    val channel = AdropChannel.methodBannerChannelOf(viewTag)

    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(channel, Arguments.createMap().apply {
        putString("method", method)
        putString("message", value)
      })
  }

  companion object {
    private const val LOAD = "load"
    private const val REACT_CLASS = "AdropBannerView"
  }
}
