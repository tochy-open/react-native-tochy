import Foundation

struct AdropMethod {
    static let INITIALIZE = "initialize"
    static let LOAD_BANNER = "loadBanner"
    static let CREATED_BANNER = "createdBanner"

    static let DID_RECEIVE_AD = "onAdReceived"
    static let DID_CLICK_AD = "onAdClicked"
    static let DID_FAIL_TO_RECEIVE_AD = "onAdFailedToReceive"
}
