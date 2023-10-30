package io.adrop.bridge

import io.adrop.ads.model.AdropErrorCode

class AdropError(private val _code: AdropErrorCode) : Exception(_code.name) {
  val code: String
    get() {
      return _code.name
    }
}
