import React
import AdropAds
import UIKit


@objc(AdropBannerViewManager)
class AdropBannerViewManager: RCTViewManager {
    override static func requiresMainQueueSetup() -> Bool {
        print("!!requiresMainQueueSetup")
      return true
    }
    
    override func view() -> UIView! {
        let wrapper = AdropBannerViewWrapper(bridge: self.bridge)
        return wrapper
    }
}
