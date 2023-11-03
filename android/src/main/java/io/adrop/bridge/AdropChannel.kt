package io.adrop.bridge

object AdropChannel {
    private const val METHOD_CHANNEL = "io.adrop.adrop-ads"
    const val METHOD_BANNER_CHANNEL = "$METHOD_CHANNEL/banner"

    fun methodBannerChannelOf(id: Int): String = "${METHOD_BANNER_CHANNEL}_${id}"
}
