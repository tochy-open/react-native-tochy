package io.adrop.bridge

object AdropMethod {
    const val INITIALIZE = "initialize"
    const val LOAD_BANNER = "loadBanner"
    const val CREATED_BANNER = "createdBanner"

    const val DID_RECEIVE_AD = "onAdReceived"
    const val DID_CLICK_AD = "onAdClicked"
    const val DID_FAIL_TO_RECEIVE_AD = "onAdFailedToReceive"
}
